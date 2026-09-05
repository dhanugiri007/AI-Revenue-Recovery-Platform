const recoveryCaseModel = require('../models/recoveryCase.model');
const paymentModel = require('../models/payment.model');
const customerModel = require('../models/customer.model');
const auditLogModel = require('../models/auditLog.model');

const { retrieveRelevantPolicies } = require('./retrieval.service');
const { getAgentDecision } = require('./gemini.service');
const { sendOutreachEmail } = require('./email.service');           // NEW
const { emitCaseUpdate } = require('../socket');

const MAX_RETRIES = 2;
const MAX_OUTREACH_PER_DAY = 1;
const RETRY_SUCCESS_RATE = 0.5;   // simulated gateway success chance

const SYSTEM_PROMPT = `You are a payment recovery agent. You may ONLY take actions explicitly permitted by the retrieved policy text provided to you. If the policy does not clearly cover this situation, or no relevant policy was retrieved, you MUST choose "escalateToHuman". Do not infer intent beyond what is written in the policy text. Do not use general knowledge or common sense about payment recovery - only the provided policy text is authoritative. Always cite the policyChunkId of the specific chunk your decision is based on. If you cannot cite a specific chunk that supports your action, you must escalate instead.`;

function broadcastCaseState(recoveryCase, extra = {}) {
    emitCaseUpdate(recoveryCase.customerId.toString(), {
        caseId: recoveryCase._id,
        state: recoveryCase.state,
        retryCount: recoveryCase.retryCount,
        outreachCount: recoveryCase.outreachCount,
        updatedAt: recoveryCase.updatedAt,
        ...extra
    });
}

async function processRecoveryCase(caseId) {
    const recoveryCase = await recoveryCaseModel.findById(caseId);
    if (!recoveryCase) throw new Error('RecoveryCase not found');
    if (['resolved', 'escalated'].includes(recoveryCase.state)) return; // don't reprocess closed cases

    const payment = await paymentModel.findById(recoveryCase.paymentId);
    const customer = await customerModel.findById(recoveryCase.customerId);

    recoveryCase.state = 'analyzing';
    await recoveryCase.save();
    broadcastCaseState(recoveryCase);

    const queryText = `Payment failed. Reason: ${payment.failureReason}. Customer type: ${customer.customerType}. Amount: ${payment.amount}. Retry attempts so far: ${recoveryCase.retryCount}.`;
    const policies = await retrieveRelevantPolicies(queryText, 5, recoveryCase.userId);

    await auditLogModel.create({
        recoveryCaseId: recoveryCase._id,
        step: 'policy_retrieved',
        policiesRetrieved: policies.map(p => ({ chunkId: p.chunkId, policyId: p.policyId, filename: p.filename, text: p.text }))
    });

    if (policies.length === 0) {
        return await escalate(recoveryCase, 'No relevant policy found for this case');
    }

    const policyText = policies.map(p => `[chunkId: ${p.chunkId}] ${p.text}`).join('\n\n');

    const userPrompt = `
CASE DETAILS:
- Payment amount: ${payment.amount} ${payment.currency}
- Failure reason: ${payment.failureReason}
- Customer type: ${customer.customerType}
- Retry attempts so far: ${recoveryCase.retryCount}
- Outreach messages sent: ${recoveryCase.outreachCount}

RETRIEVED POLICY TEXT (only source of truth - do not use outside knowledge):
${policyText}

Decide the single next action for this case.
`;

    let decision;
    try {
        decision = await getAgentDecision({ systemPrompt: SYSTEM_PROMPT, userPrompt });
    } catch (err) {
        await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'error', outcome: 'Gemini call failed', raw: { error: err.message } });
        return await escalate(recoveryCase, 'Agent decision failed - escalated as a safety fallback');
    }

    await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'agent_decision', decision });

    const citedChunkExists = policies.some(p => p.chunkId === decision.policyChunkId);
    if (!citedChunkExists || decision.confidence === 'low') {
        await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'guardrail_blocked', outcome: `Blocked action "${decision.action}" - no valid citation or low confidence` });
        return await escalate(recoveryCase, 'Escalated - decision lacked a valid policy citation or had low confidence');
    }

    return await executeAction(recoveryCase, payment, customer, decision);
}

async function executeAction(recoveryCase, payment, customer, decision) {
    if (decision.action === 'retryPayment') {
        // Atomically increment retryCount only if still under the limit.
        // This closes a race condition where two concurrent calls to
        // processRecoveryCase (e.g. the setTimeout re-check overlapping
        // a duplicate trigger) could both read the same stale retryCount
        // and both proceed, silently bypassing MAX_RETRIES.
        const updatedCase = await recoveryCaseModel.findOneAndUpdate(
            { _id: recoveryCase._id, retryCount: { $lt: MAX_RETRIES } },
            { $inc: { retryCount: 1 }, $set: { lastActionAt: new Date() } },
            { new: true }
        );

        if (!updatedCase) {
            // Either already at the limit, or another in-flight call just claimed this retry slot.
            await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'guardrail_blocked', outcome: `Blocked retryPayment - max retries (${MAX_RETRIES}) already reached` });
            return await escalate(recoveryCase, 'Max retries reached - escalated instead');
        }

        // keep the in-memory object in sync with what was actually persisted
        recoveryCase.retryCount = updatedCase.retryCount;
        recoveryCase.lastActionAt = updatedCase.lastActionAt;

        // --- SIMULATED payment gateway call (no real gateway in this project) ---
        const succeeded = Math.random() < RETRY_SUCCESS_RATE;

        if (succeeded) {
            payment.status = 'success';
            await payment.save();

            recoveryCase.state = 'resolved';
            await recoveryCase.save();
            broadcastCaseState(recoveryCase, { lastAction: 'retryPayment', result: 'success' });

            await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'action_executed', outcome: `Retry #${recoveryCase.retryCount} succeeded - payment recovered`, decision });
            return { action: 'retryPayment', result: 'success', case: recoveryCase };
        } else {
            recoveryCase.state = 'action_taken';
            await recoveryCase.save();
            broadcastCaseState(recoveryCase, { lastAction: 'retryPayment', result: 'failed' });

            await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'action_executed', outcome: `Retry #${recoveryCase.retryCount} failed`, decision });

            // re-evaluate the case shortly after, so the agent can decide the next step
            // (in production this would be a proper delayed job, not setTimeout)
            setTimeout(() => {
                processRecoveryCase(recoveryCase._id).catch(err => console.log('Re-evaluation failed:', err.message));
            }, 5000);

            return { action: 'retryPayment', result: 'failed', case: recoveryCase };
        }
    }

    if (decision.action === 'sendOutreach') {
        if (recoveryCase.outreachCount >= MAX_OUTREACH_PER_DAY) {
            await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'guardrail_blocked', outcome: `Blocked sendOutreach - daily limit (${MAX_OUTREACH_PER_DAY}) already reached` });
            return await escalate(recoveryCase, 'Outreach limit reached - escalated instead');
        }

        try {
            await sendOutreachEmail({
                toEmail: customer.email,
                customerName: customer.name,
                amount: payment.amount,
                currency: payment.currency,
                reasoning: decision.reasoning
            });
        } catch (err) {
            await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'error', outcome: 'Email sending failed', raw: { error: err.message } });
            return await escalate(recoveryCase, 'Outreach email failed to send - escalated instead');
        }

        recoveryCase.outreachCount += 1;
        recoveryCase.state = 'action_taken';
        recoveryCase.lastActionAt = new Date();
        await recoveryCase.save();
        broadcastCaseState(recoveryCase, { lastAction: 'sendOutreach' });

        await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'action_executed', outcome: `Outreach email sent to ${customer.email}`, decision });
        return { action: 'sendOutreach', case: recoveryCase };
    }

    return await escalate(recoveryCase, decision.reasoning);
}

async function escalate(recoveryCase, reason) {
    recoveryCase.state = 'escalated';
    recoveryCase.escalationReason = reason;
    recoveryCase.lastActionAt = new Date();
    await recoveryCase.save();
    broadcastCaseState(recoveryCase, { lastAction: 'escalateToHuman', reason });

    await auditLogModel.create({ recoveryCaseId: recoveryCase._id, step: 'action_executed', outcome: `Escalated to human: ${reason}` });
    return { action: 'escalateToHuman', case: recoveryCase };
}

module.exports = { processRecoveryCase };
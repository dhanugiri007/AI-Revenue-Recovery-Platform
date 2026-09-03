const recoveryCaseModel = require('../models/recoveryCase.model');
const auditLogModel = require('../models/auditLog.model');
const { emitCaseUpdate } = require('../socket');

async function getCasesByCustomer(req, res) {
    try {
        const { customerId } = req.params;
        const cases = await recoveryCaseModel.find({ customerId }).sort({ createdAt: -1 });
        return res.status(200).json({ cases });
    } catch (error) {
        console.log("Get cases error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getCaseAuditTrail(req, res) {
    try {
        const { caseId } = req.params;
        const recoveryCase = await recoveryCaseModel.findById(caseId);
        if (!recoveryCase) return res.status(404).json({ message: "Case not found" });

        const logs = await auditLogModel.find({ recoveryCaseId: caseId }).sort({ createdAt: 1 });
        return res.status(200).json({ case: recoveryCase, logs });
    } catch (error) {
        console.log("Get audit trail error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/recovery-case/escalations - all cases awaiting human review, across all your customers
async function getEscalatedCases(req, res) {
    try {
        const cases = await recoveryCaseModel.find({ state: 'escalated' })
            .populate('customerId', 'name email customerType')
            .populate('paymentId', 'amount currency failureReason')
            .sort({ lastActionAt: -1 });

        return res.status(200).json({ cases });
    } catch (error) {
        console.log("Get escalated cases error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/recovery-case/:caseId/resolve - a human closes the case
async function resolveCase(req, res) {
    try {
        const { caseId } = req.params;
        const { note } = req.body;

        const recoveryCase = await recoveryCaseModel.findById(caseId);
        if (!recoveryCase) return res.status(404).json({ message: "Case not found" });
        if (recoveryCase.state !== 'escalated') {
            return res.status(400).json({ message: "Only escalated cases can be manually resolved" });
        }

        recoveryCase.state = 'resolved';
        recoveryCase.resolvedBy = req.user.id;
        recoveryCase.resolvedAt = new Date();
        recoveryCase.resolutionNote = note || '';
        await recoveryCase.save();

        await auditLogModel.create({
            recoveryCaseId: recoveryCase._id,
            step: 'action_executed',
            outcome: `Manually resolved by human. Note: ${note || '(none)'}`
        });

        emitCaseUpdate(recoveryCase.customerId.toString(), {
            caseId: recoveryCase._id,
            state: recoveryCase.state,
            lastAction: 'humanResolved'
        });

        return res.status(200).json({ message: "Case resolved", case: recoveryCase });
    } catch (error) {
        console.log("Resolve case error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function getAllCases(req, res) {
    try {
        const cases = await recoveryCaseModel.find({})
            .populate('customerId', 'name email customerType')
            .populate('paymentId', 'amount currency failureReason status')
            .sort({ createdAt: -1 });

        return res.status(200).json({ cases });
    } catch (error) {
        console.log("Get all cases error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { getCasesByCustomer, getCaseAuditTrail, getEscalatedCases, resolveCase,getAllCases };
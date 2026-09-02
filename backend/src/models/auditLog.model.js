const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    recoveryCaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RecoveryCase',
        required: true
    },
    step: {
        type: String,
        enum: ['policy_retrieved', 'agent_decision', 'action_executed', 'guardrail_blocked', 'error'],
        required: true
    },
    policiesRetrieved: [{
        chunkId: String,
        policyId: String,
        filename: String,
        text: String
    }],
    decision: {
        action: String,          // retryPayment | sendOutreach | escalateToHuman
        reasoning: String,
        policyChunkId: String,
        confidence: String
    },
    outcome: {
        type: String   // free text: what actually happened
    },
    raw: {
        type: mongoose.Schema.Types.Mixed   // catch-all for debugging (raw LLM response, errors, etc.)
    }
}, {
    timestamps: true
});

const auditLogModel = mongoose.model('AuditLog', auditLogSchema);

module.exports = auditLogModel;
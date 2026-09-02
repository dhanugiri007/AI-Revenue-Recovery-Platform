const recoveryCaseModel = require('../models/recoveryCase.model');
const auditLogModel = require('../models/auditLog.model');

// GET /api/recovery-case/customer/:customerId
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

// GET /api/recovery-case/:caseId/audit
async function getCaseAuditTrail(req, res) {
    try {
        const { caseId } = req.params;
        const recoveryCase = await recoveryCaseModel.findById(caseId);
        if (!recoveryCase) {
            return res.status(404).json({ message: "Case not found" });
        }

        const logs = await auditLogModel.find({ recoveryCaseId: caseId }).sort({ createdAt: 1 });
        return res.status(200).json({ case: recoveryCase, logs });
    } catch (error) {
        console.log("Get audit trail error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getCasesByCustomer, getCaseAuditTrail };
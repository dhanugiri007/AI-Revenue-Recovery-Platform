const express = require('express');
const router = express.Router();

const recoveryCaseController = require('../controllers/recoveryCase.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

router.get('/customer/:customerId', authMiddleware.protect, recoveryCaseController.getCasesByCustomer);
router.get('/:caseId/audit', authMiddleware.protect, recoveryCaseController.getCaseAuditTrail);

module.exports = router;
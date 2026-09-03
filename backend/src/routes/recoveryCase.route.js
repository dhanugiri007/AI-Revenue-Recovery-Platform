const express = require('express');
const router = express.Router();

const recoveryCaseController = require('../controllers/recoveryCase.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

router.get('/all', authMiddleware.protect, recoveryCaseController.getAllCases);  
router.get('/escalations', authMiddleware.protect, recoveryCaseController.getEscalatedCases);
router.patch('/:caseId/resolve', authMiddleware.protect, recoveryCaseController.resolveCase);
router.get('/customer/:customerId', authMiddleware.protect, recoveryCaseController.getCasesByCustomer);
router.get('/:caseId/audit', authMiddleware.protect, recoveryCaseController.getCaseAuditTrail);

module.exports = router;
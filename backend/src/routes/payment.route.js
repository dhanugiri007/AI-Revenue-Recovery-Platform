const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const express = require('express');
const router = express.Router();

router.post('/generate/:customerId', authMiddleware.protect, paymentController.generatePayment);

module.exports = router;
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const { paymentGenerationLimiter } = require('../middlewares/rateLimiter.middleware');   // NEW

const express = require('express');
const router = express.Router();

router.post('/generate/:customerId', authMiddleware.protect, paymentGenerationLimiter, paymentController.generatePayment);

module.exports = router;
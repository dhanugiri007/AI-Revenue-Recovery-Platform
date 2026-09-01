const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const express = require('express');

const router = express.Router();

router.post('/create-customer', authMiddleware.protect, customerController.createCustomer);
router.get('/get-customers', authMiddleware.protect, customerController.getAllCustomer);
router.delete('/delete-customer', authMiddleware.protect, customerController.deleteCustomer);
router.get('/get-customer-payments/:id', authMiddleware.protect, customerController.getCustomerPayment);

module.exports = router;
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const express = require('express');

const router = express();


router.post('/create-customer',authMiddleware.protect,customerController.createCustomer);
router.get('/get-customers',authMiddleware.protect,customerController.getAllCustomer);
router.get('/get-customer/:id', authMiddleware.protect, customerController.getCustomer);

module.exports = router;
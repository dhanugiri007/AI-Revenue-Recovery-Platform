const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middlewares');
const router = express.Router();


router.post('/register', authController.registerUserController);
router.post('/login',authController.loginUserController);
router.post('/get-me',authMiddleware.protect, authController.getMeController);


module.exports = router;
const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

router.get('/summary', authMiddleware.protect, dashboardController.getDashboardSummary);

module.exports = router;
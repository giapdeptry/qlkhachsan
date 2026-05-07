const express = require('express');
const router = express.Router();

const { asyncHandler, authAdmin } = require('../auth/checkAuth');

const dashboardController = require('../controllers/dashboard.controller');

// Dashboard routes chỉ dành cho admin
router.get('/', authAdmin, asyncHandler(dashboardController.getDashboard));
router.get('/charts', authAdmin, asyncHandler(dashboardController.getChartData));

module.exports = router;

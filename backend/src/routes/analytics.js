const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getElectionStatistics,
  getElectionActivity,
  getBlockchainData,
  getBiometricLogs,
  getDashboardOverview
} = require('../controllers/analyticsController');

// All analytics routes require admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

// Dashboard overview
router.get('/overview', getDashboardOverview);

// Election-specific analytics
router.get('/election/:id/statistics', getElectionStatistics);
router.get('/election/:id/activity', getElectionActivity);
router.get('/election/:id/blockchain', getBlockchainData);
router.get('/election/:id/biometric-logs', getBiometricLogs);

module.exports = router;

const express = require('express');
const router = express.Router();
const biometricController = require('../controllers/biometricController');
const { authenticate, authorize } = require('../middleware/auth');

// All biometric endpoints require authentication
router.post('/register', authenticate, authorize(['voter']), biometricController.registerBiometric);
router.post('/verify', authenticate, authorize(['voter']), biometricController.verifyBiometric);
router.get('/status', authenticate, biometricController.getBiometricStatus);

module.exports = router;

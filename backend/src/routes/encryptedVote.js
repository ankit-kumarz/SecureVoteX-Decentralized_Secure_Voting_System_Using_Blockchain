const express = require('express');
const router = express.Router();
const encryptedVoteController = require('../controllers/encryptedVoteController');
const { authenticate, authorize } = require('../middleware/auth');

// Generate encryption keys for election (admin only)
router.post('/election/:id/generate-keys', authenticate, authorize(['admin']), encryptedVoteController.generateElectionKeys);

// Get election public key (authenticated users only)
router.get('/election/:id/public-key', authenticate, encryptedVoteController.getElectionPublicKey);

// Cast encrypted vote (voters only)
router.post('/encrypted', authenticate, authorize(['voter']), encryptedVoteController.castEncryptedVote);

// Get user's vote receipts
router.get('/receipts', authenticate, encryptedVoteController.getUserReceipts);

// Verify receipt (public endpoint)
router.get('/receipt/:receiptHash/verify', encryptedVoteController.verifyReceipt);

module.exports = router;

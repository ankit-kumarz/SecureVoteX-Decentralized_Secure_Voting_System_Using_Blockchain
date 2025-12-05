const db = require('../models/db');
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Get all vote transaction logs (admin)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    // You may want to join with candidates for better info
    const logs = await db('votes')
      .leftJoin('candidates', 'votes.candidate_id', 'candidates.id')
      .select(
        'votes.id',
        'votes.voter_id',
        'votes.candidate_id',
        'votes.election_id',
        'votes.created_at',
        'votes.tx_hash',
        'candidates.name as candidate_name',
        'candidates.party as candidate_party'
      );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
});

module.exports = router;

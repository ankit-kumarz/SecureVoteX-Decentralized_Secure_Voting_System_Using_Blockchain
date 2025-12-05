const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticate, authorize(['admin']), upload.single('image'), candidateController.addCandidate);
router.get('/all', authenticate, authorize(['admin']), candidateController.getAllCandidates);
router.get('/:election_id', authenticate, candidateController.getCandidatesByElection);
router.delete('/:id', authenticate, authorize(['admin']), candidateController.deleteCandidate);

module.exports = router;

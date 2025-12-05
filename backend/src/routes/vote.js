const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['voter']), voteController.castVote);
router.get('/all', authenticate, authorize(['admin']), voteController.getAllVotes);
router.get('/election/:election_id', authenticate, voteController.getVotesByElection);
router.get('/user/:voter_id', authenticate, voteController.getVotesByVoter);
router.get('/my-votes', authenticate, authorize(['voter']), voteController.getMyVotes);
router.get('/my-count', authenticate, authorize(['voter']), voteController.getMyVoteCount);
router.get('/activity-timeline', authenticate, authorize(['voter']), voteController.getActivityTimeline);
router.get('/my-vote/:electionId', authenticate, authorize(['voter']), voteController.getMyVoteInElection);

module.exports = router;

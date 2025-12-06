const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['admin']), electionController.createElection);
router.get('/active-count', authenticate, electionController.getActiveElectionsCount);
router.get('/active-elections', authenticate, electionController.getActiveElections);
router.get('/', authenticate, electionController.getAllElections);
router.delete('/:id', authenticate, authorize(['admin']), electionController.deleteElection);

module.exports = router;

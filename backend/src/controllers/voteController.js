
const voteModel = require('../models/vote');

const castVote = async (req, res) => {
  try {
    const { election_id, candidate_id, tx_hash } = req.body;
    const voter_id = req.user.voter_id;
    if (!election_id || !candidate_id || !voter_id) return res.status(400).json({ message: 'Missing fields' });
    const alreadyVoted = await voteModel.hasVoted(voter_id, election_id);
    if (alreadyVoted) return res.status(409).json({ message: 'Already voted' });
    let vote;
    if (tx_hash) {
      [vote] = await voteModel.castVoteWithTx({ election_id, candidate_id, voter_id }, tx_hash);
    } else {
      [vote] = await voteModel.castVote({ election_id, candidate_id, voter_id });
    }
    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cast vote', error: err.message });
  }
};

const getVotesByElection = async (req, res) => {
  try {
    const { election_id } = req.params;
    const votes = await voteModel.getVotesByElection(election_id);
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch votes', error: err.message });
  }
};

const getVotesByVoter = async (req, res) => {
  try {
    const { voter_id } = req.params;
    const votes = await voteModel.getVotesByVoter(voter_id);
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch votes', error: err.message });
  }
};

/**
 * Get detailed vote history for authenticated user
 * Returns enriched data with election and candidate details
 * GET /api/vote/my-votes
 */
const getMyVotes = async (req, res) => {
  try {
    const voter_id = req.user.voter_id;
    
    if (!voter_id) {
      return res.status(400).json({ message: 'Voter ID not found' });
    }
    
    const detailedVotes = await voteModel.getDetailedVotesByVoter(voter_id);
    
    // Transform data into structured format
    const formattedVotes = detailedVotes.map(vote => ({
      vote_id: vote.vote_id,
      voter_id: vote.voter_id,
      vote_timestamp: vote.vote_timestamp,
      receipt_hash: vote.receipt_hash,
      blockchain_tx: vote.blockchain_tx || vote.receipt_blockchain_tx,
      
      election: {
        id: vote.election_id,
        title: vote.election_title,
        description: vote.election_description,
        start_date: vote.election_start_date,
        end_date: vote.election_end_date
      },
      
      candidate: {
        id: vote.candidate_id,
        name: vote.candidate_name,
        party: vote.candidate_party,
        manifesto: vote.candidate_manifesto,
        image: vote.candidate_image
      }
    }));
    
    res.json({
      success: true,
      count: formattedVotes.length,
      votes: formattedVotes
    });
  } catch (err) {
    console.error('Failed to fetch detailed votes:', err);
    res.status(500).json({ message: 'Failed to fetch vote history', error: err.message });
  }
};

/**
 * Get vote statistics for authenticated user
 * GET /api/vote/my-count
 */
const getMyVoteCount = async (req, res) => {
  try {
    const voter_id = req.user.voter_id;
    
    if (!voter_id) {
      return res.status(400).json({ message: 'Voter ID not found' });
    }
    
    const votes = await voteModel.getVotesByVoter(voter_id);
    const lastVote = votes.length > 0 ? votes[0] : null;
    
    res.json({
      success: true,
      totalVotes: votes.length,
      totalElections: votes.length, // Each vote is one election
      lastVoteTime: lastVote ? lastVote.created_at : null
    });
  } catch (err) {
    console.error('Failed to fetch vote count:', err);
    res.status(500).json({ message: 'Failed to fetch vote statistics', error: err.message });
  }
};

/**
 * Get all votes for admin (blockchain explorer)
 * GET /api/vote/all
 */
const getAllVotes = async (req, res) => {
  try {
    const db = require('../models/db');
    
    const votes = await db('votes')
      .leftJoin('users', 'votes.voter_id', 'users.id')  // Fixed: use id, not voter_id
      .leftJoin('elections', 'votes.election_id', 'elections.id')
      .leftJoin('candidates', 'votes.candidate_id', 'candidates.id')
      .select(
        'votes.id',
        'votes.voter_id',
        'votes.election_id',
        'votes.candidate_id',
        'votes.encrypted_vote',
        'votes.vote_salt',
        'votes.blockchain_tx as transaction_hash',
        'votes.created_at as timestamp',
        'users.email as voter_email',
        'users.voter_id as voter_id_string',
        'elections.title as election_title',
        'candidates.name as candidate_name'
      )
      .orderBy('votes.created_at', 'desc');
    
    // Add blockchain status to each vote
    const votesWithStatus = votes.map(vote => ({
      ...vote,
      vote_hash: vote.transaction_hash || `VOTE-${vote.id}`,
      blockchain_status: vote.transaction_hash ? 'confirmed' : 'pending'
    }));
    
    res.json({
      success: true,
      votes: votesWithStatus,
      total: votesWithStatus.length
    });
  } catch (err) {
    console.error('Failed to fetch all votes:', err);
    res.status(500).json({ message: 'Failed to fetch votes', error: err.message });
  }
};

/**
 * Get activity timeline for authenticated user
 * GET /api/vote/activity-timeline
 */
const getActivityTimeline = async (req, res) => {
  try {
    const voter_id = req.user.voter_id;
    const db = require('../models/db');
    
    if (!voter_id) {
      return res.status(400).json({ message: 'Voter ID not found' });
    }
    
    const activities = [];
    
    // Get user account creation
    const user = await db('users').where({ voter_id }).first();
    if (user && user.created_at) {
      activities.push({
        type: 'account_created',
        timestamp: user.created_at,
        description: 'Account registered',
        icon: 'user'
      });
    }
    
    // Get face verification status
    const userId = user ? user.id : null;
    if (userId) {
      const voterProfile = await db('voter_profiles').where({ user_id: userId }).first();
      if (voterProfile && voterProfile.created_at) {
        activities.push({
          type: 'face_verified',
          timestamp: voterProfile.created_at,
          description: 'Face verification completed',
          icon: 'shield'
        });
      }
    }
    
    // Get all votes
    const votes = await voteModel.getDetailedVotesByVoter(voter_id);
    votes.forEach(vote => {
      activities.push({
        type: 'vote_cast',
        timestamp: vote.vote_timestamp,
        description: `Voted in ${vote.election_title}`,
        electionId: vote.election_id,
        icon: 'vote'
      });
    });
    
    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (err) {
    console.error('Failed to fetch activity timeline:', err);
    res.status(500).json({ message: 'Failed to fetch activity timeline', error: err.message });
  }
};

/**
 * Get user's vote for a specific election
 * GET /api/vote/my-vote/:electionId
 */
const getMyVoteInElection = async (req, res) => {
  try {
    const voter_id = req.user.voter_id;
    const { electionId } = req.params;
    const db = require('../models/db');

    const vote = await db('votes')
      .select(
        'votes.vote_id',
        'votes.voter_id',
        'votes.election_id',
        'votes.candidate_id',
        'votes.vote_timestamp',
        'votes.tx_hash',
        'candidates.name as candidate_name',
        'candidates.party',
        'candidates.manifesto'
      )
      .join('candidates', 'votes.candidate_id', 'candidates.candidate_id')
      .where({
        'votes.voter_id': voter_id,
        'votes.election_id': electionId
      })
      .first();

    if (!vote) {
      return res.status(404).json({ message: 'No vote found for this election' });
    }

    res.json(vote);
  } catch (err) {
    console.error('Failed to fetch vote:', err);
    res.status(500).json({ message: 'Failed to fetch vote', error: err.message });
  }
};

module.exports = { 
  castVote, 
  getVotesByElection, 
  getVotesByVoter, 
  getMyVotes, 
  getMyVoteCount, 
  getActivityTimeline,
  getMyVoteInElection,
  getAllVotes
};

const db = require('./db');


const castVote = async (vote) => {
  return db('votes').insert(vote).returning('*');
};

const castVoteWithTx = async (vote, tx_hash) => {
  return db('votes').insert({ ...vote, tx_hash }).returning('*');
};

const hasVoted = async (voter_id, election_id) => {
  // voter_id is a string like "VOTER-xxx", but we need to check using user record
  // Get the user ID from the voter_id first
  const user = await db('users').where({ voter_id }).select('id').first();
  if (!user) {
    return false; // User not found, so hasn't voted
  }
  return db('votes').where({ voter_id: user.id, election_id }).first();
};

const getVotesByElection = async (election_id) => {
  return db('votes').where({ election_id });
};

const getVotesByVoter = async (voter_id) => {
  // voter_id is a string like "VOTER-xxx", get the user ID first
  const user = await db('users').where({ voter_id }).select('id').first();
  if (!user) return [];
  return db('votes').where({ voter_id: user.id }).orderBy('created_at', 'desc');
};

/**
 * Get detailed vote history with election and candidate information
 * Returns enriched data for beautiful UI display
 */
const getDetailedVotesByVoter = async (voter_id) => {
  // voter_id is a string like "VOTER-xxx", get the user ID first
  const user = await db('users').where({ voter_id }).select('id').first();
  if (!user) return [];
  return db('votes')
    .where('votes.voter_id', user.id)
    .join('elections', 'votes.election_id', 'elections.id')
    .join('candidates', 'votes.candidate_id', 'candidates.id')
    .leftJoin('vote_receipts', function() {
      this.on('vote_receipts.user_id', '=', user.id)
          .andOn('vote_receipts.election_id', '=', 'votes.election_id');
    })
    .select(
      // Vote details
      'votes.id as vote_id',
      'votes.voter_id',
      'votes.tx_hash',
      'votes.created_at as vote_timestamp',
      
      // Election details
      'elections.id as election_id',
      'elections.title as election_title',
      'elections.description as election_description',
      'elections.start_date as election_start_date',
      'elections.end_date as election_end_date',
      
      // Candidate details
      'candidates.id as candidate_id',
      'candidates.name as candidate_name',
      'candidates.party as candidate_party',
      'candidates.manifesto as candidate_manifesto',
      'candidates.image as candidate_image',
      
      // Receipt details
      'vote_receipts.receipt_hash',
      'vote_receipts.tx_hash as receipt_tx_hash'
    )
    .orderBy('votes.created_at', 'desc');
};

module.exports = {
  castVote,
  castVoteWithTx,
  hasVoted,
  getVotesByElection,
  getVotesByVoter,
  getDetailedVotesByVoter
};

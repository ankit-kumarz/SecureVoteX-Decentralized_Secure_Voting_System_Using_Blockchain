const db = require('./db');

/**
 * Vote Receipt Model
 */

const createVoteReceipt = async (receipt) => {
  return db('vote_receipts').insert(receipt).returning('*');
};

const getVoteReceiptByHash = async (receipt_hash) => {
  return db('vote_receipts')
    .where({ receipt_hash })
    .first();
};

const getVoteReceiptsByUserId = async (user_id) => {
  return db('vote_receipts')
    .where({ user_id })
    .orderBy('created_at', 'desc');
};

const getVoteReceiptsByElection = async (election_id) => {
  return db('vote_receipts')
    .where({ election_id })
    .orderBy('created_at', 'desc');
};

const hasVoteReceipt = async (user_id, election_id) => {
  const receipt = await db('vote_receipts')
    .where({ user_id, election_id })
    .first();
  return !!receipt;
};

const deleteVoteReceipt = async (receipt_hash) => {
  return db('vote_receipts').where({ receipt_hash }).del();
};

module.exports = {
  createVoteReceipt,
  getVoteReceiptByHash,
  getVoteReceiptsByUserId,
  getVoteReceiptsByElection,
  hasVoteReceipt,
  deleteVoteReceipt
};

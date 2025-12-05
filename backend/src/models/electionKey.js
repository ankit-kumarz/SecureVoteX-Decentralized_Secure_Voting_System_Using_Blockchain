const db = require('./db');

/**
 * Election Keys Model
 */

const createElectionKey = async (keyData) => {
  return db('election_keys').insert(keyData).returning('*');
};

const getElectionKeyByElectionId = async (election_id) => {
  return db('election_keys').where({ election_id }).first();
};

const getElectionPublicKey = async (election_id) => {
  const key = await db('election_keys')
    .where({ election_id })
    .select('public_key', 'public_key_fingerprint', 'key_created_at')
    .first();
  return key;
};

const deleteElectionKey = async (election_id) => {
  return db('election_keys').where({ election_id }).del();
};

const hasElectionKey = async (election_id) => {
  const key = await db('election_keys').where({ election_id }).first();
  return !!key;
};

module.exports = {
  createElectionKey,
  getElectionKeyByElectionId,
  getElectionPublicKey,
  deleteElectionKey,
  hasElectionKey
};

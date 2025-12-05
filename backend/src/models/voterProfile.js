const db = require('./db');

/**
 * Voter Biometric Profile Model
 */

const createVoterProfile = async (profile) => {
  return db('voter_profiles').insert(profile).returning('*');
};

const getVoterProfileByUserId = async (user_id) => {
  return db('voter_profiles').where({ user_id }).first();
};

const updateVoterProfile = async (user_id, updates) => {
  return db('voter_profiles')
    .where({ user_id })
    .update({ ...updates, updated_at: db.fn.now() })
    .returning('*');
};

const deleteVoterProfile = async (user_id) => {
  return db('voter_profiles').where({ user_id }).del();
};

const hasVoterProfile = async (user_id) => {
  const profile = await db('voter_profiles').where({ user_id }).first();
  return !!profile;
};

module.exports = {
  createVoterProfile,
  getVoterProfileByUserId,
  updateVoterProfile,
  deleteVoterProfile,
  hasVoterProfile
};

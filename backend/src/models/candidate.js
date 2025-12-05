const db = require('./db');

const createCandidate = async (candidate) => {
  return db('candidates').insert(candidate).returning('*');
};

const getCandidatesByElection = async (election_id) => {
  return db('candidates').where({ election_id });
};

const deleteCandidate = async (id) => {
  return db('candidates').where({ id }).del();
};

module.exports = {
  createCandidate,
  getCandidatesByElection,
  deleteCandidate
};

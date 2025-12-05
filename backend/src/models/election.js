const db = require('./db');

const createElection = async (election) => {
  return db('elections').insert(election).returning('*');
};

const getAllElections = async () => {
  return db('elections').select('*');
};

const getElectionById = async (id) => {
  return db('elections').where({ id }).first();
};

const deleteElection = async (id) => {
  return db('elections').where({ id }).del();
};

module.exports = {
  createElection,
  getAllElections,
  getElectionById,
  deleteElection
};

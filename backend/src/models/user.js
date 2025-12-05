const db = require('./db');

const createUser = async (user) => {
  return db('users').insert(user).returning(['id', 'role', 'voter_id', 'wallet_address']);
};

const getUserByEmail = async (email) => {
  return db('users').where({ email }).first();
};

const getUserByVoterId = async (voter_id) => {
  return db('users').where({ voter_id }).first();
};

const getUserById = async (id) => {
  return db('users').where({ id }).first();
};

const getAllAdmins = async () => {
  return db('users')
    .where({ role: 'admin' })
    .select('id', 'email', 'admin_type', 'created_at', 'created_by_admin_id', 'account_disabled')
    .orderBy('created_at', 'desc');
};

const updateUserPassword = async (id, password, is_temp) => {
  return db('users')
    .where({ id })
    .update({
      password,
      is_temp_password: is_temp,
      password_changed_at: is_temp ? null : db.fn.now()
    });
};

const disableUser = async (id) => {
  return db('users').where({ id }).update({ account_disabled: true });
};

const deleteUser = async (id) => {
  return db('users').where({ id }).del();
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByVoterId,
  getUserById,
  getAllAdmins,
  updateUserPassword,
  disableUser,
  deleteUser
};

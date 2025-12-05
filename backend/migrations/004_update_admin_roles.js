exports.up = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      // Admin role types: SUPER_ADMIN, ELECTION_ADMIN, SYSTEM_AUDITOR, SUPPORT_STAFF
      table.string('admin_type').nullable();
      
      // Track if user has temporary password (needs to change on first login)
      table.boolean('is_temp_password').defaultTo(false);
      
      // Track which admin created this admin account
      table.integer('created_by_admin_id').unsigned().nullable().references('id').inTable('users');
      
      // Track when password was last changed
      table.timestamp('password_changed_at').nullable();
      
      // Allow disabling accounts without deletion
      table.boolean('account_disabled').defaultTo(false);
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      table.dropColumn('admin_type');
      table.dropColumn('is_temp_password');
      table.dropColumn('created_by_admin_id');
      table.dropColumn('password_changed_at');
      table.dropColumn('account_disabled');
    });
};

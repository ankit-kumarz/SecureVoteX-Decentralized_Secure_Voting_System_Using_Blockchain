exports.up = function(knex) {
  return knex.schema.table('election_keys', function(table) {
    table.text('private_key');
  });
};

exports.down = function(knex) {
  return knex.schema.table('election_keys', function(table) {
    table.dropColumn('private_key');
  });
};

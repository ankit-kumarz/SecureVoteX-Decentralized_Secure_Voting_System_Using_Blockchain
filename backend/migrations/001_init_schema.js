exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('role').notNullable(); // 'admin' or 'voter'
      table.string('voter_id').unique();
      table.string('wallet_address');
      table.timestamps(true, true);
    })
    .createTable('elections', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.timestamp('start_date').notNullable();
      table.timestamp('end_date').notNullable();
      table.timestamps(true, true);
    })
    .createTable('candidates', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('party').notNullable();
      table.text('manifesto');
      table.string('image');
      table.integer('election_id').unsigned().references('id').inTable('elections').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('votes', function(table) {
      table.increments('id').primary();
      table.integer('election_id').unsigned().references('id').inTable('elections').onDelete('CASCADE');
      table.integer('candidate_id').unsigned().references('id').inTable('candidates').onDelete('CASCADE');
      table.string('voter_id').references('voter_id').inTable('users');
      table.string('tx_hash');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.unique(['election_id', 'voter_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('votes')
    .dropTableIfExists('candidates')
    .dropTableIfExists('elections')
    .dropTableIfExists('users');
};

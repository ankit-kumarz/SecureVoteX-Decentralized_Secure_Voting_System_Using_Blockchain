/**
 * Migration: Fix votes table foreign key constraint
 * 
 * Problem: votes.voter_id is currently a string field without proper foreign key
 * This migration changes it to reference users.id as an integer with proper constraint
 */

exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE votes 
    DROP CONSTRAINT IF EXISTS votes_election_id_voter_id_unique
  `)
  .then(() => {
    return knex.raw(`
      ALTER TABLE votes 
      DROP CONSTRAINT IF EXISTS votes_voter_id_foreign
    `);
  })
  .then(() => {
    return knex.schema.alterTable('votes', function(table) {
      table.dropColumn('voter_id');
    });
  })
  .then(() => {
    return knex.schema.alterTable('votes', function(table) {
      table.integer('voter_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.unique(['election_id', 'voter_id']);
      table.index('voter_id');
    });
  });
};

exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE votes 
    DROP CONSTRAINT IF EXISTS votes_election_id_voter_id_unique
  `)
  .then(() => {
    return knex.raw(`
      ALTER TABLE votes 
      DROP CONSTRAINT IF EXISTS votes_voter_id_foreign
    `);
  })
  .then(() => {
    return knex.schema.alterTable('votes', function(table) {
      table.dropColumn('voter_id');
    });
  })
  .then(() => {
    return knex.schema.alterTable('votes', function(table) {
      table.string('voter_id').notNullable();
      table.unique(['election_id', 'voter_id']);
      table.index('voter_id');
    });
  });
};

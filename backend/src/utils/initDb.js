// Direct database initialization - bypasses problematic migrations
const knex = require('knex');
const knexConfig = require('../../knexfile');

async function initializeDatabase() {
  console.log('🔄 Initializing database tables...');
  
  const db = knex(knexConfig.development);
  
  try {
    // Check if users table exists
    const hasUsersTable = await db.schema.hasTable('users');
    
    if (!hasUsersTable) {
      console.log('📝 Creating users table...');
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.enum('role', ['voter', 'admin', 'election_admin', 'system_auditor', 'support_staff']).defaultTo('voter');
        table.string('voter_id').unique();
        table.string('wallet_address');
        table.timestamps(true, true);
      });
      console.log('✅ users table created');
    } else {
      console.log('✅ users table already exists');
    }

    // Check if voter_profiles table exists
    const hasVoterProfilesTable = await db.schema.hasTable('voter_profiles');
    if (!hasVoterProfilesTable) {
      console.log('📝 Creating voter_profiles table...');
      await db.schema.createTable('voter_profiles', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('phone_number');
        table.string('biometric_data');
        table.boolean('is_verified').defaultTo(false);
        table.timestamps(true, true);
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
      });
      console.log('✅ voter_profiles table created');
    } else {
      console.log('✅ voter_profiles table already exists');
    }

    // Check if elections table exists
    const hasElectionsTable = await db.schema.hasTable('elections');
    if (!hasElectionsTable) {
      console.log('📝 Creating elections table...');
      await db.schema.createTable('elections', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.enum('status', ['draft', 'active', 'completed']).defaultTo('draft');
        table.timestamp('start_time');
        table.timestamp('end_time');
        table.timestamps(true, true);
      });
      console.log('✅ elections table created');
    } else {
      console.log('✅ elections table already exists');
    }

    // Check if votes table exists
    const hasVotesTable = await db.schema.hasTable('votes');
    if (!hasVotesTable) {
      console.log('📝 Creating votes table...');
      await db.schema.createTable('votes', (table) => {
        table.increments('id').primary();
        table.integer('voter_id').unsigned().notNullable();
        table.integer('election_id').unsigned().notNullable();
        table.integer('candidate_id').unsigned();
        table.string('encrypted_vote');
        table.string('blockchain_tx');
        table.timestamps(true, true);
        table.foreign('voter_id').references('users.id').onDelete('CASCADE');
        table.foreign('election_id').references('elections.id').onDelete('CASCADE');
      });
      console.log('✅ votes table created');
    } else {
      console.log('✅ votes table already exists');
    }

    console.log('✅ Database initialization complete');
    await db.destroy();
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.error('Stack:', error.stack);
    await db.destroy();
    return false;
  }
}

module.exports = { initializeDatabase };

// Auto-run migrations on startup for production
const knex = require('knex');
const knexConfig = require('../../knexfile');

async function runMigrations() {
  console.log('🔄 Checking database migrations...');
  
  const db = knex(knexConfig.development);
  
  try {
    // Run migrations
    await db.migrate.latest();
    console.log('✅ Database migrations completed successfully');
    
    // Close connection
    await db.destroy();
    return true;
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    await db.destroy();
    return false;
  }
}

module.exports = { runMigrations };

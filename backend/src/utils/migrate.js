// Auto-run migrations on startup for production
const knex = require('knex');
const knexConfig = require('../../knexfile');

async function runMigrations() {
  console.log('🔄 Checking database migrations...');
  
  const db = knex(knexConfig.development);
  
  try {
    // If FORCE_MIGRATE is true, rollback all and re-run
    if (process.env.FORCE_MIGRATE === 'true') {
      console.log('⚠️  FORCE_MIGRATE enabled - Rolling back all migrations...');
      await db.migrate.rollback(null, true); // Rollback all
      console.log('✅ Rollback complete');
    }
    
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

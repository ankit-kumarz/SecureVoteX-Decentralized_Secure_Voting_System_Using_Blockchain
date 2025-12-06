console.log('🚀 Starting Production Server...\n');

// Run database migrations automatically
const { runMigrations } = require('./src/utils/migrate');

(async () => {
  // Run migrations first
  const migrated = await runMigrations();
  
  if (!migrated) {
    console.warn('⚠️  Migrations failed, but continuing anyway...');
  }

  // In production, we skip the local blockchain
  // The app will use pre-deployed contract or mock blockchain features
  console.log('⚠️  Note: Running without local blockchain in production');
  console.log('📝 Using pre-deployed contract configuration\n');

  // Start the Express server directly
  require('./src/server.js');
})();

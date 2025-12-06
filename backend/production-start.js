console.log('🚀 Starting Production Server...\n');

// Initialize database tables
const { initializeDatabase } = require('./src/utils/initDb');

(async () => {
  // Initialize database first
  const dbReady = await initializeDatabase();
  
  if (!dbReady) {
    console.warn('⚠️  Database initialization failed, but continuing anyway...');
  }

  // In production, we skip the local blockchain
  // The app will use pre-deployed contract or mock blockchain features
  console.log('⚠️  Note: Running without local blockchain in production');
  console.log('📝 Using pre-deployed contract configuration\n');

  // Start the Express server directly
  require('./src/server.js');
})();

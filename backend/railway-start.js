const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Railway Production Environment...\n');

// Start Hardhat blockchain node
console.log('⛓️  Starting Hardhat blockchain node...');
const hardhatNode = spawn('npx', ['hardhat', 'node'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: __dirname
});

hardhatNode.stdout.on('data', (data) => {
  console.log(`[Hardhat] ${data.toString().trim()}`);
});

hardhatNode.stderr.on('data', (data) => {
  console.error(`[Hardhat Error] ${data.toString().trim()}`);
});

// Wait for blockchain to start
setTimeout(async () => {
  console.log('\n📝 Deploying smart contract...');
  
  // Deploy contract
  const deployContract = spawn('npx', ['hardhat', 'run', 'scripts/deploy.js', '--network', 'localhost'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  deployContract.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Contract deployed successfully!\n');
      console.log('🖥️  Starting Express server...\n');
      
      // Start Express server
      require('./src/server.js');
    } else {
      console.error('❌ Contract deployment failed!');
      process.exit(1);
    }
  });
}, 10000); // Wait 10 seconds for Hardhat node to be ready

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹️  Shutting down...');
  hardhatNode.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down...');
  hardhatNode.kill();
  process.exit(0);
});

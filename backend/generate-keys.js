// Quick script to generate encryption keys for an election
const fetch = require('node-fetch');

// Configuration
const ELECTION_ID = 5;
const ADMIN_EMAIL = 'admin@test.com'; // Change this to your admin email
const ADMIN_PASSWORD = 'admin123'; // Change this to your admin password

async function generateKeys() {
  try {
    // Step 1: Login as admin
    console.log('Logging in as admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    
    const loginData = await loginRes.json();
    
    if (!loginData.token) {
      console.error('❌ Login failed:', loginData.message);
      console.log('Please update ADMIN_EMAIL and ADMIN_PASSWORD in this file');
      return;
    }
    
    console.log('✅ Logged in successfully');
    const token = loginData.token;
    
    // Step 2: Generate encryption keys
    console.log(`Generating encryption keys for election ${ELECTION_ID}...`);
    const keysRes = await fetch(`http://localhost:5000/api/encrypted-vote/election/${ELECTION_ID}/generate-keys`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const keysData = await keysRes.json();
    
    if (keysRes.status === 201) {
      console.log('✅ Encryption keys generated successfully!');
      console.log('Fingerprint:', keysData.fingerprint);
      console.log('\n🎉 You can now go back to the voting page and vote!');
    } else if (keysRes.status === 409) {
      console.log('ℹ️ Keys already exist for this election');
    } else {
      console.error('❌ Failed to generate keys:', keysData.message);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

generateKeys();

#!/usr/bin/env node

/**
 * Generate RSA Key Pair for Election
 * 
 * Usage:
 *   node scripts/generateElectionKeys.js <election_id>
 * 
 * This script generates a new RSA key pair for an election.
 * The public key is stored in the database.
 * The private key is printed to console and MUST be stored securely offline.
 * 
 * IMPORTANT: The private key should NEVER be stored in the database or backend.
 * It should be kept by election auditors/officials for decryption after voting ends.
 */

require('dotenv').config();
const keyManagement = require('../src/utils/keyManagement');
const electionKeyModel = require('../src/models/electionKey');
const electionModel = require('../src/models/election');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node generateElectionKeys.js <election_id>');
  process.exit(1);
}

const electionId = parseInt(args[0]);

async function generateKeys() {
  try {
    // Check if election exists
    const election = await electionModel.getElectionById(electionId);
    if (!election) {
      console.error(`❌ Election with ID ${electionId} does not exist.`);
      process.exit(1);
    }

    // Check if keys already exist
    const existingKey = await electionKeyModel.hasElectionKey(electionId);
    if (existingKey) {
      console.error(`❌ Keys already exist for election ID ${electionId}.`);
      console.log('If you need to regenerate, delete the existing key first.');
      process.exit(1);
    }

    console.log(`\n🔐 Generating RSA-2048 key pair for Election: "${election.title}" (ID: ${electionId})\n`);

    // Generate key pair
    const { publicKey, privateKey, fingerprint } = keyManagement.generateElectionKeyPair(2048);

    // Store public key in database
    await electionKeyModel.createElectionKey({
      election_id: electionId,
      public_key: publicKey,
      public_key_fingerprint: fingerprint,
      key_owner: 'election-admin'
    });

    console.log('✅ Public key stored in database successfully.\n');
    console.log('📌 Public Key Fingerprint:');
    console.log(fingerprint);
    console.log('\n🔑 PUBLIC KEY (Share this with voters):');
    console.log('─'.repeat(80));
    console.log(publicKey);
    console.log('─'.repeat(80));
    
    console.log('\n🔒 PRIVATE KEY (KEEP THIS SECURE - DO NOT SHARE):');
    console.log('─'.repeat(80));
    console.log(privateKey);
    console.log('─'.repeat(80));

    console.log('\n⚠️  CRITICAL SECURITY INSTRUCTIONS:');
    console.log('1. Copy the PRIVATE KEY above and store it in a secure offline location.');
    console.log('2. DO NOT store the private key in the database or backend code.');
    console.log('3. The private key is needed ONLY to decrypt votes after the election ends.');
    console.log('4. Share ONLY the public key with the system (already done).');
    console.log('5. Consider using a hardware security module (HSM) or secure vault.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating keys:', error.message);
    process.exit(1);
  }
}

generateKeys();

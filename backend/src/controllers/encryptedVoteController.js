const electionKeyModel = require('../models/electionKey');
const voteReceiptModel = require('../models/voteReceipt');
const voteModel = require('../models/vote');
const electionModel = require('../models/election');
const { sha256Hash } = require('../utils/encryption');
const { generateElectionKeyPair } = require('../utils/keyManagement');

/**
 * Vote Controller - Enhanced with E2E Encryption
 */

/**
 * Generate encryption keys for an election
 * POST /api/encrypted-vote/election/:id/generate-keys
 */
const generateElectionKeys = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Generating keys for election:', id);

    // Check if election exists
    const election = await electionModel.getElectionById(id);
    if (!election) {
      console.log('Election not found:', id);
      return res.status(404).json({ message: 'Election not found' });
    }
    console.log('Election found:', election.title);

    // Check if keys already exist
    const existingKey = await electionKeyModel.getElectionPublicKey(id);
    if (existingKey) {
      console.log('Keys already exist for election:', id);
      return res.status(409).json({ message: 'Encryption keys already exist for this election' });
    }

    // Generate RSA key pair
    console.log('Calling generateElectionKeyPair...');
    const { publicKey, privateKey, fingerprint } = generateElectionKeyPair();
    console.log('Keys generated successfully, fingerprint:', fingerprint);

    // Store keys
    console.log('Storing keys in database...');
    await electionKeyModel.createElectionKey({
      election_id: id,
      public_key: publicKey,
      private_key: privateKey,
      public_key_fingerprint: fingerprint
    });
    console.log('Keys stored successfully');

    res.status(201).json({
      message: 'Encryption keys generated successfully',
      publicKey,
      fingerprint
    });
  } catch (err) {
    console.error('Error generating keys:', err);
    res.status(500).json({ message: 'Failed to generate keys', error: err.message });
  }
};

/**
 * Cast encrypted vote
 * POST /api/vote/encrypted
 * Body: { electionId, candidateId, encryptedVote, biometricVerification }
 */
const castEncryptedVote = async (req, res) => {
  try {
    const { electionId, candidateId, encryptedVote, biometricVerification } = req.body;
    const userId = req.user.id;
    const voterId = req.user.voter_id;

    console.log('🗳️  Cast Encrypted Vote Request:', {
      electionId,
      candidateId,
      userId,
      voterId,
      hasEncryptedVote: !!encryptedVote
    });

    // Validate required fields
    if (!electionId || !candidateId || !encryptedVote) {
      console.log('❌ Missing required fields:', { electionId, candidateId, encryptedVote: !!encryptedVote });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!userId || !voterId) {
      console.log('❌ Missing user information:', { userId, voterId });
      return res.status(400).json({ message: 'User information not found in token' });
    }

    // Check if election exists and is active
    const election = await electionModel.getElectionById(electionId);
    if (!election) {
      console.log('❌ Election not found:', electionId);
      return res.status(404).json({ message: 'Election not found' });
    }

    console.log('📋 Election found:', {
      id: election.id,
      title: election.title,
      start_date: election.start_date,
      end_date: election.end_date
    });

    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    console.log('⏰ Date check:', {
      now: now.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      started: now >= startDate,
      notEnded: now <= endDate
    });

    if (now < startDate) {
      console.log('❌ Election has not started yet');
      return res.status(400).json({ message: 'Election has not started yet' });
    }

    if (now > endDate) {
      console.log('❌ Election has ended');
      return res.status(400).json({ message: 'Election has ended' });
    }

    // Check if user already voted
    const alreadyVoted = await voteModel.hasVoted(voterId, electionId);
    if (alreadyVoted) {
      console.log('❌ User has already voted:', voterId);
      return res.status(409).json({ message: 'You have already voted in this election' });
    }
    console.log('✅ User has not voted yet');

    // Generate unique salt for this vote
    const voteSalt = require('crypto').randomBytes(32).toString('hex');

    // Create receipt hash: SHA256(encryptedVote + voterId + electionId + salt)
    const receiptData = `${encryptedVote}|${voterId}|${electionId}|${voteSalt}`;
    const receiptHash = sha256Hash(receiptData);

    // Store vote in database
    console.log('💾 Storing vote in database...');
    const [vote] = await voteModel.castVote({
      election_id: electionId,
      candidate_id: candidateId,
      voter_id: userId,  // Use integer user ID, not string voter_id
      encrypted_vote: encryptedVote,
      vote_salt: voteSalt
    });
    console.log('✅ Vote stored:', vote.id);

    // Create vote receipt
    console.log('📜 Creating vote receipt...');
    const [receipt] = await voteReceiptModel.createVoteReceipt({
      vote_id: vote.id,
      user_id: userId,
      election_id: electionId,
      receipt_hash: receiptHash,
      blockchain_tx: null // Will be updated when blockchain tx is recorded
    });
    console.log('✅ Receipt created:', receipt.id);

    // Return receipt information
    console.log('✅ Vote cast successfully');
    res.status(201).json({
      message: 'Vote cast successfully',
      receiptHash,
      voteId: vote.id,
      receiptId: receipt.id,
      electionId,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Encrypted vote error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({ message: 'Failed to cast vote', error: err.message });
  }
};

/**
 * Get election public key for vote encryption
 * GET /api/vote/election/:id/public-key
 */
const getElectionPublicKey = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await electionModel.getElectionById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const publicKey = await electionKeyModel.getElectionPublicKey(id);
    if (!publicKey) {
      return res.status(404).json({ 
        message: 'No encryption key found for this election',
        hasKey: false
      });
    }

    res.json({
      publicKey: publicKey.public_key,
      fingerprint: publicKey.public_key_fingerprint,
      keyCreatedAt: publicKey.key_created_at,
      electionId: id,
      electionTitle: election.title
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get public key', error: err.message });
  }
};

/**
 * Verify vote receipt
 * GET /api/vote/receipt/:receiptHash/verify
 */
const verifyReceipt = async (req, res) => {
  try {
    const { receiptHash } = req.params;

    const receipt = await voteReceiptModel.getVoteReceiptByHash(receiptHash);
    
    if (!receipt) {
      return res.json({
        valid: false,
        found: false,
        message: 'Receipt not found'
      });
    }

    const election = await electionModel.getElectionById(receipt.election_id);

    res.json({
      valid: true,
      found: true,
      electionId: receipt.election_id,
      electionTitle: election?.title || 'Unknown',
      txHash: receipt.tx_hash,
      timestamp: receipt.created_at,
      message: 'Receipt verified successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Receipt verification failed', error: err.message });
  }
};

/**
 * Get user's vote receipts
 * GET /api/vote/receipts
 */
const getUserReceipts = async (req, res) => {
  try {
    const userId = req.user.id;

    const receipts = await voteReceiptModel.getVoteReceiptsByUserId(userId);
    
    // Enrich with election details
    const enrichedReceipts = await Promise.all(
      receipts.map(async (receipt) => {
        const election = await electionModel.getElectionById(receipt.election_id);
        return {
          ...receipt,
          electionTitle: election?.title || 'Unknown Election'
        };
      })
    );

    res.json(enrichedReceipts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get receipts', error: err.message });
  }
};

module.exports = {
  generateElectionKeys,
  castEncryptedVote,
  getElectionPublicKey,
  verifyReceipt,
  getUserReceipts
};

const voterProfileModel = require('../models/voterProfile');
const { createHmacHash } = require('../utils/encryption');

/**
 * Biometric Registration & Verification Controller
 * Stores face embeddings WITHOUT encryption for fast client-side comparison
 * Embeddings are mathematical representations, not sensitive image data
 */

/**
 * Register voter's biometric data (face embedding)
 * POST /api/biometric/register
 * Body: { faceEmbeddingBase64: string }
 */
const registerBiometric = async (req, res) => {
  try {
    const { faceEmbeddingBase64 } = req.body;
    const userId = req.user.id;

    if (!faceEmbeddingBase64) {
      return res.status(400).json({ message: 'Face embedding is required' });
    }

    // Check if user already has biometric profile
    const existingProfile = await voterProfileModel.hasVoterProfile(userId);
    if (existingProfile) {
      return res.status(409).json({ message: 'Biometric profile already exists' });
    }

    // Get HMAC secret from environment for face hash
    const hmacSecret = process.env.HMAC_SECRET;

    if (!hmacSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Create HMAC hash for integrity verification
    const faceHash = createHmacHash(faceEmbeddingBase64, hmacSecret);

    // Store embedding WITHOUT encryption for fast client-side comparison
    // The embedding is already a mathematical representation, not raw image data
    const profile = {
      user_id: userId,
      embedding_encrypted: faceEmbeddingBase64, // Store raw base64 descriptor (NOT encrypted)
      embedding_salt: '', // Not used when not encrypting
      face_hash: faceHash
    };

    await voterProfileModel.createVoterProfile(profile);

    res.status(201).json({
      message: 'Biometric registration successful',
      registered: true
    });
  } catch (err) {
    console.error('Biometric registration error:', err);
    res.status(500).json({ message: 'Biometric registration failed', error: err.message });
  }
};

/**
 * Verify voter's biometric data (CLIENT-SIDE VERIFICATION)
 * POST /api/biometric/verify
 * Returns: { storedEmbedding: string } - RAW descriptor for client comparison
 */
const verifyBiometric = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get stored biometric profile
    const profile = await voterProfileModel.getVoterProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ message: 'No biometric profile found. Please register first.' });
    }

    // Return the raw base64 descriptor (stored without encryption)
    const storedEmbedding = profile.embedding_encrypted;
    
    // Send RAW descriptor to client for instant comparison
    res.json({
      success: true,
      storedEmbedding: storedEmbedding,
      message: 'Biometric data retrieved successfully'
    });
  } catch (err) {
    console.error('Biometric verification error:', err);
    res.status(500).json({ message: 'Biometric verification failed', error: err.message });
  }
};

/**
 * Get biometric status for current user
 * GET /api/biometric/status
 */
const getBiometricStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await voterProfileModel.getVoterProfileByUserId(userId);

    res.json({
      registered: !!profile,
      registeredAt: profile ? profile.biometric_registered_at : null
    });
  } catch (err) {
    console.error('Get biometric status error:', err);
    res.status(500).json({ message: 'Failed to get biometric status', error: err.message });
  }
};

module.exports = {
  registerBiometric,
  verifyBiometric,
  getBiometricStatus
};

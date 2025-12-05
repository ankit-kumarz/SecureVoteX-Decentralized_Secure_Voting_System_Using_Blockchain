const crypto = require('crypto');
const forge = require('node-forge');

/**
 * RSA Key Management for Election Vote Encryption
 * Uses node-forge for RSA key generation and management
 */

/**
 * Generate RSA key pair for an election
 * @param {number} keySize - Key size in bits (2048 or 4096)
 * @returns {object} - { publicKey: PEM, privateKey: PEM, fingerprint: hex }
 */
function generateElectionKeyPair(keySize = 2048) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  // Generate fingerprint (SHA256 of public key)
  const fingerprint = crypto
    .createHash('sha256')
    .update(publicKey)
    .digest('hex');

  return {
    publicKey,
    privateKey,
    fingerprint
  };
}

/**
 * Encrypt data with RSA public key (for small data like AES keys)
 * @param {string} data - Data to encrypt (should be small, like AES key)
 * @param {string} publicKeyPem - Public key in PEM format
 * @returns {string} - Base64 encrypted data
 */
function encryptWithPublicKey(data, publicKeyPem) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create()
    }
  });
  return forge.util.encode64(encrypted);
}

/**
 * Decrypt data with RSA private key
 * @param {string} encryptedData - Base64 encrypted data
 * @param {string} privateKeyPem - Private key in PEM format
 * @returns {string} - Decrypted data
 */
function decryptWithPrivateKey(encryptedData, privateKeyPem) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encrypted = forge.util.decode64(encryptedData);
  const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create()
    }
  });
  return decrypted;
}

/**
 * Verify public key format
 * @param {string} publicKeyPem - Public key to verify
 * @returns {boolean} - True if valid
 */
function verifyPublicKey(publicKeyPem) {
  try {
    forge.pki.publicKeyFromPem(publicKeyPem);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Get public key fingerprint
 * @param {string} publicKeyPem - Public key in PEM format
 * @returns {string} - SHA256 fingerprint (hex)
 */
function getPublicKeyFingerprint(publicKeyPem) {
  return crypto
    .createHash('sha256')
    .update(publicKeyPem)
    .digest('hex');
}

module.exports = {
  generateElectionKeyPair,
  encryptWithPublicKey,
  decryptWithPrivateKey,
  verifyPublicKey,
  getPublicKeyFingerprint
};

const crypto = require('crypto');

/**
 * Encryption utility for sensitive data (biometric embeddings, vote data)
 * Uses AES-256-GCM for symmetric encryption
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derive encryption key from secret and salt using PBKDF2
 */
function deriveKey(secret, salt) {
  return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Encrypt data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {string} secret - Encryption secret (from env)
 * @returns {object} - { encrypted: base64, salt: base64, iv: base64, tag: base64 }
 */
function encrypt(plaintext, secret) {
  if (!secret) throw new Error('Encryption secret is required');
  
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(secret, salt);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64')
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param {object} encryptedData - { encrypted, salt, iv, tag }
 * @param {string} secret - Encryption secret
 * @returns {string} - Decrypted plaintext
 */
function decrypt(encryptedData, secret) {
  if (!secret) throw new Error('Encryption secret is required');
  
  const { encrypted, salt, iv, tag } = encryptedData;
  
  const saltBuffer = Buffer.from(salt, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  const tagBuffer = Buffer.from(tag, 'base64');
  const key = deriveKey(secret, saltBuffer);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(tagBuffer);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Create HMAC hash for quick comparison (e.g., face embeddings)
 * @param {string} data - Data to hash
 * @param {string} secret - HMAC secret
 * @returns {string} - Hex hash
 */
function createHmacHash(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Generate random salt
 * @returns {string} - Base64 salt
 */
function generateSalt() {
  return crypto.randomBytes(SALT_LENGTH).toString('base64');
}

/**
 * Generate SHA256 hash
 * @param {string} data - Data to hash
 * @returns {string} - Hex hash
 */
function sha256Hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
  encrypt,
  decrypt,
  createHmacHash,
  generateSalt,
  sha256Hash
};

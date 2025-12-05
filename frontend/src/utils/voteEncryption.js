/**
 * Client-Side Hybrid Encryption Utility
 * Uses RSA-OAEP for key encryption and AES-GCM for data encryption
 */

/**
 * Generate random AES-256 key
 * @returns {Promise<CryptoKey>}
 */
export async function generateAESKey() {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with AES-GCM
 * @param {object} data - Data to encrypt
 * @param {CryptoKey} aesKey - AES key
 * @returns {Promise<{encrypted: string, iv: string}>}
 */
export async function encryptWithAES(data, aesKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encodedData
  );
  
  return {
    encrypted: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  };
}

/**
 * Import RSA public key from PEM format
 * @param {string} pemKey - PEM formatted public key
 * @returns {Promise<CryptoKey>}
 */
export async function importRSAPublicKey(pemKey) {
  // Remove PEM header/footer
  const pemContents = pemKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryDer = base64ToArrayBuffer(pemContents);
  
  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
}

/**
 * Encrypt AES key with RSA public key
 * @param {CryptoKey} aesKey - AES key to encrypt
 * @param {CryptoKey} rsaPublicKey - RSA public key
 * @returns {Promise<string>} - Base64 encrypted key
 */
export async function encryptAESKeyWithRSA(aesKey, rsaPublicKey) {
  // Export AES key as raw bytes
  const rawKey = await crypto.subtle.exportKey('raw', aesKey);
  
  // Encrypt with RSA
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    rsaPublicKey,
    rawKey
  );
  
  return arrayBufferToBase64(encrypted);
}

/**
 * Hybrid encryption: Encrypt vote data with AES, then encrypt AES key with RSA
 * @param {object} voteData - Vote data to encrypt
 * @param {string} publicKeyPEM - Election public key in PEM format
 * @returns {Promise<object>} - {encryptedVote, encryptedKey, iv}
 */
export async function encryptVote(voteData, publicKeyPEM) {
  // Generate ephemeral AES key
  const aesKey = await generateAESKey();
  
  // Encrypt vote data with AES
  const { encrypted, iv } = await encryptWithAES(voteData, aesKey);
  
  // Import RSA public key
  const rsaPublicKey = await importRSAPublicKey(publicKeyPEM);
  
  // Encrypt AES key with RSA
  const encryptedKey = await encryptAESKeyWithRSA(aesKey, rsaPublicKey);
  
  return {
    encryptedVote: encrypted,
    encryptedKey,
    iv,
    algorithm: 'RSA-OAEP+AES-256-GCM'
  };
}

/**
 * Generate receipt hash from encrypted vote
 * @param {string} encryptedVote - Encrypted vote data
 * @param {string} voterId - Voter ID
 * @param {number} electionId - Election ID
 * @param {string} salt - Random salt
 * @returns {Promise<string>} - SHA-256 hash
 */
export async function generateReceiptHash(encryptedVote, voterId, electionId, salt) {
  const data = `${encryptedVote}|${voterId}|${electionId}|${salt}`;
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return bufferToHex(hashBuffer);
}

/**
 * Helper: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Helper: Convert buffer to hex string
 */
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create vote payload
 * @param {number} candidateId - Selected candidate ID
 * @param {number} electionId - Election ID
 * @param {string} voterId - Voter ID
 * @returns {object} - Vote payload
 */
export function createVotePayload(candidateId, electionId, voterId) {
  return {
    candidateId,
    electionId,
    voterId,
    timestamp: new Date().toISOString(),
    nonce: crypto.getRandomValues(new Uint8Array(16)).join('')
  };
}

/**
 * Optimized FaceAPI.js Model Loader
 * Loads models ONCE globally and caches them
 */

import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise = null;

const MODEL_URL = '/models';
const DETECTION_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 320,
  scoreThreshold: 0.5
});

/**
 * Load all FaceAPI models (singleton pattern)
 * Only loads once, subsequent calls return cached promise
 */
export async function loadModels() {
  if (modelsLoaded) {
    return true;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      console.log('🔄 Loading FaceAPI models...');
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      modelsLoaded = true;
      console.log('✅ FaceAPI models loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load FaceAPI models:', error);
      loadingPromise = null; // Reset on failure
      throw new Error('Failed to load face detection models. Please ensure models are in /public/models/');
    }
  })();

  return loadingPromise;
}

/**
 * Detect face and extract 128-dimensional descriptor
 * Optimized for speed with TinyFaceDetector
 */
export async function detectFace(videoOrImageElement) {
  if (!modelsLoaded) {
    await loadModels();
  }

  const detection = await faceapi
    .detectSingleFace(videoOrImageElement, DETECTION_OPTIONS)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('No face detected');
  }

  return detection;
}

/**
 * Convert Float32Array descriptor to base64
 * Ensures exact 128-length descriptor
 */
export function descriptorToBase64(descriptor) {
  if (descriptor.length !== 128) {
    throw new Error(`Invalid descriptor length: ${descriptor.length}, expected 128`);
  }

  const uint8Array = new Uint8Array(descriptor.buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string back to Float32Array descriptor
 */
export function base64ToDescriptor(base64String) {
  try {
    // Decode base64 to binary string
    const binaryString = atob(base64String);
    
    // Convert to Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert to Float32Array (128 dimensions)
    const descriptor = new Float32Array(bytes.buffer);
    
    if (descriptor.length !== 128) {
      console.error('Invalid descriptor length:', descriptor.length);
      return null;
    }
    
    return descriptor;
  } catch (error) {
    console.error('Base64 to descriptor conversion error:', error);
    return null;
  }
}

/**
 * Start webcam stream
 */
export async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });
    return stream;
  } catch (error) {
    console.error('Failed to access webcam:', error);
    throw new Error('Unable to access webcam. Please grant camera permissions.');
  }
}

/**
 * Stop webcam stream
 */
export function stopWebcam(stream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

/**
 * Draw detection overlay on canvas
 */
export function drawDetectionOverlay(canvas, detection) {
  const displaySize = { width: canvas.width, height: canvas.height };
  faceapi.matchDimensions(canvas, displaySize);
  
  const resized = faceapi.resizeResults(detection, displaySize);
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw detection box with neon glow
  faceapi.draw.drawDetections(canvas, resized);
  faceapi.draw.drawFaceLandmarks(canvas, resized);
}

/**
 * Compare two face descriptors using Euclidean distance (CLIENT-SIDE)
 * This is FAST - runs in browser, no server delay
 * 
 * @param {string} descriptor1Base64 - First face descriptor (base64)
 * @param {string} descriptor2Base64 - Second face descriptor (base64)
 * @returns {number} Distance (lower = more similar, < 0.6 = match)
 */
export function compareDescriptors(descriptor1Base64, descriptor2Base64) {
  try {
    // Parse base64 to Float32Array
    const desc1 = base64ToDescriptor(descriptor1Base64);
    const desc2 = base64ToDescriptor(descriptor2Base64);

    if (!desc1 || !desc2 || desc1.length !== desc2.length) {
      console.error('Invalid descriptors for comparison');
      return 999; // Return high distance (no match)
    }

    // Calculate Euclidean distance (same as face-api.js)
    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      const diff = desc1[i] - desc2[i];
      sum += diff * diff;
    }
    
    const distance = Math.sqrt(sum);
    console.log('Face comparison distance:', distance, distance < 0.6 ? '✓ MATCH' : '✗ NO MATCH');
    
    return distance;
  } catch (error) {
    console.error('Descriptor comparison error:', error);
    return 999;
  }
}

export { DETECTION_OPTIONS };

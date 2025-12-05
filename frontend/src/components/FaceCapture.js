import React, { useRef, useEffect, useState } from 'react';
import { loadModels, detectFace, descriptorToBase64, startWebcam, stopWebcam, drawDetectionOverlay } from '../utils/faceapiLoader';

/**
 * FaceCapture Component - Simple Identity Matching
 * 
 * Uses FaceAPI.js for face recognition and embedding extraction
 * - Captures single photo from webcam
 * - Extracts 128-dimensional face descriptor
 * - No liveness detection - instant capture
 * 
 * Props:
 * - onCapture(descriptorBase64): Callback with base64 descriptor (128-length)
 * - onError(error): Callback when error occurs
 * - buttonText: Custom text for capture button (default: "Capture Face")
 * - fastMode: Skip continuous detection, capture immediately (default: false)
 */
const FaceCapture = ({ onCapture, onError, buttonText = "Capture Face", fastMode = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const detectionInterval = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 10; // Max 3 seconds (10 * 300ms)

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setLoading(true);
      setError('');

      // Load FaceAPI models (face recognition)
      await loadModels();
      setModelsLoaded(true);

      // Start webcam
      const videoStream = await startWebcam();
      setStream(videoStream);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
        await videoRef.current.play();
      }

      // Always use fast mode - detect and capture immediately
      setTimeout(() => detectAndAutoCapture(), 500);

      setLoading(false);
    } catch (err) {
      const errorMsg = err.message || 'Failed to initialize camera';
      setError(errorMsg);
      setLoading(false);
      if (onError) onError(err);
    }
  };

  const startContinuousDetection = () => {
    retryCount.current = 0;
    
    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const detection = await detectFace(videoRef.current);
          
          setFaceDetected(true);
          retryCount.current = 0; // Reset on success
          
          // Draw detection overlay
          if (canvasRef.current) {
            drawDetectionOverlay(canvasRef.current, detection);
          }
        } catch (err) {
          setFaceDetected(false);
          retryCount.current++;
          
          // Clear canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }

          // Stop retrying after MAX_RETRIES
          if (retryCount.current > MAX_RETRIES) {
            setError('No face detected for 3 seconds. Please position your face.');
          }
        }
      }
    }, 300); // Check every 300ms
  };

  const detectAndAutoCapture = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      try {
        const detection = await detectFace(videoRef.current);
        setFaceDetected(true);
        
        if (canvasRef.current) {
          drawDetectionOverlay(canvasRef.current, detection);
        }

        // Auto-capture immediately after detection in fast mode
        if (fastMode) {
          setTimeout(() => handleCapture(), 200);
        }
      } catch (err) {
        setFaceDetected(false);
        // Retry after 300ms
        setTimeout(() => detectAndAutoCapture(), 300);
      }
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !modelsLoaded) {
      setError('Camera not ready');
      return;
    }

    try {
      setCapturing(true);
      setError('');

      // Face Recognition - Extract embedding from single frame
      const detection = await detectFace(videoRef.current);
      
      // Convert descriptor to base64 (128-dimensional)
      const descriptorBase64 = descriptorToBase64(detection.descriptor);
      
      // Call parent callback
      if (onCapture) {
        onCapture(descriptorBase64);
      }

      setCapturing(false);
    } catch (err) {
      const errorMsg = err.message || 'Failed to detect face';
      setError(errorMsg);
      setCapturing(false);
      if (onError) onError(err);
    }
  };

  const cleanup = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    if (stream) {
      stopWebcam(stream);
    }
  };

  // Update canvas size when video loads
  const handleVideoLoad = () => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
    }
  };

  return (
    <div className="face-capture-container">
      {/* Video Container */}
      <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-white/20 bg-black/20">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onLoadedMetadata={handleVideoLoad}
          className="w-full h-auto max-h-96 object-cover"
        />
        {!fastMode && (
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mb-3 mx-auto"></div>
              <p className="text-white text-sm">Initializing camera...</p>
            </div>
          </div>
        )}

        {/* Face Detection Indicator */}
        {!loading && modelsLoaded && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Face Detection Status */}
            <div className={`flex items-center px-3 py-2 rounded-lg backdrop-blur-md transition-all ${
              faceDetected 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-yellow-500/20 border border-yellow-500/50'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                faceDetected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`} />
              <span className="text-white text-xs font-medium">
                {faceDetected ? 'Face Detected' : 'No Face'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Capture Button */}
      <button
        onClick={handleCapture}
        disabled={!modelsLoaded || capturing || loading}
        className={`w-full py-3 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-semibold rounded-xl transition-all duration-300 ${
          modelsLoaded && !capturing && !loading
            ? 'shadow-neon-purple hover:shadow-neon-pink hover:scale-105 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        {loading ? (
          'Initializing...'
        ) : capturing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Verifying...
          </span>
        ) : fastMode ? (
          'Auto-Capturing...'
        ) : !faceDetected ? (
          'Position Your Face'
        ) : (
          buttonText
        )}
      </button>

      {/* Instructions */}
      <div className="mt-3 text-center text-gray-400 text-xs">
        <p>• Ensure good lighting</p>
        <p>• Face the camera directly</p>
        <p>• Remove glasses if possible</p>
      </div>
    </div>
  );
};

export default FaceCapture;

# FaceAPI Models Setup

## Required Models

The biometric authentication system uses FaceAPI.js which requires pre-trained models.

## Download Models

1. Download the models from the official FaceAPI.js repository:
   https://github.com/justadudewhohacks/face-api.js/tree/master/weights

2. You need the following model files:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`
   - `face_expression_model-weights_manifest.json`
   - `face_expression_model-shard1`

3. Place all downloaded files in the `public/models/` directory

## Directory Structure

```
frontend/
  public/
    models/
      tiny_face_detector_model-weights_manifest.json
      tiny_face_detector_model-shard1
      face_landmark_68_model-weights_manifest.json
      face_landmark_68_model-shard1
      face_recognition_model-weights_manifest.json
      face_recognition_model-shard1
      face_recognition_model-shard2
      face_expression_model-weights_manifest.json
      face_expression_model-shard1
```

## Quick Download Script

You can use this command to download all models:

```bash
cd frontend/public
mkdir models
cd models

# Download models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1
```

## Verification

After placing the models, the FaceAPI utility will automatically load them from `/models/` when you access biometric features.

Check browser console for: `✅ FaceAPI models loaded successfully`

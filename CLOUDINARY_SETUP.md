# Cloudinary Setup Guide for Image Storage

## Problem
Render uses ephemeral storage, which means files uploaded to the `/uploads` directory are deleted when the application redeployed or scaled. This causes candidate photos to disappear.

## Solution
Use Cloudinary (free tier) for persistent image storage with unlimited free bandwidth and up to 10GB storage per month.

## Setup Steps

### 1. Create Cloudinary Account (FREE)
1. Go to [cloudinary.com](https://cloudinary.com/users/register/free)
2. Sign up with email or social account
3. Verify your email
4. You'll be taken to the dashboard

### 2. Get Your API Credentials
1. In the Dashboard, you'll see your **Cloud Name** (required)
2. Click on "Account Settings" → "API Keys" tab
3. Note down:
   - **Cloud Name** (at the top of dashboard)
   - **API Key** (in Account Settings)
   - **API Secret** (in Account Settings) - Keep this secret!

### 3. Add Credentials to Render Environment

Go to your Render backend dashboard:

1. Select your voting-backend service
2. Click "Environment" tab
3. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret

4. Click "Save Changes"
5. Render will auto-redeploy with new environment variables

### 4. Alternative: Local Testing (if needed)
Add to your `.env` file in the `backend` folder:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## How It Works

1. **Upload Flow:**
   - Admin uploads candidate image
   - Multer sends image to Cloudinary (not to Render disk)
   - Cloudinary returns a permanent HTTPS URL
   - Backend stores the Cloudinary URL in the database
   - Frontend displays image from Cloudinary URL

2. **Benefits:**
   - Images survive Render redeployments
   - Fast CDN delivery globally
   - Automatic image optimization
   - No storage quota issues

3. **Image Management:**
   - All candidate images are in Cloudinary folder: `votex-candidates`
   - You can manage images in Cloudinary dashboard
   - Images automatically served via Cloudinary CDN

## Testing

1. After Render redeploys with new environment variables
2. Go to Admin → Manage Candidates
3. Add a new candidate with a photo
4. Click "Save"
5. Image should display in the list
6. Redeploy Render again → Image should still display
7. Check Cloudinary dashboard → You'll see the uploaded image

## Troubleshooting

**Issue: Upload fails with "Invalid file type"**
- Solution: Only JPG and PNG supported, max 3MB

**Issue: Image not showing after upload**
- Check browser console for errors
- Verify CLOUDINARY_CLOUD_NAME environment variable is set
- Check Cloudinary dashboard for uploaded images

**Issue: Getting 401 Cloudinary error**
- Verify API Key and Secret are correct
- Make sure you copied them exactly without spaces
- Regenerate API Key in Cloudinary if needed

## Free Tier Limits
- 10GB monthly storage
- Unlimited bandwidth
- Automatic image optimization
- 5000 monthly transformations

This is more than sufficient for a voting system with candidate photos.

## Switching Back to Local Storage (Not Recommended)
If you need to, revert the upload.js middleware and set `CLOUDINARY_ENABLED=false` in environment, but images will disappear on redeploy.

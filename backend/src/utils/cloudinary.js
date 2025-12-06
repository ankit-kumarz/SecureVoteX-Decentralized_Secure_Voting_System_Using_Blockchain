const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkzfk0uqk',
  api_key: process.env.CLOUDINARY_API_KEY || '496787362844842',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'X_Cf1JC6L5p0cAf_Py4-GCRR-g4'
});

module.exports = cloudinary;

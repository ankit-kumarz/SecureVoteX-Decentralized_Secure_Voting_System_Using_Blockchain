# 🚀 FREE DEPLOYMENT GUIDE - Railway + Vercel

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)
- Git installed on your machine

---

## 📦 STEP 1: Prepare Your Code for GitHub

### 1.1 Initialize Git (if not already done)
```powershell
cd d:\DVS
git init
```

### 1.2 Create .gitignore in root
```powershell
# Create .gitignore file
@"
node_modules/
.env
.env.local
*.log
.DS_Store
backend/uploads/*
!backend/uploads/.gitkeep
backend/cache/
backend/artifacts/build-info/
frontend/build/
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

### 1.3 Commit and Push to GitHub
```powershell
git add .
git commit -m "Initial commit - Blockchain Voting System"
git branch -M main

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## ⚡ STEP 2: Deploy Backend on Railway.app

### 2.1 Install Railway CLI
```powershell
npm install -g @railway/cli
```

### 2.2 Login to Railway
```powershell
railway login
```
*Browser will open - authorize Railway*

### 2.3 Navigate to Backend
```powershell
cd d:\DVS\backend
```

### 2.4 Initialize Railway Project
```powershell
railway init
```
*Select "Empty Project" → Give it a name like "voting-backend"*

### 2.5 Add PostgreSQL Database
```powershell
railway add
```
*Select "PostgreSQL" from the list*

### 2.6 Set Environment Variables
```powershell
# Railway will auto-set DATABASE_URL from PostgreSQL
# You need to add these manually:

railway variables set JWT_SECRET="your_super_secret_jwt_key_$(Get-Random)"
railway variables set SESSION_SECRET="your_super_secret_session_key_$(Get-Random)"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
```

### 2.7 Link Your Code and Deploy
```powershell
# Link to GitHub repo
railway link

# Or deploy directly
railway up
```

### 2.8 Run Migrations After First Deploy
```powershell
# Open Railway shell
railway run npm run migrate
railway run node create-superadmin.js
```

### 2.9 Configure Start Command
Go to Railway Dashboard:
1. Open your project
2. Click on the service
3. Go to "Settings" → "Deploy"
4. Set **Start Command**: `node railway-start.js`
5. Click "Redeploy"

### 2.10 Get Your Backend URL
```powershell
railway status
```
*Copy the URL (e.g., https://voting-backend-production.up.railway.app)*

---

## 🎨 STEP 3: Deploy Frontend on Vercel

### 3.1 Install Vercel CLI
```powershell
npm install -g vercel
```

### 3.2 Navigate to Frontend
```powershell
cd d:\DVS\frontend
```

### 3.3 Update Environment Variable
Create/update `.env.production`:
```powershell
@"
REACT_APP_API_URL=https://YOUR_RAILWAY_BACKEND_URL/api
"@ | Out-File -FilePath .env.production -Encoding utf8
```
*Replace YOUR_RAILWAY_BACKEND_URL with actual Railway URL*

### 3.4 Login to Vercel
```powershell
vercel login
```
*Follow the authentication steps*

### 3.5 Deploy to Vercel
```powershell
# First deployment (interactive)
vercel

# Answer prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? voting-frontend
# Directory? ./
# Override settings? No

# Deploy to production
vercel --prod
```

### 3.6 Set Environment Variables in Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - **Variable**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-backend-url.up.railway.app/api`
   - **Environment**: Production, Preview, Development
5. Click "Save"
6. Go to "Deployments" → Redeploy

### 3.7 Get Your Frontend URL
Your app is now live at: `https://voting-frontend-xxx.vercel.app`

---

## 🔧 STEP 4: Configure CORS in Backend

Update backend to allow Vercel domain:

1. Go to Railway dashboard → Your service → Shell
2. Or update locally and push:

Edit `backend/src/server.js` - update CORS:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app', // Add your Vercel URL
    'https://*.vercel.app' // Allow all Vercel preview deployments
  ],
  credentials: true
};
```

3. Push changes:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy.

---

## ✅ STEP 5: Verify Deployment

### 5.1 Test Backend
```powershell
# Test health endpoint
curl https://your-railway-backend.up.railway.app/

# Should return: "Blockchain Voting System Backend Running"
```

### 5.2 Test Frontend
Open your Vercel URL in browser: `https://your-app.vercel.app`

### 5.3 Test Full Flow
1. Register a voter
2. Login
3. Vote
4. Check blockchain transaction

---

## 🔄 CONTINUOUS DEPLOYMENT

### Auto-Deploy on Git Push

**Railway (Backend):**
- Automatically deploys when you push to GitHub
- Set up in Railway Dashboard → Settings → Deploy

**Vercel (Frontend):**
- Automatically deploys on git push
- Already configured by default

### Manual Deploy Commands
```powershell
# Backend (Railway)
cd d:\DVS\backend
railway up

# Frontend (Vercel)
cd d:\DVS\frontend
vercel --prod
```

---

## 📊 Free Tier Limits

### Railway.app
- ✅ 500 hours/month
- ✅ 1GB RAM
- ✅ PostgreSQL included
- ✅ No credit card required

### Vercel
- ✅ Unlimited bandwidth
- ✅ 100GB storage
- ✅ Automatic SSL
- ✅ No credit card required

---

## 🛠️ Troubleshooting

### Backend Issues
```powershell
# View logs
railway logs

# Restart service
railway restart

# Open shell
railway shell
```

### Frontend Issues
```powershell
# View deployment logs
vercel logs

# Redeploy
vercel --prod --force
```

### Database Issues
```powershell
# Connect to PostgreSQL
railway connect postgres

# Run migrations again
railway run npm run migrate
```

---

## 🎯 Quick Reference

### Your Deployment URLs
- **Backend**: https://voting-backend-production.up.railway.app
- **Frontend**: https://voting-frontend.vercel.app
- **Database**: (Managed by Railway)
- **Blockchain**: (Running on Railway with backend)

### Important Commands
```powershell
# Railway
railway login
railway logs
railway shell
railway restart

# Vercel
vercel login
vercel logs
vercel --prod
```

---

## 🔐 Security Notes

1. **Never commit .env files**
2. **Use strong JWT_SECRET and SESSION_SECRET**
3. **Keep Railway and Vercel environment variables secure**
4. **Enable 2FA on GitHub, Railway, and Vercel**

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Issues: Create GitHub issue in your repo

---

**Deployment Complete! 🎉**

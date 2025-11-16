# 🚂 Railway Backend Deployment Guide

## Complete Step-by-Step Guide to Deploy Mela Chain Backend

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] MongoDB Atlas account (or use Railway's MongoDB)
- [ ] Google OAuth credentials (if using Google login)
- [ ] Your code pushed to GitHub

---

## 🚀 Part 1: Set Up MongoDB (Choose One Option)

### **Option A: MongoDB Atlas (Recommended - Free)**

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free"
   - Sign up with email or Google

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose **M0 FREE** tier
   - Select a cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `melaadmin` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist All IPs**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - IP Address: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://melaadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `/mela` before the `?`
   - Final format:
     ```
     mongodb+srv://melaadmin:yourpassword@cluster0.xxxxx.mongodb.net/mela?retryWrites=true&w=majority
     ```

---

### **Option B: Railway MongoDB (Easier)**

1. We'll add this directly in Railway (covered in Part 3)

---

## 🚀 Part 2: Push Code to GitHub

1. **Initialize Git** (if not done):
   ```bash
   cd c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain
   git init
   git add .
   git commit -m "Initial commit - Mela Chain Backend"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `mela-chain`
   - Make it Private or Public (your choice)
   - **Don't** initialize with README
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mela-chain.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 Part 3: Deploy to Railway

### **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub

---

### **Step 2: Create New Project**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `mela-chain` repository
4. Railway will start deploying (this will fail initially - that's OK!)

---

### **Step 3: Configure Backend Service**

1. **Set Root Directory**:
   - Click on your service
   - Go to "Settings" tab
   - Scroll to "Service Settings"
   - Set **Root Directory**: `backend`
   - Click "Save"

2. **Set Start Command**:
   - In Settings, scroll to "Deploy"
   - Set **Start Command**: `node server.js`
   - Click "Save"

---

### **Step 4: Add MongoDB (If Using Railway)**

If you chose Railway MongoDB instead of Atlas:

1. Click "New" in your project
2. Select "Database"
3. Choose "Add MongoDB"
4. Railway will create a MongoDB instance
5. The `MONGODB_URI` will be automatically available

---

### **Step 5: Add Environment Variables**

1. Click on your backend service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add each variable below:

#### **Required Variables:**

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB (use YOUR connection string)
MONGODB_URI=mongodb+srv://melaadmin:yourpassword@cluster0.xxxxx.mongodb.net/mela?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=mela_jwt_secret_key_2024_super_secure_random_string

# Session Secret (generate a random string)
SESSION_SECRET=mela_session_secret_2024_super_secure_random_string

# Client URL (we'll update this after frontend deployment)
CLIENT_URL=http://localhost:3000

# Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
GOOGLE_CALLBACK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/api/auth/google/callback
```

#### **How to Add Each Variable:**

For each variable above:
1. Click "New Variable"
2. Enter the **Variable Name** (e.g., `PORT`)
3. Enter the **Value** (e.g., `5000`)
4. Click "Add"

**Important Notes:**
- For `MONGODB_URI`: Use your actual MongoDB connection string
- For `JWT_SECRET` and `SESSION_SECRET`: Use long random strings
- For `CLIENT_URL`: We'll update this after deploying frontend
- For Google OAuth: Get from [Google Cloud Console](https://console.cloud.google.com)

---

### **Step 6: Generate Secrets**

For `JWT_SECRET` and `SESSION_SECRET`, generate random strings:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option B: Using Online Generator**
- Go to [randomkeygen.com](https://randomkeygen.com)
- Copy a "Fort Knox Password"

---

### **Step 7: Deploy**

1. After adding all variables, Railway will automatically redeploy
2. Wait 2-3 minutes for deployment
3. Check "Deployments" tab for status

---

### **Step 8: Get Your Backend URL**

1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy your domain (e.g., `mela-backend-production.up.railway.app`)
5. Your backend URL is: `https://mela-backend-production.up.railway.app`

---

### **Step 9: Update CLIENT_URL**

After you deploy your frontend to Vercel:

1. Go back to Railway
2. Click "Variables" tab
3. Find `CLIENT_URL`
4. Update to your Vercel URL: `https://your-app.vercel.app`
5. Railway will redeploy automatically

---

### **Step 10: Update GOOGLE_CALLBACK_URL**

1. In Railway Variables, find `GOOGLE_CALLBACK_URL`
2. Update to: `https://your-backend.railway.app/api/auth/google/callback`
3. Save

---

## 🔍 Part 4: Verify Deployment

### **Test Your Backend:**

1. **Health Check**:
   ```bash
   curl https://your-backend.railway.app/api/health
   ```
   
   Should return:
   ```json
   {"success": true, "message": "Server is running"}
   ```

2. **Test Courses API**:
   ```bash
   curl https://your-backend.railway.app/api/mela/courses
   ```
   
   Should return JSON with courses

3. **Check Railway Logs**:
   - Go to "Deployments" tab
   - Click on latest deployment
   - Click "View Logs"
   - Look for: "Server running on port 5000" and "MongoDB connected"

---

## 🔧 Part 5: Seed Database (Optional)

If you need to add initial data:

1. **Using Railway CLI**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Link to your project
   railway link
   
   # Run seed script
   railway run npm run seed
   ```

2. **Or manually**:
   - Connect to your MongoDB using MongoDB Compass
   - Import your course data
   - Create admin user

---

## 🔐 Part 6: Configure Google OAuth (If Using)

1. **Go to Google Cloud Console**:
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Select your project (or create one)

2. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Mela Chain"

4. **Add Authorized URLs**:
   
   **Authorized JavaScript origins:**
   ```
   https://your-backend.railway.app
   https://your-frontend.vercel.app
   http://localhost:3000
   http://localhost:5000
   ```
   
   **Authorized redirect URIs:**
   ```
   https://your-backend.railway.app/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```

5. **Copy Credentials**:
   - Copy "Client ID"
   - Copy "Client Secret"
   - Add them to Railway variables

---

## 📊 Part 7: Monitor Your Deployment

### **View Logs:**
1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click on active deployment
5. Click "View Logs"

### **Check Metrics:**
1. Go to "Metrics" tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic

### **Set Up Alerts (Optional):**
1. Go to "Settings"
2. Scroll to "Notifications"
3. Add webhook or email for deployment alerts

---

## 🐛 Troubleshooting

### **Issue 1: "Application failed to respond"**

**Check:**
- [ ] `PORT` variable is set to `5000`
- [ ] Root directory is set to `backend`
- [ ] Start command is `node server.js`
- [ ] Check logs for errors

**Solution:**
```bash
# View logs
railway logs

# Look for error messages
```

---

### **Issue 2: "Cannot connect to MongoDB"**

**Check:**
- [ ] `MONGODB_URI` is correct
- [ ] Password doesn't have special characters (or is URL encoded)
- [ ] IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
- [ ] Database name is included in URI

**Solution:**
- Test connection string locally first
- Ensure format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?options`

---

### **Issue 3: "Module not found"**

**Check:**
- [ ] All dependencies are in `package.json`
- [ ] `node_modules` is in `.gitignore`

**Solution:**
```bash
# Locally, ensure all deps are saved
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

### **Issue 4: "CORS errors"**

**Check:**
- [ ] `CLIENT_URL` matches your frontend URL exactly
- [ ] No trailing slash in `CLIENT_URL`

**Solution:**
- Update `CLIENT_URL` in Railway
- Redeploy

---

### **Issue 5: "Google OAuth not working"**

**Check:**
- [ ] `GOOGLE_CLIENT_ID` is correct
- [ ] `GOOGLE_CLIENT_SECRET` is correct
- [ ] `GOOGLE_CALLBACK_URL` matches Google Console
- [ ] Redirect URIs are added in Google Console

**Solution:**
- Double-check all OAuth URLs
- Ensure they match exactly (no trailing slashes)

---

## ✅ Deployment Checklist

- [ ] MongoDB set up (Atlas or Railway)
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Root directory set to `backend`
- [ ] Start command set to `node server.js`
- [ ] All environment variables added
- [ ] Backend deployed successfully
- [ ] Domain generated
- [ ] Health endpoint responds
- [ ] Courses API returns data
- [ ] Logs show no errors
- [ ] MongoDB connected
- [ ] Google OAuth configured (if using)

---

## 🎯 Next Steps

After backend is deployed:

1. **Copy your backend URL**
2. **Deploy frontend to Vercel**
3. **Set `NEXT_PUBLIC_API_URL`** in Vercel to your Railway URL
4. **Update `CLIENT_URL`** in Railway to your Vercel URL
5. **Test the full application**

---

## 📞 Railway Support

- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Status**: [status.railway.app](https://status.railway.app)

---

## 💰 Railway Pricing

**Free Tier:**
- $5 free credit per month
- Enough for hobby projects
- No credit card required

**Pro Plan:**
- $20/month
- More resources
- Priority support

---

## 🔄 Redeployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push

# Railway will automatically redeploy
```

**Manual Redeploy:**
1. Go to Railway dashboard
2. Click "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"

---

## 📝 Environment Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `PORT` | Yes | `5000` | Server port |
| `NODE_ENV` | Yes | `production` | Environment |
| `MONGODB_URI` | Yes | `mongodb+srv://...` | MongoDB connection |
| `JWT_SECRET` | Yes | `random_string_64_chars` | JWT signing key |
| `SESSION_SECRET` | Yes | `random_string_64_chars` | Session key |
| `CLIENT_URL` | Yes | `https://app.vercel.app` | Frontend URL |
| `GOOGLE_CLIENT_ID` | Optional | `123.apps.googleusercontent.com` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional | `GOCSPX-xxx` | Google OAuth |
| `GOOGLE_CALLBACK_URL` | Optional | `https://api.railway.app/callback` | OAuth callback |

---

## 🎉 Success!

Your backend is now deployed on Railway! 

**Your backend URL**: `https://your-backend.railway.app`

Now proceed to deploy your frontend to Vercel and connect them together!

---

**Happy Deploying! 🚀**

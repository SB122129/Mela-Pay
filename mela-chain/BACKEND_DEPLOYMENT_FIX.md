# 🔧 Backend Deployment - Serverless Function Crash Fix

## 🐛 Problem: "Serverless Function Crashed"

This error occurs because **your backend is designed for traditional hosting (Railway, Render), NOT serverless (Vercel Functions)**.

---

## ⚠️ Critical Understanding

Your backend uses:
- ✅ **Express.js** - Traditional server
- ✅ **MongoDB** - Database connection
- ✅ **Passport Sessions** - Stateful authentication
- ✅ **Long-running processes** - Not suitable for serverless

**Vercel Functions are serverless** and have limitations:
- ❌ No persistent connections
- ❌ 10-second timeout
- ❌ No session storage
- ❌ Cold starts

---

## ✅ Solution: Deploy Backend to Railway (Recommended)

Railway is **perfect** for your backend because it supports:
- ✅ Traditional Node.js servers
- ✅ Persistent connections
- ✅ No timeouts
- ✅ Environment variables
- ✅ Free tier available

---

## 🚀 Deploy Backend to Railway (Step-by-Step)

### **Step 1: Prepare Backend for Deployment**

1. **Create a Procfile** (for Railway):
   ```bash
   cd c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain\backend
   ```

   Create file: `Procfile` (no extension)
   ```
   web: node server.js
   ```

2. **Verify package.json has correct start script**:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

3. **Create .env.example** (if not exists):
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret_key
   CLIENT_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   NODE_ENV=production
   ```

---

### **Step 2: Deploy to Railway**

#### **Option A: Deploy via Railway Dashboard (Easiest)**

1. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Click "Login" → Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `mela-chain` repository
   - Railway will auto-detect it's a Node.js project

3. **Configure Root Directory**:
   - Click "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `node server.js`

4. **Add Environment Variables**:
   - Click "Variables" tab
   - Add each variable (see list below)

5. **Deploy**:
   - Railway will automatically deploy
   - Wait 2-3 minutes
   - Copy your backend URL (e.g., `https://mela-backend.up.railway.app`)

---

#### **Option B: Deploy via Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link to project
railway link

# Add environment variables (one by one)
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
# ... add all variables

# Deploy
railway up
```

---

### **Step 3: Required Environment Variables**

Add these in Railway dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mela` |
| `JWT_SECRET` | JWT signing key | `your_super_secret_jwt_key_2024` |
| `SESSION_SECRET` | Session signing key | `your_session_secret_key_2024` |
| `CLIENT_URL` | Frontend URL | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_CALLBACK_URL` | OAuth callback | `https://your-backend.railway.app/api/auth/google/callback` |
| `NODE_ENV` | Environment | `production` |

---

### **Step 4: Set Up MongoDB**

If you don't have MongoDB yet:

#### **Option A: MongoDB Atlas (Free)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist all IPs: `0.0.0.0/0`
6. Get connection string
7. Add to Railway as `MONGODB_URI`

#### **Option B: Railway MongoDB Plugin**

1. In Railway project
2. Click "New" → "Database" → "Add MongoDB"
3. Railway will provide `MONGODB_URI` automatically

---

### **Step 5: Update Google OAuth URLs**

After deployment, update Google Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit OAuth 2.0 Client ID
4. Add **Authorized redirect URIs**:
   ```
   https://your-backend.railway.app/api/auth/google/callback
   ```
5. Add **Authorized JavaScript origins**:
   ```
   https://your-backend.railway.app
   https://your-frontend.vercel.app
   ```

---

### **Step 6: Update Frontend Environment Variable**

After backend is deployed:

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
5. Redeploy frontend

---

## 🔍 Verify Backend Deployment

Test your backend:

```bash
# Test health endpoint
curl https://your-backend.railway.app/api/health

# Should return:
# {"success": true, "message": "Server is running"}

# Test courses endpoint
curl https://your-backend.railway.app/api/mela/courses

# Should return JSON with courses
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Application failed to respond"**

**Cause**: Backend not starting properly

**Solution**:
1. Check Railway logs (click "Deployments" → "View Logs")
2. Verify `PORT` environment variable is set
3. Ensure `server.js` uses `process.env.PORT`
4. Check MongoDB connection string is correct

---

### **Issue 2: "Cannot connect to MongoDB"**

**Cause**: MongoDB URI incorrect or IP not whitelisted

**Solution**:
1. Verify `MONGODB_URI` format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
2. In MongoDB Atlas, whitelist `0.0.0.0/0` (all IPs)
3. Check username/password don't have special characters (URL encode if needed)

---

### **Issue 3: "Google OAuth not working"**

**Cause**: Redirect URLs not updated

**Solution**:
1. Update Google Console with Railway URLs
2. Update `GOOGLE_CALLBACK_URL` in Railway
3. Update `CLIENT_URL` to your Vercel URL
4. Restart Railway deployment

---

### **Issue 4: "CORS errors"**

**Cause**: Frontend URL not allowed

**Solution**:
1. Update `CLIENT_URL` in Railway to your Vercel URL
2. Ensure backend CORS configuration includes your frontend:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

---

### **Issue 5: "Session not persisting"**

**Cause**: Cookie settings

**Solution**:
1. Ensure `SESSION_SECRET` is set
2. In production, cookies need HTTPS
3. Update session config if needed:
   ```javascript
   cookie: {
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'none', // For cross-origin
     maxAge: 24 * 60 * 60 * 1000
   }
   ```

---

## 📊 Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] MongoDB connected
- [ ] All environment variables set
- [ ] Backend URL accessible
- [ ] Health endpoint responds
- [ ] Courses API returns data
- [ ] Google OAuth URLs updated
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Frontend redeployed
- [ ] CORS working
- [ ] Authentication working
- [ ] Payment flow working

---

## 🎯 Alternative Backend Hosting Options

If Railway doesn't work, try:

### **1. Render**
- Free tier available
- Similar to Railway
- [render.com](https://render.com)

### **2. Heroku**
- Classic PaaS
- Free tier limited
- [heroku.com](https://heroku.com)

### **3. DigitalOcean App Platform**
- $5/month
- More control
- [digitalocean.com](https://www.digitalocean.com/products/app-platform)

### **4. Fly.io**
- Free tier available
- Global deployment
- [fly.io](https://fly.io)

---

## 📝 Quick Commands Reference

```bash
# Railway CLI
railway login
railway init
railway link
railway up
railway logs
railway variables set KEY=value
railway open

# Test backend
curl https://your-backend.railway.app/api/health
curl https://your-backend.railway.app/api/mela/courses

# View logs
railway logs --follow
```

---

## 🚨 Important Notes

1. **Never use Vercel for this backend** - It's designed for traditional hosting
2. **Railway is free** - Generous free tier for hobby projects
3. **MongoDB Atlas is free** - M0 tier is perfect for development
4. **Keep secrets safe** - Never commit `.env` files
5. **Update OAuth URLs** - After every deployment URL change

---

## ✅ Success Indicators

Your backend is working when:

- ✅ Railway shows "Deployed" status
- ✅ Health endpoint returns 200 OK
- ✅ Courses API returns data
- ✅ No errors in Railway logs
- ✅ Frontend can fetch data
- ✅ Login/signup works
- ✅ Google OAuth works

---

## 📞 Need Help?

1. **Check Railway logs**: Most errors show here
2. **Test endpoints**: Use curl or Postman
3. **Verify environment variables**: Double-check all values
4. **Check MongoDB**: Ensure connection works
5. **Review CORS**: Ensure frontend URL is allowed

---

**Your backend should now be deployed and working! 🎉**

Once Railway deployment is successful, update your frontend's `NEXT_PUBLIC_API_URL` and redeploy!

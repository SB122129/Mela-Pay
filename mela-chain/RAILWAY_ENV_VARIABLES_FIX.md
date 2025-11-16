# 🔧 Railway Environment Variables - Quick Fix

## ❌ Error: "OAuth2Strategy requires a clientID option"

Your backend is missing the required Google OAuth environment variables.

---

## ✅ Quick Fix: Add Environment Variables

### **Step 1: Go to Railway Dashboard**

1. Open [railway.app](https://railway.app)
2. Click on your project
3. Click on your backend service
4. Click "Variables" tab

---

### **Step 2: Add Required Variables**

Click "New Variable" and add each of these:

#### **Option A: Without Google OAuth (Simplest - Start Here)**

If you want to deploy quickly without Google login first:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB (REQUIRED - Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mela?retryWrites=true&w=majority

# JWT Secret (REQUIRED - Generate random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Session Secret (REQUIRED - Generate random string)
SESSION_SECRET=your_super_secret_session_key_here_make_it_long_and_random

# Client URL (Update after frontend deployment)
CLIENT_URL=http://localhost:3000

# Google OAuth (Set to empty to disable Google login temporarily)
GOOGLE_CLIENT_ID=disabled
GOOGLE_CLIENT_SECRET=disabled
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

#### **Option B: With Google OAuth (Full Setup)**

If you want Google login to work:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mela?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Session Secret
SESSION_SECRET=your_super_secret_session_key_here_make_it_long_and_random

# Client URL
CLIENT_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.up.railway.app/api/auth/google/callback
```

---

### **Step 3: How to Get Each Variable**

#### **MONGODB_URI** (REQUIRED)

**Option A: MongoDB Atlas (Free)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create cluster (M0 Free)
4. Create database user
5. Whitelist all IPs: `0.0.0.0/0`
6. Click "Connect" → "Connect your application"
7. Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mela?retryWrites=true&w=majority
   ```

**Option B: Railway MongoDB Plugin**

1. In Railway, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway provides `MONGODB_URI` automatically

---

#### **JWT_SECRET & SESSION_SECRET** (REQUIRED)

Generate random strings:

**Method 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Method 2: Online Generator**
- Go to [randomkeygen.com](https://randomkeygen.com)
- Copy "Fort Knox Password"

Example:
```
JWT_SECRET=8f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
SESSION_SECRET=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c
```

---

#### **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET** (Optional)

**If you want Google login:**

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Add Authorized redirect URIs:
   ```
   https://your-backend.railway.app/api/auth/google/callback
   ```
7. Copy Client ID and Client Secret

**If you DON'T want Google login (for now):**

Just set them to `disabled`:
```
GOOGLE_CLIENT_ID=disabled
GOOGLE_CLIENT_SECRET=disabled
```

---

### **Step 4: Add Variables in Railway**

For each variable:

1. Click "New Variable"
2. **Variable Name**: (e.g., `PORT`)
3. **Value**: (e.g., `5000`)
4. Click "Add"

Repeat for all variables.

---

### **Step 5: Railway Will Auto-Redeploy**

After adding variables:
- Railway automatically redeploys
- Wait 2-3 minutes
- Check deployment logs

---

## 🔍 Verify Deployment

After redeployment, check logs for:

```
✓ Server running on port 5000
✓ MongoDB connected
✓ No OAuth errors
```

---

## 📋 Complete Variable List (Copy-Paste Ready)

### **Minimal Setup (No Google OAuth)**

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mela?retryWrites=true&w=majority
JWT_SECRET=generate_random_64_char_string_here
SESSION_SECRET=generate_random_64_char_string_here
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=disabled
GOOGLE_CLIENT_SECRET=disabled
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### **Full Setup (With Google OAuth)**

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mela?retryWrites=true&w=majority
JWT_SECRET=generate_random_64_char_string_here
SESSION_SECRET=generate_random_64_char_string_here
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
```

---

## 🎯 Recommended Approach

**Start with Minimal Setup:**

1. Add all variables except real Google OAuth credentials
2. Set `GOOGLE_CLIENT_ID=disabled` and `GOOGLE_CLIENT_SECRET=disabled`
3. Deploy and test
4. Add real Google OAuth later if needed

This way your app works immediately, and you can add Google login later!

---

## 🐛 Common Issues

### **Issue 1: "Cannot connect to MongoDB"**

**Solution:**
- Verify `MONGODB_URI` format
- Ensure password doesn't have special characters
- Whitelist `0.0.0.0/0` in MongoDB Atlas

---

### **Issue 2: "Still getting OAuth error"**

**Solution:**
- Make sure `GOOGLE_CLIENT_ID` is set (even to "disabled")
- Make sure `GOOGLE_CLIENT_SECRET` is set (even to "disabled")
- Redeploy after adding variables

---

### **Issue 3: "Session warning"**

The warning about MemoryStore is normal for development. For production, you can ignore it or use a session store like Redis (optional).

---

## ✅ Success Checklist

- [ ] All required variables added
- [ ] MongoDB URI is correct
- [ ] JWT_SECRET is set
- [ ] SESSION_SECRET is set
- [ ] Google OAuth variables set (even if "disabled")
- [ ] Railway redeployed
- [ ] No errors in logs
- [ ] Backend is accessible

---

## 🎉 After Variables Are Added

Your backend should now:

1. ✅ Start successfully
2. ✅ Connect to MongoDB
3. ✅ No OAuth errors
4. ✅ Respond to API requests

Test it:
```bash
curl https://your-backend.railway.app/api/health
```

---

## 📞 Need MongoDB?

**Quick MongoDB Atlas Setup:**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create cluster (M0 Free tier)
4. Create database user
5. Network Access → Add IP → `0.0.0.0/0`
6. Connect → Copy connection string
7. Add to Railway as `MONGODB_URI`

Takes ~5 minutes!

---

**Add these variables now and your backend will deploy successfully! 🚀**

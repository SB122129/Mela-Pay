# 🔧 Vercel Production URL Setup

## ❌ Problem: Using Preview URL Instead of Production URL

You're seeing a preview URL:
```
https://mela-polkadot-project-gzok-o53yaz05y-yeabsira-ketemas-projects.vercel.app
```

This is a **temporary preview URL** that changes with each deployment!

---

## ✅ Solution: Use Your Production URL

### **Step 1: Find Your Production URL**

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Click your project

2. **Look for "Domains" section**:
   - You'll see your production URL
   - It should look like one of these:
     ```
     https://mela-polkadot-project-gzok.vercel.app
     https://your-custom-domain.com
     ```

3. **Copy the production URL** (without the long hash)

---

### **Step 2: Update CLIENT_URL in Railway**

1. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Click your backend service
   - Go to "Variables" tab

2. **Update CLIENT_URL**:
   - Find `CLIENT_URL`
   - Change to your **production URL**:
     ```
     CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
     ```
   - **No trailing slash!**
   - Save

3. **Railway will auto-redeploy** (wait 2 minutes)

---

### **Step 3: Set as Production Domain in Vercel**

If you don't have a production domain yet:

1. **Go to Vercel Dashboard**
2. Click your project
3. Go to "Settings" → "Domains"
4. Your default production domain should be:
   ```
   mela-polkadot-project-gzok.vercel.app
   ```

---

## 🎯 Understanding Vercel URLs

### **Preview URLs** (Temporary - Changes Every Deploy)
```
❌ https://mela-polkadot-project-gzok-o53yaz05y-yeabsira-ketemas-projects.vercel.app
   ↑ This hash changes with each deployment!
```

**Used for:**
- Testing new deployments
- Pull request previews
- Development branches

**Don't use for:**
- Production environment variables
- OAuth callbacks
- API CORS settings

---

### **Production URLs** (Permanent)
```
✅ https://mela-polkadot-project-gzok.vercel.app
   ↑ This stays the same!
```

**Used for:**
- Production deployment
- Environment variables
- OAuth callbacks
- API CORS settings

---

## 🔧 Complete Setup

### **Railway Variables:**
```bash
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
GOOGLE_CALLBACK_URL=https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

### **Vercel Variables:**
```bash
NEXT_PUBLIC_API_URL=https://melapolkadotproject-production.up.railway.app
```

### **Google Cloud Console - Authorized Redirect URIs:**
```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

---

## 🚀 How to Access Your Production URL

### **Method 1: From Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click your project
3. Look at the top - you'll see "Visit" button
4. The URL shown is your production URL

---

### **Method 2: From Deployments**

1. Go to "Deployments" tab
2. Look for deployment with "Production" badge
3. Click "Visit"
4. Copy URL from browser address bar (without the hash)

---

### **Method 3: From Settings**

1. Go to "Settings" → "Domains"
2. Your production domain is listed there
3. Should be: `mela-polkadot-project-gzok.vercel.app`

---

## ✅ Quick Fix Steps

1. **Find your production URL** in Vercel (should be `mela-polkadot-project-gzok.vercel.app`)
2. **Update `CLIENT_URL` in Railway** to production URL
3. **Wait 2 minutes** for Railway to redeploy
4. **Test your site** using production URL

---

## 🎯 Your Correct URLs

**Frontend Production (Vercel):**
```
https://mela-polkadot-project-gzok.vercel.app
```

**Backend (Railway):**
```
https://melapolkadotproject-production.up.railway.app
```

---

## 🐛 Why Preview URLs Cause Issues

1. **They change with each deployment**
   - New hash every time you deploy
   - OAuth callbacks break
   - CORS settings don't match

2. **They're temporary**
   - Meant for testing only
   - Not for production use

3. **They cause redirect issues**
   - Google OAuth gets confused
   - Users get redirected to old preview URLs
   - CORS errors

---

## ✅ After Fixing

When you use the production URL:

- ✅ Google OAuth works consistently
- ✅ CORS works properly
- ✅ Users always get redirected correctly
- ✅ No more changing URLs
- ✅ Stable production environment

---

## 📋 Checklist

- [ ] Find production URL in Vercel dashboard
- [ ] Production URL: `https://mela-polkadot-project-gzok.vercel.app`
- [ ] Update `CLIENT_URL` in Railway to production URL
- [ ] Remove any preview URLs from Railway variables
- [ ] Wait for Railway to redeploy
- [ ] Test using production URL
- [ ] Verify Google OAuth works
- [ ] Verify CORS works

---

## 🚀 Using Railway CLI

```bash
# Update to production URL
railway variables set CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app

# Verify
railway variables | grep CLIENT_URL
```

---

**Use your production URL (mela-polkadot-project-gzok.vercel.app), not the preview URL with the hash!** 🎯

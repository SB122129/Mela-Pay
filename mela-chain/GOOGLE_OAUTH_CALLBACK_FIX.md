# 🔧 Google OAuth Callback Fix - URGENT

## ❌ The Problem

Google is redirecting to your **Vercel frontend**:
```
❌ https://mela-polkadot-project-gzok.vercel.app/api/auth/google/callback
```

But it should redirect to your **Railway backend**:
```
✅ https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

---

## 🎯 Root Cause

In **Google Cloud Console**, the "Authorized redirect URI" is set to your Vercel URL instead of your Railway URL.

---

## ✅ Quick Fix (5 Minutes)

### **Step 1: Go to Google Cloud Console**

1. Visit [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click on your **OAuth 2.0 Client ID**

---

### **Step 2: Update Authorized Redirect URIs**

1. Scroll to **"Authorized redirect URIs"**

2. **Remove this (if present):**
   ```
   ❌ https://mela-polkadot-project-gzok.vercel.app/api/auth/google/callback
   ```

3. **Add this instead:**
   ```
   ✅ https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
   ```

4. Click **"Save"** at the bottom

---

### **Step 3: Verify Railway Environment Variables**

Make sure these are set in Railway:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

---

### **Step 4: Test Google Login**

1. Go to your Vercel site: `https://mela-polkadot-project-gzok.vercel.app`
2. Click "Sign in with Google"
3. Select your Google account
4. Should now redirect properly! ✅

---

## 📊 Correct OAuth Flow

```
1. User clicks "Sign in with Google" on Vercel
   ↓
2. Frontend redirects to Railway backend:
   https://melapolkadotproject-production.up.railway.app/api/auth/google
   ↓
3. Backend redirects to Google login
   ↓
4. User selects Google account
   ↓
5. Google redirects to Railway backend callback:
   ✅ https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
   ↓
6. Backend processes auth, generates token
   ↓
7. Backend redirects to Vercel frontend callback:
   https://mela-polkadot-project-gzok.vercel.app/auth/callback?token=xxx
   ↓
8. Frontend stores token and redirects to home page
```

---

## 🐛 Why This Happened

You probably added your Vercel URL to Google Cloud Console when setting up OAuth, but the callback should always go to your **backend** (Railway), not your frontend (Vercel).

**Remember:**
- ✅ Google redirects to **backend** (Railway)
- ✅ Backend redirects to **frontend** (Vercel)
- ❌ Google should NOT redirect directly to frontend

---

## 📋 Google Cloud Console Settings

### **Authorized JavaScript Origins** (Optional)
```
https://mela-polkadot-project-gzok.vercel.app
https://melapolkadotproject-production.up.railway.app
```

### **Authorized Redirect URIs** (Required)
```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

**Important:**
- ✅ Only the Railway backend URL
- ✅ Must end with `/api/auth/google/callback`
- ✅ Use `https://` not `http://`
- ✅ No trailing slash after `callback`

---

## 🔍 How to Verify It's Fixed

### **Before Fix:**
Google redirects to:
```
❌ https://mela-polkadot-project-gzok.vercel.app/api/auth/google/callback?code=...
```
Result: 404 error (Vercel doesn't have this API endpoint)

### **After Fix:**
Google redirects to:
```
✅ https://melapolkadotproject-production.up.railway.app/api/auth/google/callback?code=...
```
Result: Backend processes auth, redirects to frontend callback page

---

## 🚀 Testing Steps

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Go to your Vercel site**
3. **Click "Sign in with Google"**
4. **Watch the URL changes:**
   - Should go to Railway backend
   - Then to Google login
   - Then back to Railway backend callback
   - Then to Vercel frontend `/auth/callback`
   - Finally to home page `/`

---

## ✅ Success Indicators

After fixing, you should see:

1. ✅ Click "Sign in with Google"
2. ✅ Redirected to Google login
3. ✅ Select account
4. ✅ Brief flash of Railway URL (backend processing)
5. ✅ Redirected to Vercel `/auth/callback`
6. ✅ "Completing authentication..." message
7. ✅ Redirected to home page
8. ✅ Logged in (name appears in header)

---

## 🐛 Common Mistakes

### **Mistake 1: Adding Vercel URL to Redirect URIs**
```
❌ https://mela-polkadot-project-gzok.vercel.app/api/auth/google/callback
```
This is wrong! Vercel is your frontend, not your backend.

### **Mistake 2: Forgetting /api/auth/google/callback**
```
❌ https://melapolkadotproject-production.up.railway.app
```
Must include the full callback path!

### **Mistake 3: Using http:// instead of https://**
```
❌ http://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```
Railway uses HTTPS!

---

## 📝 Complete Checklist

- [ ] Go to Google Cloud Console
- [ ] Find your OAuth 2.0 Client ID
- [ ] Remove Vercel URL from redirect URIs (if present)
- [ ] Add Railway backend URL: `https://melapolkadotproject-production.up.railway.app/api/auth/google/callback`
- [ ] Save changes
- [ ] Verify Railway has correct `GOOGLE_CALLBACK_URL`
- [ ] Verify Railway has correct `CLIENT_URL`
- [ ] Clear browser cache
- [ ] Test Google login
- [ ] Verify redirect to home page
- [ ] Verify user is logged in

---

## 🎯 Your Correct URLs

**Google Cloud Console - Authorized Redirect URI:**
```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

**Railway - GOOGLE_CALLBACK_URL:**
```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

**Railway - CLIENT_URL:**
```
https://mela-polkadot-project-gzok.vercel.app
```

**Vercel - NEXT_PUBLIC_API_URL:**
```
https://melapolkadotproject-production.up.railway.app
```

---

## 🔧 Quick Command to Verify Railway Variables

```bash
railway variables | grep -E "GOOGLE|CLIENT"
```

Should show:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

---

## 🎉 After Fix

Your Google OAuth will work perfectly:
- ✅ Users click "Sign in with Google"
- ✅ Authenticate with Google
- ✅ Get redirected to home page
- ✅ Logged in automatically
- ✅ No errors!

---

**Fix: Update Google Cloud Console redirect URI to your Railway backend URL!** 🎯

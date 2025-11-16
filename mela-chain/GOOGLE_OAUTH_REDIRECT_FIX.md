# 🔧 Google OAuth Redirect Fix

## ✅ Fixed: Redirect to Home After Google Login

I've updated your callback page to redirect users to the **home page (/)** instead of `/my-courses` after Google login.

---

## 📋 How Google OAuth Works in Your App

### **Flow:**

1. **User clicks "Sign in with Google"** on your frontend
2. **Frontend redirects** to backend: `https://melapolkadotproject-production.up.railway.app/api/auth/google`
3. **Backend redirects** to Google login
4. **User selects Google account**
5. **Google redirects back** to backend: `https://melapolkadotproject-production.up.railway.app/api/auth/google/callback`
6. **Backend processes** authentication and generates JWT token
7. **Backend redirects** to frontend: `https://mela-polkadot-project-gzok.vercel.app/auth/callback?token=xxx`
8. **Frontend callback page** stores token and user data
9. **Frontend redirects** to home page `/` ✅

---

## 🎯 What I Changed

**File:** `frontend/pages/auth/callback.js`

**Before:**
```javascript
} else {
  router.push('/my-courses');  // Redirected to my-courses
}
```

**After:**
```javascript
} else {
  router.push('/');  // Now redirects to home page
}
```

---

## 🔧 Important: Update Google Cloud Console

You need to add your Vercel URL to Google's authorized redirect URIs:

### **Step 1: Go to Google Cloud Console**

1. Visit [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID

### **Step 2: Add Authorized Redirect URIs**

Add these URLs to "Authorized redirect URIs":

```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

**Important:**
- ✅ Use your actual Railway URL
- ✅ Must be exact match
- ✅ Use `https://` not `http://`
- ✅ No trailing slash

### **Step 3: Save Changes**

Click "Save" at the bottom.

---

## 🔧 Update Railway Environment Variables

Make sure these are set in Railway:

```bash
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GOOGLE_CALLBACK_URL=https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

**Important:**
- `GOOGLE_CALLBACK_URL` = Your Railway backend URL + `/api/auth/google/callback`
- `CLIENT_URL` = Your Vercel frontend URL (no trailing slash)

---

## 📊 Complete OAuth Flow

```
User clicks "Sign in with Google"
    ↓
Frontend: window.location.href = 'https://melapolkadotproject-production.up.railway.app/api/auth/google'
    ↓
Backend: Redirects to Google login
    ↓
Google: User selects account
    ↓
Google: Redirects to https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
    ↓
Backend: Authenticates user, generates token
    ↓
Backend: Redirects to https://mela-polkadot-project-gzok.vercel.app/auth/callback?token=xxx
    ↓
Frontend /auth/callback: Stores token, fetches user data
    ↓
Frontend: Redirects to / (home page) ✅
```

---

## 🐛 Troubleshooting

### **Issue 1: "Redirect URI Mismatch"**

**Error from Google:**
```
Error 400: redirect_uri_mismatch
```

**Solution:**
1. Go to Google Cloud Console
2. Add exact Railway callback URL to authorized redirect URIs:
   ```
   https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
   ```
3. Save and try again

---

### **Issue 2: "Invalid Client"**

**Error:**
```
Error: invalid_client
```

**Solution:**
1. Check `GOOGLE_CLIENT_ID` in Railway
2. Check `GOOGLE_CLIENT_SECRET` in Railway
3. Make sure they match Google Cloud Console credentials
4. Redeploy Railway

---

### **Issue 3: Redirects to Preview URL**

**Problem:** Redirects to `...o53yaz05y-yeabsira-ketemas-projects.vercel.app` instead of production

**Solution:**
1. Update `CLIENT_URL` in Railway to your production Vercel URL:
   ```
   CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
   ```
2. Railway will redeploy
3. Test again

---

### **Issue 4: Stuck on "Completing authentication..."**

**Problem:** Callback page doesn't redirect

**Solution:**
1. Check browser console for errors
2. Verify token is in URL: `/auth/callback?token=xxx`
3. Check `NEXT_PUBLIC_API_URL` is set in Vercel
4. Check network tab for failed API calls

---

## ✅ Testing Google OAuth

### **Step 1: Deploy Changes**

```bash
# Commit and push the callback.js change
git add frontend/pages/auth/callback.js
git commit -m "Update Google OAuth to redirect to home page"
git push
```

Vercel will auto-deploy.

---

### **Step 2: Test the Flow**

1. **Go to your Vercel site**:
   ```
   https://mela-polkadot-project-gzok.vercel.app
   ```

2. **Click "Sign in with Google"**

3. **Select your Google account**

4. **Should redirect to home page** ✅

---

### **Step 3: Verify User is Logged In**

After redirect to home:
1. Check if user name appears in header
2. Check if "My Courses" and "Cart" links are visible
3. Open browser console and run:
   ```javascript
   console.log(localStorage.getItem('user'));
   console.log(localStorage.getItem('token'));
   ```
   Both should have values.

---

## 📋 Complete Checklist

- [ ] Google Cloud Console: Redirect URI added
- [ ] Railway: `GOOGLE_CLIENT_ID` set
- [ ] Railway: `GOOGLE_CLIENT_SECRET` set
- [ ] Railway: `GOOGLE_CALLBACK_URL` set
- [ ] Railway: `CLIENT_URL` set to production Vercel URL
- [ ] Frontend: callback.js updated (done ✅)
- [ ] Frontend: Changes deployed to Vercel
- [ ] Test: Google login works
- [ ] Test: Redirects to home page
- [ ] Test: User is logged in

---

## 🎯 Quick Fix Summary

1. **Update callback.js** ✅ (Done)
2. **Add redirect URI in Google Cloud Console**
3. **Update `CLIENT_URL` in Railway** to production Vercel URL
4. **Deploy changes**
5. **Test Google login**

---

## 📝 Your URLs

**Frontend (Vercel Production):**
```
https://mela-polkadot-project-gzok.vercel.app
```

**Backend (Railway):**
```
https://melapolkadotproject-production.up.railway.app
```

**Google OAuth Callback (Railway):**
```
https://melapolkadotproject-production.up.railway.app/api/auth/google/callback
```

**Frontend Auth Callback:**
```
https://mela-polkadot-project-gzok.vercel.app/auth/callback
```

---

## 🚀 After Setup

Users will:
1. ✅ Click "Sign in with Google"
2. ✅ Select Google account
3. ✅ Get redirected to home page
4. ✅ Be logged in automatically
5. ✅ See their name in header

---

**The callback page now redirects to home! Just update Google Cloud Console and Railway variables.** 🎉

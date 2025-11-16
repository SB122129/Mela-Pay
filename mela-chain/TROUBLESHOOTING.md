# 🔧 Troubleshooting: "Page Can't Be Reached"

## What's Happening Now

```
You click "Continue with Google"
    ↓
Browser tries to go to Google OAuth page
    ↓
❌ ERROR: Page can't be reached
```

## Why This Happens

Your `.env` file has placeholder values:
```env
GOOGLE_CLIENT_ID=your-google-client-id        ← Not a real ID!
GOOGLE_CLIENT_SECRET=your-google-client-secret ← Not a real secret!
```

When Passport tries to redirect to Google with these fake credentials, Google rejects the request, causing "page can't be reached."

---

## ✅ The Fix

### Option 1: Get Real Google Credentials (Recommended)

Follow the guide: **`GET_GOOGLE_CREDENTIALS.md`**

This takes about 5 minutes and gives you:
- Real Google Client ID
- Real Google Client Secret

### Option 2: Test Without Google Sign-In (Temporary)

You can still use the app with email/password login:

1. Go to http://localhost:3000/signup
2. Create an account with email/password
3. Use regular login instead of Google

---

## 🎯 What You Need to Do

### 1. Get Google OAuth Credentials

Visit: https://console.cloud.google.com/apis/credentials

Create OAuth 2.0 Client ID with this redirect URI:
```
http://localhost:5000/api/auth/google/callback
```

### 2. Update .env File

Open `backend/.env` and replace:

```env
EMAIL_USER=your-actual-email@gmail.com
GOOGLE_CLIENT_ID=paste-real-client-id-here
GOOGLE_CLIENT_SECRET=paste-real-client-secret-here
```

### 3. Restart Backend

```bash
cd backend
npm run dev
```

### 4. Test Again

Go to http://localhost:3000/login and click "Continue with Google"

---

## 🔍 How to Check If It's Working

### ✅ Working (Good):
```
Click "Continue with Google"
    ↓
Redirects to accounts.google.com
    ↓
Shows "Sign in with Google" page
    ↓
After signing in, redirects back to your app
```

### ❌ Not Working (Current State):
```
Click "Continue with Google"
    ↓
Browser shows "This site can't be reached"
    ↓
URL shows something like: localhost:5000/api/auth/google
```

---

## 📋 Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Client ID
- [ ] Added redirect URI: `http://localhost:5000/api/auth/google/callback`
- [ ] Copied Client ID to `.env`
- [ ] Copied Client Secret to `.env`
- [ ] Updated EMAIL_USER in `.env`
- [ ] Restarted backend server
- [ ] Tested login

---

## 🆘 Quick Commands

### Check if .env has Google credentials:
```bash
cd backend
type .env | findstr GOOGLE
```

### Restart backend:
```bash
cd backend
npm run dev
```

### Test OAuth endpoint directly:
Open browser: http://localhost:5000/api/auth/google

If credentials are correct, this should redirect to Google.
If not, you'll see an error.

---

## 💡 Pro Tip

You can test if your backend is running correctly by visiting:
```
http://localhost:5000/api/courses
```

This should show a list of courses (doesn't need Google OAuth).

---

**Next Step:** Follow `GET_GOOGLE_CREDENTIALS.md` to get your credentials!

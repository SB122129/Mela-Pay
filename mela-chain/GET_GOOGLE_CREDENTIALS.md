# 🔑 How to Get Google OAuth Credentials

## The Problem
You're getting "page can't be reached" because Google OAuth credentials are not configured yet.

Your `.env` file currently has:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

These are placeholder values - you need to replace them with real credentials from Google.

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Go to Google Cloud Console
Open this link: https://console.cloud.google.com/apis/credentials

### Step 2: Create a Project (if you don't have one)
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it "Mela Chain" or anything you like
4. Click "Create"

### Step 3: Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 4: Create OAuth Credentials
1. Go back to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - Choose "External"
   - Fill in app name: "Mela Chain"
   - Add your email
   - Click "Save and Continue" through all steps

4. Now create the OAuth client ID:
   - Application type: **Web application**
   - Name: "Mela Chain Web Client"
   
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5000
   http://localhost:3000
   ```

6. Add **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

7. Click "Create"

### Step 5: Copy Your Credentials
You'll see a popup with:
- **Client ID** (looks like: 123456789-abc123.apps.googleusercontent.com)
- **Client Secret** (looks like: GOCSPX-abc123xyz)

**IMPORTANT: Keep these safe!**

### Step 6: Update Your .env File

Open `backend/.env` and replace these lines:

**Before:**
```env
EMAIL_USER=your-email@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**After:**
```env
EMAIL_USER=youractual@gmail.com
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
```

### Step 7: Restart Your Backend

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Test It

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. You should now see the Google sign-in page!
4. Sign in with your Google account
5. You'll be redirected back to your app

---

## 🎯 What Each Credential Does

- **EMAIL_USER**: Your Gmail address (for sending emails from the app)
- **EMAIL_PASSWORD**: App password `qmuo gejh vwfp yrvx` (already set)
- **GOOGLE_CLIENT_ID**: Identifies your app to Google
- **GOOGLE_CLIENT_SECRET**: Secret key for secure communication
- **GOOGLE_CALLBACK_URL**: Where Google sends users after login

---

## 🐛 Still Getting Errors?

### "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console is EXACTLY:
  `http://localhost:5000/api/auth/google/callback`
- No trailing slash, no extra spaces

### "Access blocked: This app's request is invalid"
- Make sure you enabled Google+ API
- Configure OAuth consent screen

### Backend shows "Invalid client ID"
- Check for typos in `.env`
- Make sure there are no quotes around the values
- Make sure there are no extra spaces

---

## 📝 Example .env (with fake credentials)

```env
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrSt
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Replace with your actual values!

---

**Need more help?** Check the detailed guide: `GOOGLE_OAUTH_SETUP.md`

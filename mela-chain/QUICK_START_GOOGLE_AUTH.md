# 🚀 Quick Start: Google Sign-In

## ✅ What I've Done

I've successfully implemented Google OAuth Sign-In for your Mela Chain project:

### Backend Changes:
1. ✅ Added Google OAuth Strategy to `backend/config/passport.js`
2. ✅ Updated User model to support `googleId` field
3. ✅ Made password optional for OAuth users
4. ✅ Configured automatic account linking by email
5. ✅ Set up proper error handling

### Frontend:
- ✅ Login page already has "Continue with Google" button
- ✅ OAuth callback handler already exists at `/auth/callback`

## 🔑 Your Credentials

**Gmail App Password (for email service):**
```
qmuo gejh vwfp yrvx
```

## ⚡ Quick Setup (3 Steps)

### Step 1: Get Google OAuth Credentials

1. Visit: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add this redirect URI:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. Copy your Client ID and Client Secret

### Step 2: Update .env File

Open `backend/.env` and add/update:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx

# Google OAuth
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

## 🧪 Test It

1. Go to: http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. You'll be redirected to your courses page

## 📁 Files Modified

### Backend:
- `backend/config/passport.js` - Added Google OAuth Strategy
- `backend/models/User.js` - Added `googleId` field, made password optional

### Frontend:
- Already configured! No changes needed.

## 🔍 How It Works

```
User clicks "Continue with Google"
    ↓
Redirects to Google Sign-In
    ↓
User authenticates with Google
    ↓
Google redirects to: /api/auth/google/callback
    ↓
Backend creates/updates user
    ↓
Generates JWT token
    ↓
Redirects to: /auth/callback?token=<jwt>
    ↓
Frontend stores token & user data
    ↓
Redirects to /my-courses
```

## ⚠️ Important Notes

1. **Email Address**: Update `EMAIL_USER` in `.env` with your actual Gmail address
2. **Google Console**: Make sure to enable Google+ API
3. **Redirect URI**: Must exactly match in Google Console and `.env`
4. **App Password**: The provided password (`qmuo gejh vwfp yrvx`) is for Gmail SMTP, not OAuth

## 🐛 Common Issues

### "redirect_uri_mismatch"
- Check that redirect URI in Google Console is exactly:
  `http://localhost:5000/api/auth/google/callback`

### "Invalid credentials"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- No extra spaces or quotes

### Users not created
- Check MongoDB is running
- Check backend console for errors

## 📧 Need Help?

Check the detailed guide: `GOOGLE_OAUTH_SETUP.md`

---

**You're all set!** Just add your Google OAuth credentials to `.env` and restart the backend.

# Google OAuth Setup Guide

## ✅ What's Been Configured

The Google Sign-In functionality has been implemented with the following:

1. **Passport Google OAuth Strategy** - Added to `backend/config/passport.js`
2. **User Model Updates** - Added `googleId` field to support OAuth users
3. **Auth Routes** - Google OAuth routes already configured in `backend/routes/auth.js`
4. **Auth Controller** - Callback handler ready in `backend/controllers/authController.js`

## 🔧 Setup Steps

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add **Authorized JavaScript origins**:
     ```
     http://localhost:5000
     http://localhost:3000
     ```
   - Add **Authorized redirect URIs**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

### Step 2: Update Your .env File

Open `backend/.env` and update these values:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Important Notes:**
- The `EMAIL_PASSWORD` is your Google App Password (already provided: `qmuo gejh vwfp yrvx`)
- Replace `GOOGLE_CLIENT_ID` with your actual Client ID from Google Cloud Console
- Replace `GOOGLE_CLIENT_SECRET` with your actual Client Secret from Google Cloud Console
- Make sure `EMAIL_USER` is set to your Gmail address

### Step 3: Restart Your Backend Server

```bash
cd backend
npm run dev
```

## 🧪 Testing Google Sign-In

### Backend Testing

Test the OAuth flow by visiting:
```
http://localhost:5000/api/auth/google
```

This should:
1. Redirect you to Google's sign-in page
2. Ask for permission to access your profile and email
3. Redirect back to your app with a token
4. Create or update user in database

### Frontend Integration

The frontend should have a "Sign in with Google" button that links to:
```javascript
const handleGoogleSignIn = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};
```

After successful authentication, the user will be redirected to:
```
http://localhost:3000/auth/callback?token=<jwt-token>
```

## 📝 How It Works

1. **User clicks "Sign in with Google"**
   - Frontend redirects to `/api/auth/google`

2. **Google Authentication**
   - User authenticates with Google
   - Google redirects to `/api/auth/google/callback`

3. **User Creation/Login**
   - Backend checks if user exists by `googleId`
   - If not, checks by email and links accounts
   - If still not found, creates new user
   - Updates `lastLogin` timestamp

4. **Token Generation**
   - Backend generates JWT token
   - Redirects to frontend with token: `/auth/callback?token=<jwt>`

5. **Frontend Handling**
   - Frontend extracts token from URL
   - Stores token in localStorage
   - Redirects user to dashboard

## 🔒 Security Features

- ✅ Password not required for OAuth users
- ✅ Automatic account linking by email
- ✅ JWT token authentication
- ✅ Secure callback handling
- ✅ User session management

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- No trailing slashes
- Correct protocol (http vs https)

### Error: "Access blocked: This app's request is invalid"
- Enable Google+ API in Google Cloud Console
- Make sure OAuth consent screen is configured

### Error: "Invalid credentials"
- Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Make sure there are no extra spaces or quotes

### Users not being created
- Check MongoDB connection
- Check backend console for errors
- Verify User model has `googleId` field

## 📧 Email Configuration

The app password `qmuo gejh vwfp yrvx` is for Gmail SMTP to send emails.

To generate a new one:
1. Go to Google Account Settings
2. Security > 2-Step Verification (must be enabled)
3. App passwords
4. Generate new password for "Mail"
5. Update `EMAIL_PASSWORD` in `.env`

## ✨ Features Implemented

- ✅ Google OAuth 2.0 authentication
- ✅ Automatic user creation
- ✅ Account linking by email
- ✅ JWT token generation
- ✅ Session management
- ✅ Last login tracking
- ✅ Secure password handling for OAuth users

## 🚀 Next Steps

1. Update your `.env` file with actual Google credentials
2. Restart the backend server
3. Test the OAuth flow
4. Implement the frontend "Sign in with Google" button
5. Handle the callback on frontend to store the JWT token

---

**Need Help?** Check the backend console logs for detailed error messages.

# Mela Chain Authentication & Payment Setup Guide

## 🎯 Overview

This guide covers the setup of all new features:
- User signup and login (traditional + Google OAuth)
- Polkadot wallet integration for payments
- User purchased courses dashboard
- Admin account creation
- Email notifications

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (running locally or remote)
3. **Gmail Account** (for email notifications)
4. **Google Cloud Console** (for OAuth)
5. **Polkadot.js Extension** (for wallet testing)

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

New dependencies added:
- `nodemailer` - Email service
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `express-session` - Session management

### 2. Configure Environment Variables

Copy the template and configure:

```bash
cp .env.template .env
```

Edit `.env` with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mela-chain

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 3. Gmail App Password Setup

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Use the 16-character password in `.env` as `EMAIL_PASSWORD`

**Note:** The password you provided (`qmuo gejh vwfp yrvx`) should be used as the `EMAIL_PASSWORD`.

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000/auth/callback`
6. Copy Client ID and Secret to `.env`

### 5. Create Admin Account

Run the admin creation script:

```bash
npm run create-admin
```

Or manually:

```bash
node scripts/createAdmin.js
```

This creates an admin account with:
- **Email:** melapay12@gmail.com
- **Password:** 1122127
- **Role:** admin

### 6. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

New dependencies added:
- `@polkadot/extension-dapp` - Polkadot wallet integration
- `@polkadot/api` - Polkadot blockchain API
- `@polkadot/util` - Utility functions
- `@polkadot/util-crypto` - Cryptographic utilities

### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Frontend Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🚀 New Features

### 1. User Signup & Login

**Signup Page:** `/signup`
- Traditional email/password signup
- Google OAuth signup
- Email validation
- Password strength requirements (min 6 characters)
- Welcome email sent on registration

**Login Page:** `/login`
- Email/password login
- Google OAuth login
- Redirects to My Courses after login

### 2. My Courses Dashboard

**URL:** `/my-courses`

Features:
- View all purchased courses
- Course access links
- Purchase history with payment details
- Direct access to EdX courses

### 3. Polkadot Wallet Integration

**Location:** Checkout page

Features:
- Connect Polkadot.js extension
- View all wallet accounts
- Display DOT balance for each account
- Select account for payment
- Real-time balance updates

**Setup for Testing:**
1. Install [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. Create or import wallet
3. Connect wallet on checkout page

### 4. Admin Panel

**URL:** `/admin`

**Credentials:**
- Email: melapay12@gmail.com
- Password: 1122127

Features:
- View all payments
- Manage courses
- Analytics dashboard
- User management

## 📧 Email Notifications

Emails are sent for:
1. **Welcome Email** - On user signup
2. **Payment Pending** - When payment is created
3. **Payment Confirmed** - When payment is completed
4. **Course Access** - With course details

## 🔐 Authentication Flow

### Traditional Signup/Login
```
User → Signup Form → Backend → Create User → Send Welcome Email → Login → My Courses
```

### Google OAuth
```
User → Click Google Button → Google Auth → Callback → Create/Login User → My Courses
```

## 💳 Payment Flow with Polkadot

```
1. User adds courses to cart
2. Goes to checkout
3. Connects Polkadot wallet
4. Selects account
5. Enters contact info
6. Creates payment
7. Receives payment address & QR code
8. Sends DOT from wallet
9. Payment confirmed
10. Courses added to user account
11. Access from My Courses page
```

## 🧪 Testing

### Test User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/mela/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "melapay12@gmail.com",
    "password": "1122127"
  }'
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/auth/courses` - Get purchased courses (requires auth)
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Admin
- `POST /api/mela/admin/login` - Admin login
- `GET /api/mela/admin/dashboard` - Admin dashboard (requires admin)
- `GET /api/mela/admin/payments` - View all payments (requires admin)

### Courses & Payments
- `GET /api/mela/courses` - Get all courses
- `POST /api/mela/payments/create` - Create payment
- `GET /api/mela/payments/:id` - Get payment status

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check 2FA is enabled on Google account
- Ensure EMAIL_USER and EMAIL_PASSWORD are set in .env

### Google OAuth Not Working
- Verify redirect URIs in Google Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure callback URL matches exactly

### Polkadot Wallet Not Connecting
- Install Polkadot.js extension
- Refresh page after installing extension
- Check browser console for errors
- Ensure extension has permission for localhost

### Admin Login Fails
- Run `node scripts/createAdmin.js` to recreate admin
- Check MongoDB connection
- Verify credentials: melapay12@gmail.com / 1122127

## 📝 Notes

1. **Email Password:** The password `qmuo gejh vwfp yrvx` is a Gmail app password (spaces are optional)
2. **Admin Account:** Email is melapay12@gmail.com (not username melapay12)
3. **Polkadot Network:** Currently connects to Polkadot mainnet (wss://rpc.polkadot.io)
4. **Development Mode:** Payment simulation available in dev mode

## 🎓 User Journey

1. **New User:**
   - Visit `/signup`
   - Create account (email or Google)
   - Receive welcome email
   - Browse courses at `/courses`
   - Add to cart
   - Checkout with Polkadot wallet
   - View purchased courses at `/my-courses`

2. **Returning User:**
   - Visit `/login`
   - Login (email or Google)
   - Go to `/my-courses`
   - Access purchased courses

3. **Admin:**
   - Visit `/admin`
   - Login with admin credentials
   - Manage platform

## 🔗 Important Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin
- My Courses: http://localhost:3000/my-courses
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file configured with all credentials
- [ ] Gmail app password set
- [ ] Google OAuth credentials configured
- [ ] Admin account created
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Polkadot.js extension installed
- [ ] Can signup new user
- [ ] Can login with credentials
- [ ] Can login with Google
- [ ] Can view My Courses
- [ ] Can connect Polkadot wallet
- [ ] Can access admin panel

## 🆘 Support

If you encounter issues:
1. Check console logs (browser and terminal)
2. Verify all environment variables
3. Ensure MongoDB is running
4. Check network tab for API errors
5. Verify Polkadot extension is installed and unlocked

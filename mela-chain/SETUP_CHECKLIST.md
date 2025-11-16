# Mela Chain - Setup Checklist ✅

Use this checklist to ensure everything is configured correctly.

## 📦 Installation

### Backend
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.template`
- [ ] Environment variables configured

### Frontend
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_API_URL` set to backend URL

## 🔧 Configuration

### Backend Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `PORT` - Backend port (default: 5000)
- [ ] `CLIENT_URL` - Frontend URL (default: http://localhost:3000)
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `SESSION_SECRET` - Secret for sessions
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASSWORD` - Gmail app password (`qmuo gejh vwfp yrvx`)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth secret (optional)
- [ ] `GOOGLE_CALLBACK_URL` - OAuth callback URL (optional)

### Email Service (Gmail)
- [ ] Gmail account created/available
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App password generated
- [ ] App password added to `.env` as `EMAIL_PASSWORD`

### Google OAuth (Optional)
- [ ] Google Cloud project created
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URIs configured:
  - [ ] `http://localhost:5000/api/auth/google/callback`
  - [ ] `http://localhost:3000/auth/callback`
- [ ] Client ID and Secret added to `.env`

## 👤 Admin Account

- [ ] Admin creation script executed (`npm run create-admin`)
- [ ] Admin account verified in database
- [ ] Can login with credentials:
  - Email: `melapay12@gmail.com`
  - Password: `1122127`

## 🚀 Server Startup

### Backend
- [ ] MongoDB service running
- [ ] Backend server starts without errors
- [ ] Server running on http://localhost:5000
- [ ] Health check endpoint working (`GET /health`)
- [ ] API endpoints responding

### Frontend
- [ ] Frontend server starts without errors
- [ ] Server running on http://localhost:3000
- [ ] Homepage loads correctly
- [ ] No console errors in browser

## ✨ Feature Testing

### User Authentication

#### Signup
- [ ] Can access `/signup` page
- [ ] Form validation works
- [ ] Can signup with email/password
- [ ] Welcome email sent (check logs if email not configured)
- [ ] User redirected to courses page
- [ ] User data saved in database

#### Login
- [ ] Can access `/login` page
- [ ] Can login with email/password
- [ ] Invalid credentials show error
- [ ] Successful login redirects to My Courses
- [ ] JWT token stored in localStorage
- [ ] User data stored in localStorage

#### Google OAuth (if configured)
- [ ] "Continue with Google" button visible
- [ ] Clicking button redirects to Google
- [ ] Can select Google account
- [ ] Redirected back to app after auth
- [ ] User created/logged in successfully
- [ ] Redirected to My Courses

### Navigation
- [ ] Header shows "Login" and "Sign Up" when logged out
- [ ] Header shows user name when logged in
- [ ] "My Courses" link visible when logged in
- [ ] "Logout" button works
- [ ] Admin link visible for admin users

### My Courses Page
- [ ] Can access `/my-courses` when logged in
- [ ] Redirects to login when not authenticated
- [ ] Shows empty state when no courses
- [ ] Shows purchased courses (after purchase)
- [ ] Course cards display correctly
- [ ] "Access Course" links work
- [ ] Purchase date and payment info shown

### Polkadot Wallet Integration

#### Wallet Connection
- [ ] Polkadot.js extension installed
- [ ] Wallet component visible on checkout
- [ ] "Connect Wallet" button works
- [ ] Extension popup appears
- [ ] Can select accounts
- [ ] Accounts list displayed
- [ ] Balance shown for each account
- [ ] Can switch between accounts
- [ ] Selected account highlighted

#### Checkout Flow
- [ ] Can add courses to cart
- [ ] Can proceed to checkout
- [ ] Contact form validation works
- [ ] Wallet connection required
- [ ] Can select wallet account
- [ ] Payment creation works
- [ ] Redirected to payment page

### Email Notifications
- [ ] Welcome email sent on signup (check logs)
- [ ] Payment pending email sent (check logs)
- [ ] Payment confirmation email sent (check logs)
- [ ] Email templates render correctly
- [ ] No email errors in backend logs

### Admin Panel
- [ ] Can access `/admin` page
- [ ] Login form displayed when not authenticated
- [ ] Can login with admin credentials
- [ ] Dashboard loads successfully
- [ ] Can view payments
- [ ] Can view analytics
- [ ] Can manage courses

## 🔍 API Testing

### Authentication Endpoints
- [ ] `POST /api/auth/signup` - Creates user
- [ ] `POST /api/auth/login` - Returns JWT token
- [ ] `GET /api/auth/profile` - Returns user data (with token)
- [ ] `GET /api/auth/courses` - Returns purchased courses (with token)
- [ ] `GET /api/auth/google` - Redirects to Google (if configured)

### Course Endpoints
- [ ] `GET /api/mela/courses` - Returns course list
- [ ] `GET /api/mela/courses/:id` - Returns course details
- [ ] `GET /api/mela/courses/search?q=query` - Search works

### Payment Endpoints
- [ ] `POST /api/mela/payments/create` - Creates payment
- [ ] `GET /api/mela/payments/:id` - Returns payment status

### Admin Endpoints
- [ ] `POST /api/mela/admin/login` - Admin login works
- [ ] `GET /api/mela/admin/dashboard` - Returns dashboard data (with admin token)
- [ ] `GET /api/mela/admin/payments` - Returns all payments (with admin token)

## 🐛 Common Issues Resolution

### MongoDB Connection Error
- [ ] MongoDB service is running
- [ ] Connection string is correct in `.env`
- [ ] Database name is correct
- [ ] Network/firewall not blocking connection

### Email Not Sending
- [ ] Gmail app password is correct
- [ ] 2FA enabled on Gmail account
- [ ] `EMAIL_USER` and `EMAIL_PASSWORD` set in `.env`
- [ ] Check backend logs for email errors

### Google OAuth Not Working
- [ ] Client ID and Secret are correct
- [ ] Redirect URIs match exactly in Google Console
- [ ] OAuth consent screen configured
- [ ] Correct scopes enabled (profile, email)

### Polkadot Wallet Not Connecting
- [ ] Polkadot.js extension installed
- [ ] Extension is unlocked
- [ ] Page refreshed after installing extension
- [ ] Browser allows extension access to localhost
- [ ] Check browser console for errors

### Admin Login Fails
- [ ] Admin account created (`npm run create-admin`)
- [ ] Using correct email: `melapay12@gmail.com`
- [ ] Using correct password: `1122127`
- [ ] Check database for admin user
- [ ] Check backend logs for errors

### JWT Token Issues
- [ ] `JWT_SECRET` set in `.env`
- [ ] Token stored in localStorage
- [ ] Token not expired (7 days)
- [ ] Authorization header sent correctly

## 📊 Database Verification

### Collections to Check
- [ ] `users` collection exists
- [ ] Admin user exists in `users`
- [ ] `courses` collection has data (after seeding)
- [ ] `payments` collection exists

### User Document Structure
```javascript
{
  email: "user@example.com",
  name: "User Name",
  password: "hashed_password",
  role: "user" or "admin",
  isActive: true,
  purchasedCourses: [],
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Final Verification

### Complete User Flow
1. [ ] Visit homepage
2. [ ] Click "Sign Up"
3. [ ] Create account
4. [ ] Receive welcome email
5. [ ] Browse courses
6. [ ] Add course to cart
7. [ ] Go to checkout
8. [ ] Connect Polkadot wallet
9. [ ] Enter contact info
10. [ ] Create payment
11. [ ] Complete payment (simulate in dev)
12. [ ] Visit My Courses
13. [ ] See purchased course
14. [ ] Access course link

### Admin Flow
1. [ ] Visit `/admin`
2. [ ] Login with admin credentials
3. [ ] View dashboard
4. [ ] Check payments list
5. [ ] View analytics
6. [ ] Logout

## 📝 Notes

**Important Credentials:**
- Admin Email: `melapay12@gmail.com`
- Admin Password: `1122127`
- Email App Password: `qmuo gejh vwfp yrvx`

**Important URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin
- My Courses: http://localhost:3000/my-courses
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login

**Documentation:**
- Quick Start: `QUICK_START.md`
- Full Setup: `AUTHENTICATION_SETUP.md`
- Features: `IMPLEMENTATION_SUMMARY.md`

## ✅ All Done!

If all items are checked, your Mela Chain platform is fully configured and ready to use! 🎉

For issues or questions, refer to:
- `AUTHENTICATION_SETUP.md` - Detailed setup guide
- `QUICK_START.md` - Quick reference
- Backend logs - Check terminal running backend
- Frontend logs - Check browser console (F12)

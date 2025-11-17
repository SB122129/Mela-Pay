# 🎓 Mela PAY - Blockchain Education Platform

> **Learn Smarter, Pay with Crypto**

Mela Chain is a revolutionary blockchain-powered education platform that enables users to purchase EdX courses using Polkadot (DOT) cryptocurrency. Built with modern web technologies and integrated with NowPayments for secure crypto transactions.

![Mela Chain](https://img.shields.io/badge/Mela-Chain-7C3AED?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Polkadot](https://img.shields.io/badge/Polkadot-DOT-E6007A?style=for-the-badge&logo=polkadot)

## ✨ Features

### Core Features
- 🔍 **Browse EdX Courses** - Access thousands of courses from top universities
- 💎 **Pay with DOT** - Secure payments using Polkadot cryptocurrency
- 🛒 **Shopping Cart** - Add multiple courses before checkout
- 📱 **QR Code Payments** - Easy mobile wallet integration
- ⚡ **Real-time Status** - Live payment confirmation tracking
- 👨‍💼 **Admin Dashboard** - Comprehensive management panel
- 📊 **Analytics** - Payment and course statistics
- 🔒 **Secure** - Blockchain-powered security

### New Features ✨
- 🔐 **User Authentication** - Email/password and Google OAuth signup/login
- 👛 **Polkadot Wallet Integration** - Connect Polkadot.js extension for payments
- 📚 **My Courses Dashboard** - View and access all purchased courses
- 📧 **Email Notifications** - Welcome emails and payment confirmations
- 🎯 **User Profiles** - Track purchase history and course access
- 🔑 **Admin Account** - Pre-configured admin access

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **NowPayments API** for crypto payments
- **EdX API** for course data
- **JWT** for authentication
- **Passport.js** with Google OAuth
- **Nodemailer** for email service
- **Axios** for HTTP requests

### Frontend
- **Next.js 13** with React
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Polkadot.js Extension** integration
- **@polkadot/api** for blockchain interaction
- **QR Code** generation
- **Context API** for state management

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB database (local or Atlas)
- NowPayments API key (optional for development)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=your_mongodb_connection_string
# NOWPAYMENTS_API_KEY=your_api_key (optional)
# JWT_SECRET=your_secret_key

# Seed the database
npm run seed

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🚀 Quick Start

### Option 1: Quick Start (5 Minutes)
See **[QUICK_START.md](./QUICK_START.md)** for the fastest setup.

### Option 2: Full Setup

1. **Start MongoDB** (if running locally)
2. **Configure Backend**:
   ```bash
   cd backend
   cp .env.template .env
   # Edit .env with your credentials
   npm install
   npm run create-admin  # Creates admin account
   npm run dev
   ```
3. **Configure Frontend**:
   ```bash
   cd frontend
   npm install
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   npm run dev
   ```
4. **Access the Application**: 
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - Admin Panel: `http://localhost:3000/admin`

5. **Login Credentials**:
   - **Admin**: melapay12@gmail.com / 1122127
   - **Create User Account**: Visit `/signup`

## 📚 API Endpoints

### Public Endpoints

#### Courses
- `GET /api/mela/courses` - List all courses
- `GET /api/mela/courses/:id` - Get course details
- `GET /api/mela/courses/featured` - Get featured courses
- `GET /api/mela/courses/search?q=query` - Search courses

#### Payments
- `POST /api/mela/payments/create` - Create new payment
- `GET /api/mela/payments/:id` - Get payment status
- `POST /api/mela/payments/webhook` - NowPayments webhook
- `POST /api/mela/payments/:id/simulate` - Simulate payment (dev only)

### User Authentication Endpoints

#### Public
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

#### Protected (Requires JWT Token)
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/courses` - Get purchased courses

### Admin Endpoints (Requires Authentication)

#### Dashboard
- `GET /api/mela/admin/dashboard` - Get dashboard statistics
- `GET /api/mela/admin/payments` - List all payments
- `GET /api/mela/admin/analytics` - Get revenue analytics

#### Authentication
- `POST /api/mela/admin/login` - Admin login

## 💳 Payment Flow

1. **Browse Courses** - User explores available courses
2. **Add to Cart** - Select courses to purchase
3. **Checkout** - Enter email and name
4. **Payment** - Receive DOT payment address and QR code
5. **Confirmation** - Real-time payment tracking
6. **Access** - Instant course access upon confirmation

## 🔧 Configuration


```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

## 📱 Features in Detail

### User Features
- **Course Catalog**: Browse and search thousands of courses
- **Shopping Cart**: Add multiple courses before checkout
- **Crypto Payment**: Pay securely with Polkadot (DOT)
- **Real-time Updates**: Live payment status tracking
- **Email Notifications**: Confirmation and access emails

### Admin Features
- **Dashboard**: Overview of key metrics
- **Payment Management**: View and track all payments
- **Course Management**: Sync and manage course catalog
- **Analytics**: Revenue and enrollment statistics
- **User Management**: Track customer purchases

## 🔐 Security

- **JWT Authentication** for admin access
- **Blockchain Verification** for payments
- **Environment Variables** for sensitive data
- **CORS Protection** on API endpoints
- **Input Validation** on all forms
- **Webhook Signature Verification** for payment callbacks

## 🧪 Development

### Testing Payments

In development mode, you can simulate payments:

1. Create a payment through checkout
2. On the payment page, click "Simulate Payment"
3. Payment will be marked as confirmed instantly

### Syncing Courses

To sync courses from EdX:

```bash
# Via API
POST /api/courses/sync

# Via seed script
npm run seed
```

## 📊 Database Schema

### Course
- Title, description, image
- Price (USD and DOT)
- Institution, level, subjects
- EdX URL and metadata

### Payment
- Payment ID and status
- User information
- Course list and amounts
- Payment address and transaction details
- Webhook history

### User
- Email and name
- Role (user/admin)
- Password (hashed)
- Purchased courses

## 🚢 Deployment

### Backend Deployment
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to Heroku, Railway, or similar
4. Set up NowPayments webhook URL

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables
4. Update CORS settings in backend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- **EdX** - Course content provider
- **Polkadot** - Blockchain infrastructure
- **NowPayments** - Crypto payment processing
- **MongoDB** - Database solution
- **Next.js** - React framework
- **Tailwind CSS** - Styling framework

## Support

For support, email yeabsiragenet48@gmail.com , samiberhanu12@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

### Completed ✅
- [x] User accounts and authentication
- [x] Course purchase history
- [x] Email notifications
- [x] Google OAuth integration
- [x] Polkadot wallet integration
- [x] My Courses dashboard

### Planned 🚧
- [ ] Multi-currency support (BTC, ETH, etc.)
- [ ] Course recommendations
- [ ] Mobile app (React Native)
- [ ] Course reviews and ratings
- [ ] Referral program
- [ ] Subscription plans
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication

## 📖 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Authentication Setup](./AUTHENTICATION_SETUP.md)** - Complete auth configuration
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Feature overview
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup instructions

## 🎯 Key Features Explained

### User Authentication
Users can sign up and log in using:
- Traditional email/password
- Google OAuth (one-click signup)

After authentication, users can:
- View purchased courses at `/my-courses`
- Track payment history
- Access course materials directly

### Polkadot Wallet Integration
The platform integrates with Polkadot.js browser extension:
- Connect wallet on checkout
- View DOT balance
- Select payment account
- Secure blockchain transactions

### Email Notifications
Automated emails for:
- Welcome message on signup
- Payment pending notification
- Payment confirmation
- Course access details

### Admin Panel
Comprehensive dashboard for:
- Managing courses
- Viewing all payments
- Analytics and statistics
- User management

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- Input validation
- Session security
- Secure cookie handling
- [ ] Live course streaming

## 📸 Screenshots

### Homepage
Beautiful landing page with featured courses and clear value proposition.

### Course Catalog
Browse thousands of courses with advanced filtering and search.

### Payment Flow
Secure DOT payment with QR code and real-time status updates.

### Admin Dashboard
Comprehensive analytics and management tools.

---

**Made with ❤️ by the Mela Cpay Team**

*Learn Smarter, Pay with Crypto* 🎓💎

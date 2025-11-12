# 🎓 Mela Chain - Blockchain Education Platform

> **Learn Smarter, Pay with Crypto**

Mela Chain is a revolutionary blockchain-powered education platform that enables users to purchase EdX courses using Polkadot (DOT) cryptocurrency. Built with modern web technologies and integrated with NowPayments for secure crypto transactions.

![Mela Chain](https://img.shields.io/badge/Mela-Chain-7C3AED?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Polkadot](https://img.shields.io/badge/Polkadot-DOT-E6007A?style=for-the-badge&logo=polkadot)

## ✨ Features

- 🔍 **Browse EdX Courses** - Access thousands of courses from top universities
- 💎 **Pay with DOT** - Secure payments using Polkadot cryptocurrency
- 🛒 **Shopping Cart** - Add multiple courses before checkout
- 📱 **QR Code Payments** - Easy mobile wallet integration
- ⚡ **Real-time Status** - Live payment confirmation tracking
- 👨‍💼 **Admin Dashboard** - Comprehensive management panel
- 📊 **Analytics** - Payment and course statistics
- 🔒 **Secure** - Blockchain-powered security

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **NowPayments API** for crypto payments
- **EdX API** for course data
- **JWT** for authentication
- **Axios** for HTTP requests

### Frontend
- **Next.js 13** with React
- **Tailwind CSS** for styling
- **React Query** for data fetching
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

1. **Start MongoDB** (if running locally)
2. **Start Backend Server**:
   ```bash
   cd backend && npm run dev
   ```
3. **Start Frontend Server**:
   ```bash
   cd frontend && npm run dev
   ```
4. **Access the Application**: Open `http://localhost:3000`
5. **Admin Login**: Use credentials from seed script
   - Email: `admin@melachain.com`
   - Password: `admin123`

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

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mela-chain

# NowPayments
NOWPAYMENTS_API_KEY=your_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret

# JWT
JWT_SECRET=your_jwt_secret

# URLs
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:5000

# EdX API
EDX_API_BASE=https://api.edx.org/catalog/v1

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎨 Design System

### Colors
- **Primary**: `#7C3AED` (Purple)
- **Secondary**: `#059669` (Emerald Green)
- **Accent**: `#F59E0B` (Amber)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

## 📱 Features in Detail

### User Features
- **Course Catalog**: Browse and search thousands of courses
- **Shopping Cart**: Add multiple courses before checkout
- **Crypto Payment**: Pay securely with Polkadot (DOT)
- **QR Codes**: Easy mobile wallet scanning
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

## 📞 Support

For support, email support@melachain.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Multi-currency support (BTC, ETH, etc.)
- [ ] User accounts and course history
- [ ] Course recommendations
- [ ] Mobile app (React Native)
- [ ] Course reviews and ratings
- [ ] Referral program
- [ ] Subscription plans
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

**Made with ❤️ by the Mela Chain Team**

*Learn Smarter, Pay with Crypto* 🎓💎

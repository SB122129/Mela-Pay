# 🚀 Mela Chain - Complete Setup Guide

This guide will walk you through setting up the Mela Chain project from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional)

## 🔧 Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# Start MongoDB from Services or run mongod.exe
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/mela-chain`)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd mela-chain/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Edit `.env` file:
```env
# Required: MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mela-chain
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mela-chain

# Required: JWT Secret (change this!)
JWT_SECRET=your_super_secret_key_change_this_in_production

# Required: URLs
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:5000

# Optional: NowPayments (for production)
NOWPAYMENTS_API_KEY=np_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOWPAYMENTS_IPN_SECRET=ipn_secret_xxxxxxxxxxxxxxxx

# Optional: EdX API
EDX_API_BASE=https://api.edx.org/catalog/v1

# Server Config
PORT=5000
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL=admin@melachain.com
ADMIN_PASSWORD=admin123
```

#### Seed the Database:
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Existing data cleared
✅ Admin user created: admin@melachain.com
✅ Test user created: user@test.com
✅ Synced 20 courses
```

#### Start the Backend:
```bash
npm run dev
```

Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd mela-chain/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Edit `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start the Frontend:
```bash
npm run dev
```

Frontend should now be running on `http://localhost:3000`

## ✅ Verify Installation

### Test Backend
Open your browser and visit:
- `http://localhost:5000` - Should show welcome message
- `http://localhost:5000/health` - Should show health status
- `http://localhost:5000/api/mela/courses` - Should return course list

### Test Frontend
Open your browser and visit:
- `http://localhost:3000` - Should show homepage
- `http://localhost:3000/courses` - Should show course catalog
- `http://localhost:3000/admin` - Should show admin login

## 🔐 Default Credentials

### Admin Account
- **Email**: `admin@melachain.com`
- **Password**: `admin123`

### Test User Account
- **Email**: `user@test.com`
- **Password**: `test123`

## 🧪 Testing the Application

### 1. Browse Courses
1. Go to `http://localhost:3000`
2. Click "Browse Courses"
3. You should see a list of courses

### 2. Add to Cart
1. Click on any course
2. Click "Add to Cart"
3. Go to cart (top right icon)

### 3. Test Payment Flow
1. In cart, click "Proceed to Checkout"
2. Enter your name and email
3. Click "Continue to Payment"
4. You'll see a payment page with QR code
5. **Development Mode**: Click "Simulate Payment" to test
6. Payment should be confirmed and redirect to success page

### 4. Admin Dashboard
1. Go to `http://localhost:3000/admin`
2. Login with admin credentials
3. View dashboard statistics
4. Check payments and courses

## 🔍 Troubleshooting

### Backend Issues

#### "Cannot connect to MongoDB"
- **Local MongoDB**: Make sure MongoDB service is running
- **MongoDB Atlas**: Check your connection string and network access settings

#### "Port 5000 already in use"
- Change the PORT in `.env` file
- Or stop the process using port 5000

#### "Module not found"
- Run `npm install` again in backend directory
- Delete `node_modules` and `package-lock.json`, then reinstall

### Frontend Issues

#### "Cannot connect to API"
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env`
- Check CORS settings in backend

#### "Port 3000 already in use"
- Next.js will automatically use port 3001
- Or stop the process using port 3000

#### "Module not found"
- Run `npm install` again in frontend directory
- Delete `node_modules` and `package-lock.json`, then reinstall

### Common Issues

#### Courses not showing
- Run `npm run seed` in backend to populate database
- Check MongoDB connection
- Check browser console for errors

#### Payment simulation not working
- Make sure you're in development mode
- Check backend logs for errors
- Verify payment was created successfully

## 🌐 Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Then login and create app
heroku login
heroku create mela-chain-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set NOWPAYMENTS_API_KEY=your_key
heroku config:set CLIENT_URL=https://your-frontend-url.com

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [NowPayments API](https://nowpayments.io/api)
- [Polkadot Documentation](https://polkadot.network/documentation/)

## 🎯 Next Steps

1. **Customize Branding**: Update colors, logo, and text
2. **Add Real Payment**: Configure NowPayments API key
3. **Email Integration**: Set up SendGrid or similar service
4. **Analytics**: Add Google Analytics or similar
5. **SEO**: Optimize meta tags and content
6. **Testing**: Add unit and integration tests
7. **Security**: Review and enhance security measures

## 💡 Tips

- Use MongoDB Atlas for easy cloud database
- Enable MongoDB indexes for better performance
- Use environment variables for all sensitive data
- Test payment flow thoroughly before production
- Monitor API rate limits (EdX, NowPayments)
- Set up error logging (Sentry, LogRocket)
- Use CDN for static assets
- Enable HTTPS in production

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs (browser and terminal)
2. Review the error messages carefully
3. Verify all environment variables are set
4. Check MongoDB connection
5. Ensure all services are running
6. Review the README.md for additional info

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@melachain.com
- Check documentation in README.md

---

**Happy Coding! 🚀**

# Mela Chain - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Create `.env` file:
```bash
cd backend
cp .env.template .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mela-chain
PORT=5000
CLIENT_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx
```

**Frontend** - Create `.env.local`:
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### Step 3: Start MongoDB

```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or start your local MongoDB service
sudo systemctl start mongod
```

### Step 4: Create Admin Account

```bash
cd backend
npm run create-admin
```

**Admin Credentials:**
- Email: `melapay12@gmail.com`
- Password: `1122127`

### Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

## ✅ Test the Features

### 1. User Signup
- Go to http://localhost:3000/signup
- Create account with email or Google
- Check email for welcome message

### 2. Browse & Purchase Courses
- Visit http://localhost:3000/courses
- Add courses to cart
- Go to checkout
- Connect Polkadot wallet (install extension first)
- Complete payment

### 3. View Purchased Courses
- Go to http://localhost:3000/my-courses
- See all your courses
- Access course links

### 4. Admin Panel
- Go to http://localhost:3000/admin
- Login with admin credentials
- View payments and analytics

## 📦 Install Polkadot Extension

1. Visit https://polkadot.js.org/extension/
2. Install for your browser
3. Create or import wallet
4. Use on checkout page

## 🔑 Important Credentials

**Admin Account:**
- Email: melapay12@gmail.com
- Password: 1122127

**Email Service:**
- Gmail App Password: `qmuo gejh vwfp yrvx`
- (Configure in backend/.env as EMAIL_PASSWORD)

## 🐛 Common Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Polkadot Extension Not Detected:**
- Refresh page after installing extension
- Check extension is unlocked
- Grant permission for localhost

## 📚 Next Steps

1. Configure Google OAuth (see AUTHENTICATION_SETUP.md)
2. Set up email service with Gmail
3. Customize courses and pricing
4. Deploy to production

## 📖 Full Documentation

- [Authentication Setup](./AUTHENTICATION_SETUP.md)
- [Setup Guide](./SETUP_GUIDE.md)

## 🆘 Need Help?

Check the console logs:
- Browser DevTools (F12)
- Backend terminal
- Frontend terminal

Look for error messages and verify:
- MongoDB is running
- Environment variables are set
- Ports are not in use
- Extensions are installed

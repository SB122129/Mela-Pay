# MongoDB Setup Guide

## ✅ Current Status

- ✅ Node.js installed (v18.20.8)
- ✅ npm installed (v10.8.2)
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ .env file configured with email password
- ❌ MongoDB not installed

## 🔧 MongoDB Installation Options

### Option 1: Install MongoDB (Recommended)

```bash
# Download MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

### Option 2: Use Docker (If Docker is installed)

```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Verify it's running
docker ps
```

### Option 3: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mela-chain
   ```

## 🚀 After MongoDB is Running

### 1. Create Admin Account

```bash
cd /home/kali/Mela_Polkadot_Project/mela-chain/backend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run create-admin
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Admin user created successfully
📧 Email: melapay12@gmail.com
👤 Name: Mela Admin
🔑 Role: admin

🎉 Admin account ready!
Email: melapay12@gmail.com
Password: 1122127
```

### 2. Configure Frontend

```bash
cd /home/kali/Mela_Polkadot_Project/mela-chain/frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### 3. Start Backend Server (Terminal 1)

```bash
cd /home/kali/Mela_Polkadot_Project/mela-chain/backend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run dev
```

**Expected Output:**
```
🚀 Mela Chain Backend running on port 5000
🌍 Environment: development
✅ MongoDB connected successfully
✅ Email service configured
```

### 4. Start Frontend Server (Terminal 2)

```bash
cd /home/kali/Mela_Polkadot_Project/mela-chain/frontend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run dev
```

**Expected Output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 🎯 Access the Application

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin
- **Signup:** http://localhost:3000/signup
- **Login:** http://localhost:3000/login
- **My Courses:** http://localhost:3000/my-courses

## 🔑 Login Credentials

**Admin Account:**
- Email: melapay12@gmail.com
- Password: 1122127

## 📝 Current Configuration

Your `.env` file is already configured with:
- ✅ Email: melapay12@gmail.com
- ✅ Email Password: qmuo gejh vwfp yrvx
- ✅ MongoDB URI: mongodb://localhost:27017/mela-chain
- ✅ JWT Secret: mela_chain_super_secret_2024
- ✅ Session Secret: mela_chain_session_secret_2024

## 🐛 Troubleshooting

### MongoDB Connection Error
If you see `ECONNREFUSED ::1:27017`:
- MongoDB is not running
- Start MongoDB: `sudo systemctl start mongod`
- Or use Docker: `docker start mongodb`

### Port Already in Use
If port 5000 or 3000 is in use:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### NVM Not Found in New Terminal
Run this in each new terminal:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Or restart your terminal for it to load automatically.

## ✅ Quick Command Reference

```bash
# Load NVM (run in each new terminal)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Create admin account
cd /home/kali/Mela_Polkadot_Project/mela-chain/backend
npm run create-admin

# Start backend
npm run dev

# Start frontend (new terminal)
cd /home/kali/Mela_Polkadot_Project/mela-chain/frontend
npm run dev
```

## 📖 Documentation

- **Quick Start:** QUICK_START.md
- **Full Setup:** AUTHENTICATION_SETUP.md
- **Features:** FEATURES_COMPLETED.md
- **Checklist:** SETUP_CHECKLIST.md

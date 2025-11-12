# ⚡ Mela Chain - Quick Reference

## 🚀 Quick Start Commands

```bash
# Install all dependencies
npm run install-all

# Seed database
npm run seed

# Run both backend and frontend
npm run dev

# Or run separately
npm run backend   # Backend only
npm run frontend  # Frontend only
```

## 🔑 Default Credentials

```
Admin:
Email: admin@melachain.com
Password: admin123

Test User:
Email: user@test.com
Password: test123
```

## 🌐 URLs

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
API Docs: http://localhost:5000/api/mela
```

## 📡 Key API Endpoints

### Courses
```bash
GET    /api/mela/courses              # List courses
GET    /api/mela/courses/:id          # Course details
GET    /api/mela/courses/featured     # Featured courses
GET    /api/mela/courses/search?q=    # Search
```

### Payments
```bash
POST   /api/mela/payments/create      # Create payment
GET    /api/mela/payments/:id         # Payment status
POST   /api/mela/payments/:id/simulate # Simulate (dev)
POST   /api/mela/payments/webhook     # Webhook
```

### Admin
```bash
POST   /api/mela/admin/login          # Login
GET    /api/mela/admin/dashboard      # Dashboard
GET    /api/mela/admin/payments       # Payments list
GET    /api/mela/admin/analytics      # Analytics
```

## 🗂️ File Locations

### Backend
```
Models:       backend/models/
Controllers:  backend/controllers/
Routes:       backend/routes/
Services:     backend/services/
Middleware:   backend/middleware/
Config:       backend/.env
```

### Frontend
```
Pages:        frontend/pages/
Components:   frontend/components/
Contexts:     frontend/context/
Utils:        frontend/lib/
Styles:       frontend/styles/
Config:       frontend/.env
```

## 🎨 Brand Colors

```css
Primary:   #7C3AED (Purple)
Secondary: #059669 (Emerald)
Accent:    #F59E0B (Amber)
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/mela-chain
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:5000
NOWPAYMENTS_API_KEY=your_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Common Issues & Fixes

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
```bash
# Check CLIENT_URL in backend .env
# Should match frontend URL
```

## 📦 NPM Scripts

### Root
```bash
npm run install-all  # Install all deps
npm run dev          # Run both servers
npm run backend      # Backend only
npm run frontend     # Frontend only
npm run seed         # Seed database
```

### Backend
```bash
npm start            # Production
npm run dev          # Development
npm run seed         # Seed database
```

### Frontend
```bash
npm run dev          # Development
npm run build        # Build for production
npm start            # Production
```

## 🧪 Testing Payment Flow

1. Browse courses at `/courses`
2. Add course to cart
3. Go to `/cart`
4. Click "Proceed to Checkout"
5. Enter email and name
6. Click "Continue to Payment"
7. Click "Simulate Payment" (dev mode)
8. Redirected to success page

## 📊 Database Collections

```
courses   - Course catalog
payments  - Payment transactions
users     - User accounts
```

## 🔍 Useful MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# Use database
use mela-chain

# View collections
show collections

# Count documents
db.courses.countDocuments()
db.payments.countDocuments()
db.users.countDocuments()

# Find all courses
db.courses.find().pretty()

# Find admin user
db.users.findOne({ role: 'admin' })

# Clear payments
db.payments.deleteMany({})
```

## 🎯 Key Features Checklist

- [x] Course browsing and search
- [x] Shopping cart
- [x] Crypto payment (DOT)
- [x] QR code generation
- [x] Payment tracking
- [x] Admin dashboard
- [x] Payment management
- [x] Course management
- [x] Responsive design
- [x] Email notifications (mock)

## 🔐 Security Notes

- Never commit `.env` files
- Change default admin password
- Use strong JWT secret
- Enable HTTPS in production
- Validate all user inputs
- Use environment variables

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Medium devices */
lg:  1024px  /* Large devices */
xl:  1280px  /* Extra large */
2xl: 1536px  /* 2X large */
```

## 🎨 Tailwind Utility Classes

```css
/* Buttons */
.btn-primary
.btn-secondary
.btn-outline

/* Cards */
.card
.card-hover

/* Inputs */
.input-field

/* Badges */
.badge

/* Containers */
.container-custom
```

## 🔄 Payment Status Flow

```
pending → waiting → confirming → confirmed → finished
                                          ↓
                                      failed/expired
```

## 📈 Performance Tips

1. Use MongoDB indexes
2. Enable Next.js image optimization
3. Implement caching with React Query
4. Use lazy loading for components
5. Optimize bundle size
6. Enable compression
7. Use CDN for assets

## 🚨 Error Codes

```
400 - Bad Request (validation error)
401 - Unauthorized (auth required)
403 - Forbidden (insufficient permissions)
404 - Not Found
500 - Internal Server Error
```

## 📞 Quick Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [NowPayments](https://nowpayments.io/)
- [EdX API](https://api.edx.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Polkadot](https://polkadot.network/)

## 💡 Pro Tips

1. Use `npm run dev` to run both servers
2. Check browser console for errors
3. Use MongoDB Compass for database GUI
4. Test on mobile devices
5. Use React DevTools
6. Monitor API responses
7. Keep dependencies updated

---

**Need more help? Check README.md or SETUP_GUIDE.md**

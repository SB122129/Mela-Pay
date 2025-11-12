# 📂 Mela Chain - Complete File Structure

```
mela-chain/
│
├── 📄 README.md                      # Main project documentation
├── 📄 SETUP_GUIDE.md                 # Detailed setup instructions
├── 📄 PROJECT_SUMMARY.md             # Project overview and architecture
├── 📄 QUICK_REFERENCE.md             # Quick reference for developers
├── 📄 CHANGELOG.md                   # Version history
├── 📄 LICENSE                        # MIT License
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Root package file with scripts
│
├── 🗂️ backend/                       # Node.js/Express Backend
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 server.js                  # Express server entry point
│   ├── 📄 .env.example               # Environment variables template
│   ├── 📄 .env                       # Environment variables (create this)
│   ├── 📄 .gitignore                 # Backend-specific ignores
│   │
│   ├── 🗂️ models/                    # MongoDB Schemas
│   │   ├── 📄 Course.js              # Course model with validation
│   │   ├── 📄 Payment.js             # Payment model with methods
│   │   └── 📄 User.js                # User model with auth
│   │
│   ├── 🗂️ controllers/               # Request Handlers
│   │   ├── 📄 courseController.js    # Course CRUD operations
│   │   ├── 📄 paymentController.js   # Payment processing
│   │   └── 📄 adminController.js     # Admin operations
│   │
│   ├── 🗂️ routes/                    # API Routes
│   │   ├── 📄 courses.js             # Course endpoints
│   │   ├── 📄 payments.js            # Payment endpoints
│   │   ├── 📄 admin.js               # Admin endpoints
│   │   └── 📄 mela.js                # Unified API routes
│   │
│   ├── 🗂️ services/                  # Business Logic
│   │   ├── 📄 edxService.js          # EdX API integration
│   │   ├── 📄 paymentService.js      # Payment processing logic
│   │   └── 📄 emailService.js        # Email notifications
│   │
│   ├── 🗂️ middleware/                # Express Middleware
│   │   ├── 📄 auth.js                # JWT authentication
│   │   └── 📄 errorHandler.js        # Error handling
│   │
│   └── 🗂️ scripts/                   # Utility Scripts
│       └── 📄 seed.js                # Database seeding
│
├── 🗂️ frontend/                      # Next.js Frontend
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 next.config.js             # Next.js configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS config
│   ├── 📄 postcss.config.js          # PostCSS config
│   ├── 📄 .env.example               # Environment variables template
│   ├── 📄 .env                       # Environment variables (create this)
│   ├── 📄 .gitignore                 # Frontend-specific ignores
│   │
│   ├── 🗂️ pages/                     # Next.js Pages (Routes)
│   │   ├── 📄 _app.js                # App wrapper with providers
│   │   ├── 📄 _document.js           # HTML document structure
│   │   ├── 📄 index.js               # Homepage (/)
│   │   ├── 📄 courses.js             # Course catalog (/courses)
│   │   ├── 📄 cart.js                # Shopping cart (/cart)
│   │   ├── 📄 checkout.js            # Checkout page (/checkout)
│   │   │
│   │   ├── 🗂️ course/                # Course Pages
│   │   │   └── 📄 [id].js            # Course details (/course/:id)
│   │   │
│   │   ├── 🗂️ payment/               # Payment Pages
│   │   │   ├── 📄 [id].js            # Payment page (/payment/:id)
│   │   │   └── 📄 success.js         # Success page (/payment/success)
│   │   │
│   │   ├── 🗂️ admin/                 # Admin Pages
│   │   │   ├── 📄 index.js           # Admin dashboard (/admin)
│   │   │   ├── 📄 payments.js        # Payments list (/admin/payments)
│   │   │   └── 📄 courses.js         # Courses list (/admin/courses)
│   │   │
│   │   └── 🗂️ api/                   # API Routes (Next.js)
│   │       └── 📄 hello.js           # Sample API endpoint
│   │
│   ├── 🗂️ components/                # React Components
│   │   │
│   │   ├── 🗂️ mela/                  # Custom Components
│   │   │   ├── 📄 Header.js          # Navigation header
│   │   │   ├── 📄 CourseCard.js      # Course card component
│   │   │   ├── 📄 PaymentFlow.js     # Payment flow component
│   │   │   └── 📄 AdminPanel.js      # Admin dashboard panel
│   │   │
│   │   ├── 🗂️ layout/                # Layout Components
│   │   │   ├── 📄 Layout.js          # Main layout wrapper
│   │   │   └── 📄 Footer.js          # Footer component
│   │   │
│   │   └── 🗂️ ui/                    # UI Components
│   │       ├── 📄 Button.js          # Button component
│   │       ├── 📄 Card.js            # Card component
│   │       └── 📄 Modal.js           # Modal component
│   │
│   ├── 🗂️ context/                   # React Context
│   │   ├── 📄 CartContext.js         # Shopping cart state
│   │   └── 📄 AuthContext.js         # Authentication state
│   │
│   ├── 🗂️ lib/                       # Utilities
│   │   ├── 📄 api.js                 # API client with axios
│   │   └── 📄 utils.js               # Helper functions
│   │
│   └── 🗂️ styles/                    # CSS Files
│       ├── 📄 globals.css            # Global styles
│       └── 📄 mela-theme.css         # Mela Chain theme
│
└── 🗂️ node_modules/                  # Dependencies (auto-generated)
```

## 📊 File Count Summary

### Backend (27 files)
- **Models**: 3 files
- **Controllers**: 3 files
- **Routes**: 4 files
- **Services**: 3 files
- **Middleware**: 2 files
- **Scripts**: 1 file
- **Config**: 4 files
- **Entry**: 1 file

### Frontend (35 files)
- **Pages**: 11 files
- **Components**: 10 files
- **Context**: 2 files
- **Utilities**: 2 files
- **Styles**: 2 files
- **Config**: 4 files

### Documentation (7 files)
- README.md
- SETUP_GUIDE.md
- PROJECT_SUMMARY.md
- QUICK_REFERENCE.md
- FILE_STRUCTURE.md
- CHANGELOG.md
- LICENSE

### Total: ~70 files (excluding node_modules)

## 🎯 Key Files to Know

### Must Configure
1. `backend/.env` - Backend environment variables
2. `frontend/.env` - Frontend environment variables

### Entry Points
1. `backend/server.js` - Backend server
2. `frontend/pages/_app.js` - Frontend app wrapper
3. `frontend/pages/index.js` - Homepage

### Core Logic
1. `backend/services/paymentService.js` - Payment processing
2. `backend/services/edxService.js` - Course data
3. `frontend/components/mela/PaymentFlow.js` - Payment UI
4. `frontend/context/CartContext.js` - Cart management

### Configuration
1. `backend/package.json` - Backend dependencies
2. `frontend/package.json` - Frontend dependencies
3. `frontend/tailwind.config.js` - Styling config
4. `frontend/next.config.js` - Next.js config

## 📝 File Naming Conventions

### Backend
- **Models**: PascalCase (e.g., `Course.js`)
- **Controllers**: camelCase + Controller (e.g., `courseController.js`)
- **Routes**: lowercase (e.g., `courses.js`)
- **Services**: camelCase + Service (e.g., `edxService.js`)

### Frontend
- **Components**: PascalCase (e.g., `Header.js`)
- **Pages**: lowercase (e.g., `courses.js`)
- **Context**: PascalCase + Context (e.g., `CartContext.js`)
- **Utilities**: lowercase (e.g., `utils.js`)

## 🔍 Where to Find Things

### Need to add a new course field?
→ `backend/models/Course.js`

### Need to modify payment logic?
→ `backend/services/paymentService.js`

### Need to change the homepage?
→ `frontend/pages/index.js`

### Need to update cart functionality?
→ `frontend/context/CartContext.js`

### Need to add a new API endpoint?
→ `backend/routes/` and `backend/controllers/`

### Need to create a new page?
→ `frontend/pages/`

### Need to add a reusable component?
→ `frontend/components/ui/`

### Need to change colors/styling?
→ `frontend/styles/mela-theme.css` or `frontend/tailwind.config.js`

## 🚀 Quick Navigation

```bash
# Backend
cd backend                    # Go to backend
cd backend/models             # Models
cd backend/controllers        # Controllers
cd backend/services           # Services

# Frontend
cd frontend                   # Go to frontend
cd frontend/pages             # Pages
cd frontend/components        # Components
cd frontend/styles            # Styles

# Documentation
cat README.md                 # Main docs
cat SETUP_GUIDE.md           # Setup guide
cat QUICK_REFERENCE.md       # Quick ref
```

---

**This structure follows industry best practices for full-stack applications.**

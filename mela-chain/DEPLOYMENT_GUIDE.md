# 🚀 Mela Chain Vercel Deployment Guide

## Prerequisites

1. **GitHub Account** - To host your code
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Backend Deployed** - Your backend API must be deployed first (e.g., Railway, Render, Heroku)

---

## 📋 Step-by-Step Deployment

### **Step 1: Prepare Your Backend**

Before deploying the frontend, ensure your backend is deployed and accessible. You'll need:
- Backend API URL (e.g., `https://your-backend.railway.app`)

**Popular Backend Hosting Options:**
- Railway (Recommended)
- Render
- Heroku
- DigitalOcean

---

### **Step 2: Push Code to GitHub**

1. **Initialize Git** (if not already done):
   ```bash
   cd c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain
   git init
   git add .
   git commit -m "Initial commit - Mela Chain project"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New Repository"
   - Name it: `mela-chain`
   - Don't initialize with README (you already have code)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mela-chain.git
   git branch -M main
   git push -u origin main
   ```

---

### **Step 3: Deploy Frontend to Vercel**

#### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Log In"
   - Sign in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your `mela-chain` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` |

   **Important**: Replace `https://your-backend-url.com` with your actual backend URL

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

---

#### **Option B: Deploy via Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N`
   - Project name? `mela-chain`
   - Directory? `./`
   - Override settings? `N`

5. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   Enter your backend URL when prompted

6. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration Files Created

### **vercel.json**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🌍 Environment Variables

### **Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://mela-backend.railway.app` |

### **How to Add in Vercel:**

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable
4. Redeploy if needed

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment

---

## 🐛 Troubleshooting

### **Build Fails**

**Error: "Module not found"**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "API calls failing"**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is running and accessible
- Check CORS settings on backend

### **Environment Variables Not Working**

1. Ensure variable names start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding variables
3. Clear build cache: Settings → General → Clear Build Cache

### **Dark Mode Not Working**

- Ensure all Tailwind classes are properly configured
- Check `tailwind.config.js` has `darkMode: 'class'`
- Verify `globals.css` is imported in `_app.js`

---

## 📊 Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Backend URL configured
- [ ] Can browse courses
- [ ] Can add courses to cart
- [ ] Can login/signup
- [ ] Google OAuth works (update redirect URLs)
- [ ] Polkadot wallet connects
- [ ] Payment flow works
- [ ] Dark mode toggles correctly
- [ ] Search functionality works
- [ ] Custom domain configured (optional)

---

## 🔐 Update OAuth Redirect URLs

After deployment, update your Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   ```
   https://your-project.vercel.app/auth/callback
   ```

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

## 📈 Monitoring & Analytics

Vercel provides built-in analytics:

1. Go to project dashboard
2. Click "Analytics" tab
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

---

## 🔄 Redeployment

### **Automatic:**
- Push to GitHub → Auto-deploys

### **Manual:**
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click "..." → "Redeploy"

### **Via CLI:**
```bash
cd frontend
vercel --prod
```

---

## 📝 Important Notes

1. **Backend First**: Always deploy backend before frontend
2. **Environment Variables**: Must start with `NEXT_PUBLIC_` for client access
3. **CORS**: Ensure backend allows requests from Vercel domain
4. **API Keys**: Never commit API keys to GitHub
5. **Build Time**: First build takes 2-3 minutes
6. **Free Tier**: Vercel free tier is generous for hobby projects

---

## 🎉 Success!

Your Mela Chain application should now be live at:
- **Vercel URL**: `https://your-project.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

---

## 📞 Support

If you encounter issues:

1. Check Vercel build logs
2. Verify environment variables
3. Test backend API directly
4. Check browser console for errors
5. Review Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

## 🚀 Next Steps

1. **Set up monitoring** - Use Vercel Analytics
2. **Configure custom domain** - Add your own domain
3. **Set up CI/CD** - Automatic testing before deployment
4. **Add error tracking** - Sentry or similar
5. **Optimize performance** - Image optimization, caching
6. **SEO optimization** - Meta tags, sitemap

---

**Happy Deploying! 🎉**

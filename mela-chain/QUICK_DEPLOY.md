# ⚡ Quick Deploy to Vercel

## 🚀 Fastest Way to Deploy (5 Minutes)

### **Step 1: Deploy Backend First** ⚠️

Your backend MUST be deployed before the frontend. Use Railway (recommended):

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend repository
5. Add environment variables (MongoDB, JWT_SECRET, etc.)
6. Copy your backend URL (e.g., `https://mela-backend.up.railway.app`)

---

### **Step 2: Deploy Frontend to Vercel**

#### **Option A: One-Click Deploy (Easiest)**

1. **Push to GitHub**:
   ```bash
   cd c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain
   git init
   git add .
   git commit -m "Deploy Mela Chain"
   git remote add origin https://github.com/YOUR_USERNAME/mela-chain.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - **Root Directory**: Set to `frontend`
   - **Environment Variables**: Add `NEXT_PUBLIC_API_URL` = Your backend URL
   - Click "Deploy"

3. **Done!** 🎉
   - Your site will be live in 2-3 minutes
   - URL: `https://your-project.vercel.app`

---

#### **Option B: CLI Deploy (For Developers)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production

# Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Can browse courses
- [ ] Search works
- [ ] Dark mode toggles
- [ ] Can add to cart
- [ ] Login/signup works
- [ ] Backend API responds

---

## 🔧 Required Environment Variable

**IMPORTANT**: Add this in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Without this, your frontend won't connect to the backend!

---

## 🐛 Common Issues

### **"API calls failing"**
- ✅ Check `NEXT_PUBLIC_API_URL` is set
- ✅ Verify backend is running
- ✅ Check backend CORS settings

### **"Build failed"**
- ✅ Ensure you selected `frontend` as root directory
- ✅ Check all dependencies are in package.json

### **"Environment variable not working"**
- ✅ Must start with `NEXT_PUBLIC_`
- ✅ Redeploy after adding variables

---

## 📞 Need Help?

Check the full guide: `DEPLOYMENT_GUIDE.md`

---

**That's it! Your app should be live! 🚀**

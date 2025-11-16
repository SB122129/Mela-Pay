# 🔧 CORS Error - Quick Fix

## ❌ The Error

```
Access to XMLHttpRequest at 'https://melapolkadotproject-production.up.railway.app/api/mela/courses/featured' 
from origin 'https://mela-polkadot-project-gzok.vercel.app' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 
'http://localhost:3000' that is not equal to the supplied origin.
```

## 🎯 The Problem

Your Railway backend `CLIENT_URL` is still set to `http://localhost:3000`, but your Vercel frontend is at `https://mela-polkadot-project-gzok.vercel.app`.

---

## ✅ Quick Fix (2 Minutes)

### **Step 1: Update CLIENT_URL in Railway**

1. **Go to Railway Dashboard**:
   - Visit [railway.app](https://railway.app)
   - Click your backend service

2. **Update CLIENT_URL**:
   - Click "Variables" tab
   - Find `CLIENT_URL`
   - Change from: `http://localhost:3000`
   - Change to: `https://mela-polkadot-project-gzok.vercel.app`
   - **No trailing slash!**
   - Click outside to save

3. **Railway will auto-redeploy** (wait 2 minutes)

---

### **Step 2: Using Railway CLI (Faster)**

```bash
# Update CLIENT_URL
railway variables set CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app

# Verify
railway variables | grep CLIENT_URL
```

---

## 🔍 Verify the Fix

After Railway redeploys (2 minutes):

1. **Open your Vercel site**:
   ```
   https://mela-polkadot-project-gzok.vercel.app
   ```

2. **Check browser console** (F12):
   - Should see no CORS errors
   - Courses should load

3. **Test API directly**:
   ```bash
   curl https://melapolkadotproject-production.up.railway.app/api/health
   ```

---

## ✅ Correct Configuration

### **Railway Variables:**
```bash
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

### **Vercel Variables:**
```bash
NEXT_PUBLIC_API_URL=https://melapolkadotproject-production.up.railway.app
```

**Important:**
- ✅ No trailing slashes
- ✅ Use `https://` not `http://`
- ✅ URLs must match exactly

---

## 🎯 Timeline

- **Now**: Update `CLIENT_URL` in Railway
- **1-2 min**: Railway detects change and starts redeployment
- **2-3 min**: Railway finishes redeployment
- **3 min**: Test your Vercel site - CORS error should be gone!

---

## 🐛 If Still Not Working

### **Check 1: Verify Railway Variable**

```bash
railway variables | grep CLIENT_URL
```

Should show:
```
CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

### **Check 2: Check Railway Logs**

1. Go to Railway dashboard
2. Click "Deployments"
3. Click latest deployment
4. Check logs for:
   ```
   Server running on port 5000
   CORS origin: https://mela-polkadot-project-gzok.vercel.app
   ```

### **Check 3: Clear Browser Cache**

1. Press Ctrl+Shift+Delete
2. Clear cache
3. Refresh Vercel site

---

## 📊 Expected Behavior After Fix

1. **Open Vercel site**: `https://mela-polkadot-project-gzok.vercel.app`
2. **Courses load** on homepage
3. **No CORS errors** in console
4. **Network tab** shows 200 OK responses
5. **Featured courses** display correctly

---

## 🚀 Quick Command (Copy-Paste)

```bash
# If you have Railway CLI installed
railway variables set CLIENT_URL=https://mela-polkadot-project-gzok.vercel.app
```

**Or update manually in Railway dashboard.**

---

## ✅ Success Checklist

- [ ] `CLIENT_URL` updated in Railway
- [ ] Value: `https://mela-polkadot-project-gzok.vercel.app`
- [ ] No trailing slash
- [ ] Railway redeployed (wait 2 min)
- [ ] Vercel site tested
- [ ] No CORS errors
- [ ] Courses display

---

**Just update CLIENT_URL in Railway and wait 2 minutes!** 🎯

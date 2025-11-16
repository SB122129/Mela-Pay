# 🔧 Vercel Frontend Connection Setup - Mela Chain

## Your Current Setup ✅

Your API configuration is already correct! Here's what you have:

**File: `frontend/lib/api.js`**
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

This is perfect! Now we just need to configure the environment variables.

---

## 🚀 Step-by-Step Fix

### **Step 1: Add Environment Variable in Vercel**

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Click your project

2. **Add Environment Variable**:
   - Go to "Settings" → "Environment Variables"
   - Click "Add New"
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://melapolkadotproject-production.up.railway.app`
   - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"

---

### **Step 2: Update Railway CLIENT_URL**

1. **Go to Railway Dashboard**:
   - Visit [railway.app](https://railway.app)
   - Click your backend service
   - Go to "Variables" tab

2. **Update CLIENT_URL**:
   - Find `CLIENT_URL`
   - Update to your Vercel URL (e.g., `https://your-app.vercel.app`)
   - **No trailing slash!**
   - Railway will auto-redeploy

---

### **Step 3: Redeploy Frontend**

1. **Go to Vercel**:
   - Click "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Wait 2-3 minutes** for deployment

---

### **Step 4: Test Connection (Using Debug Component)**

I've created a debug component for you!

**Add to your home page temporarily:**

```javascript
// frontend/pages/index.js
import DebugConnection from '../components/mela/DebugConnection';

export default function Home() {
  // ... your existing code
  
  return (
    <Layout>
      {/* Your existing content */}
      
      {/* Temporary debug component - remove after testing */}
      {process.env.NODE_ENV !== 'production' && <DebugConnection />}
    </Layout>
  );
}
```

---

## 📋 Environment Variables Checklist

### **Vercel (Frontend)**

```bash
NEXT_PUBLIC_API_URL=https://melapolkadotproject-production.up.railway.app
```

**Important:**
- ✅ Must start with `NEXT_PUBLIC_`
- ✅ No trailing slash
- ✅ Use `https://` not `http://`

---

### **Railway (Backend)**

```bash
CLIENT_URL=https://your-app.vercel.app
```

**Important:**
- ✅ Must match your Vercel URL exactly
- ✅ No trailing slash
- ✅ Use `https://` not `http://`

---

## 🔍 Testing Your Connection

### **Method 1: Using Debug Component**

1. Add `<DebugConnection />` to your page
2. Click "Test API Connection"
3. Check results:
   - ✅ Green = Working
   - ❌ Red = Not working (see error details)

---

### **Method 2: Browser Console**

Open your Vercel site and run in console (F12):

```javascript
// Test 1: Check environment variable
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 2: Test health endpoint
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Error:', e));

// Test 3: Test courses endpoint
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/mela/courses')
  .then(r => r.json())
  .then(d => console.log('Courses:', d))
  .catch(e => console.error('Error:', e));
```

---

### **Method 3: Direct URL Test**

Open these URLs in your browser:

1. **Health Check**:
   ```
   https://melapolkadotproject-production.up.railway.app/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

2. **Courses API**:
   ```
   https://melapolkadotproject-production.up.railway.app/api/mela/courses
   ```
   Should return: JSON with courses array

---

## 🐛 Troubleshooting

### **Issue 1: CORS Error**

**Error in Console:**
```
Access to fetch at 'https://melapolkadotproject-production.up.railway.app' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Update `CLIENT_URL` in Railway to match your Vercel URL exactly
2. Wait for Railway to redeploy (2 minutes)
3. Test again

---

### **Issue 2: Environment Variable Not Found**

**Error in Console:**
```
API URL: undefined
```

**Solution:**
1. Check variable name is exactly `NEXT_PUBLIC_API_URL`
2. Redeploy Vercel after adding variable
3. Clear browser cache

---

### **Issue 3: 404 Not Found**

**Error:**
```
GET https://melapolkadotproject-production.up.railway.app/api/mela/courses 404
```

**Solution:**
1. Check Railway logs for errors
2. Verify backend is running
3. Test backend URL directly in browser

---

### **Issue 4: Network Error**

**Error:**
```
Failed to fetch
NetworkError when attempting to fetch resource
```

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Test backend URL in browser
3. Check Railway deployment status

---

## ✅ Your API Setup (Already Correct!)

Your `frontend/lib/api.js` is already properly configured:

```javascript
// ✅ Correct - Uses environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**All your API calls are already using this:**
- ✅ `coursesAPI.getAll()` - Uses correct base URL
- ✅ `coursesAPI.getById()` - Uses correct base URL
- ✅ `authAPI.login()` - Uses correct base URL
- ✅ `paymentsAPI.create()` - Uses correct base URL

**No code changes needed!** Just set the environment variable.

---

## 📊 Complete Setup Checklist

- [ ] `NEXT_PUBLIC_API_URL` added in Vercel
- [ ] Value: `https://melapolkadotproject-production.up.railway.app`
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] `CLIENT_URL` updated in Railway
- [ ] Value matches Vercel URL exactly
- [ ] Frontend redeployed on Vercel
- [ ] Backend redeployed on Railway (automatic)
- [ ] Tested health endpoint
- [ ] Tested courses endpoint
- [ ] No CORS errors in console
- [ ] Courses display on frontend

---

## 🎯 Quick Test Commands

### **Test Backend (Railway)**

```bash
# Health check
curl https://melapolkadotproject-production.up.railway.app/api/health

# Courses
curl https://melapolkadotproject-production.up.railway.app/api/mela/courses
```

### **Test Frontend (Vercel)**

Open browser console on your Vercel site:

```javascript
// Check environment
console.log(process.env.NEXT_PUBLIC_API_URL);

// Test connection
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 🔄 After Making Changes

1. **Changed Vercel environment variable?**
   - Redeploy frontend

2. **Changed Railway CLIENT_URL?**
   - Railway auto-redeploys (wait 2 min)

3. **Still not working?**
   - Check browser console for errors
   - Use debug component
   - Verify both URLs are correct

---

## 📝 Your URLs

**Backend (Railway):**
```
https://melapolkadotproject-production.up.railway.app
```

**Frontend (Vercel):**
```
https://your-app.vercel.app
(Replace with your actual Vercel URL)
```

---

## 🎉 Success Indicators

Your connection is working when:

- ✅ No CORS errors in console
- ✅ Courses load on homepage
- ✅ Courses page displays courses
- ✅ Search works
- ✅ Cart works
- ✅ Login/signup works
- ✅ Debug component shows green checkmarks

---

## 🚀 Next Steps

After connection is working:

1. **Remove debug component** from production
2. **Test all features**:
   - Browse courses
   - Search
   - Add to cart
   - Checkout
   - Login/signup
   - Payment flow

3. **Monitor for errors**:
   - Check Vercel logs
   - Check Railway logs
   - Check browser console

---

## 📞 Still Having Issues?

**Provide these details:**

1. **Vercel URL**: Your actual Vercel deployment URL
2. **Railway URL**: `https://melapolkadotproject-production.up.railway.app`
3. **Browser console errors**: Screenshot or copy errors
4. **Debug component results**: Screenshot
5. **Network tab**: Screenshot of failed requests

---

**The fix is simple: Just add the environment variable in Vercel and update CLIENT_URL in Railway!** 🎯

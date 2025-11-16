# 🔧 Frontend-Backend Connection Fix

## ❌ Problem: Frontend Not Connecting to Backend

Your backend is deployed on Railway, but Vercel frontend can't fetch courses.

---

## ✅ Solution Checklist

### **Step 1: Update CLIENT_URL in Railway**

This is the **most common issue**!

1. **Go to Railway Dashboard**
2. Click your backend service
3. Click "Variables" tab
4. Find `CLIENT_URL`
5. **Update to your Vercel URL**:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
   ⚠️ **No trailing slash!**

6. Railway will auto-redeploy

---

### **Step 2: Verify NEXT_PUBLIC_API_URL in Vercel**

1. **Go to Vercel Dashboard**
2. Click your project
3. Go to "Settings" → "Environment Variables"
4. Check `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   ⚠️ **No trailing slash!**

5. If you changed it, **redeploy frontend**:
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### **Step 3: Test Backend Directly**

Open your browser or use curl:

```bash
# Test health endpoint
curl https://your-backend.railway.app/api/health

# Should return:
{"success":true,"message":"Server is running"}

# Test courses endpoint
curl https://your-backend.railway.app/api/mela/courses

# Should return JSON with courses
```

If these don't work, your backend has issues.

---

### **Step 4: Check CORS Settings**

Your backend CORS is configured to only allow `CLIENT_URL`. 

**Verify in Railway:**
- `CLIENT_URL` must **exactly match** your Vercel URL
- No `http://` if Vercel uses `https://`
- No trailing slash

**Example:**
```
✅ Correct: https://mela-chain.vercel.app
❌ Wrong: https://mela-chain.vercel.app/
❌ Wrong: http://mela-chain.vercel.app
❌ Wrong: mela-chain.vercel.app
```

---

### **Step 5: Check Browser Console**

1. Open your Vercel site
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Look for errors:

**Common Errors:**

#### **Error 1: CORS Error**
```
Access to fetch at 'https://backend.railway.app' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
- Update `CLIENT_URL` in Railway to match your Vercel URL
- Redeploy backend

---

#### **Error 2: Network Error**
```
Failed to fetch
NetworkError when attempting to fetch resource
```

**Solution:**
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Test backend URL directly

---

#### **Error 3: 404 Not Found**
```
GET https://backend.railway.app/api/mela/courses 404
```

**Solution:**
- Check API routes are correct
- Verify backend deployed successfully
- Check Railway logs

---

### **Step 6: Check Railway Logs**

1. Go to Railway dashboard
2. Click your service
3. Go to "Deployments" tab
4. Click latest deployment
5. Click "View Logs"

**Look for:**
```
✓ Server running on port 5000
✓ MongoDB connected
```

**If you see errors:**
- MongoDB connection failed → Check `MONGODB_URI`
- Port errors → Check `PORT` variable
- OAuth errors → Check Google credentials

---

## 🔧 Quick Fix Commands

### **Update Railway CLIENT_URL:**

```bash
# Using Railway CLI
railway variables set CLIENT_URL=https://your-app.vercel.app

# Verify
railway variables
```

### **Update Vercel Environment Variable:**

```bash
# Using Vercel CLI
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend.railway.app

# Redeploy
vercel --prod
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "CORS Error"**

**Cause:** `CLIENT_URL` in Railway doesn't match Vercel URL

**Solution:**
1. Get your exact Vercel URL (e.g., `https://mela-chain.vercel.app`)
2. Update `CLIENT_URL` in Railway to match exactly
3. Wait for Railway to redeploy (2 min)
4. Test again

---

### **Issue 2: "Failed to Fetch"**

**Cause:** `NEXT_PUBLIC_API_URL` is wrong or backend is down

**Solution:**
1. Test backend directly: `curl https://your-backend.railway.app/api/health`
2. If backend works, check `NEXT_PUBLIC_API_URL` in Vercel
3. Must start with `NEXT_PUBLIC_` for client-side access
4. Redeploy frontend after changing

---

### **Issue 3: "Courses Array is Empty"**

**Cause:** Database has no courses or MongoDB not connected

**Solution:**
1. Check Railway logs for "MongoDB connected"
2. Verify `MONGODB_URI` is correct
3. Check MongoDB Atlas has data
4. Run seed script if needed:
   ```bash
   railway run npm run seed
   ```

---

### **Issue 4: "Environment Variable Not Found"**

**Cause:** Variable doesn't start with `NEXT_PUBLIC_`

**Solution:**
- Frontend variables MUST start with `NEXT_PUBLIC_`
- Backend variables don't need this prefix
- Redeploy after adding variables

---

## ✅ Complete Checklist

- [ ] Backend deployed successfully on Railway
- [ ] Backend health endpoint responds
- [ ] Backend courses endpoint returns data
- [ ] `CLIENT_URL` in Railway = Vercel URL (exact match)
- [ ] `NEXT_PUBLIC_API_URL` in Vercel = Railway URL
- [ ] No trailing slashes in URLs
- [ ] Frontend redeployed after variable changes
- [ ] No CORS errors in browser console
- [ ] MongoDB connected (check Railway logs)
- [ ] Courses exist in database

---

## 🔍 Debug Steps

### **1. Test Backend Directly**

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Courses
curl https://your-backend.railway.app/api/mela/courses

# Should return JSON, not HTML or error
```

---

### **2. Check Vercel Build Logs**

1. Go to Vercel dashboard
2. Click "Deployments"
3. Click latest deployment
4. Check build logs for errors

---

### **3. Check Network Tab**

1. Open Vercel site
2. Press F12
3. Go to "Network" tab
4. Refresh page
5. Look for API calls
6. Check status codes (should be 200)
7. Check response (should be JSON)

---

### **4. Test from Vercel Console**

Open browser console on your Vercel site and run:

```javascript
// Test API connection
fetch('https://your-backend.railway.app/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));

// Test courses
fetch('https://your-backend.railway.app/api/mela/courses')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

---

## 🎯 Most Likely Issues

### **1. CLIENT_URL Mismatch (90% of cases)**

**Check:**
```
Railway CLIENT_URL: https://mela-chain.vercel.app
Vercel URL:         https://mela-chain.vercel.app
                    ↑ Must match exactly!
```

---

### **2. Wrong Environment Variable Name**

**Check:**
```
✅ Correct: NEXT_PUBLIC_API_URL
❌ Wrong:   API_URL
❌ Wrong:   NEXT_API_URL
❌ Wrong:   PUBLIC_API_URL
```

---

### **3. Forgot to Redeploy**

After changing environment variables:
- Railway auto-redeploys (wait 2 min)
- Vercel needs manual redeploy!

---

## 🚀 Quick Fix (Most Common)

```bash
# 1. Update Railway CLIENT_URL
railway variables set CLIENT_URL=https://your-exact-vercel-url.vercel.app

# 2. Verify Vercel has correct API URL
# Go to Vercel → Settings → Environment Variables
# Check: NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# 3. Redeploy Vercel
# Go to Vercel → Deployments → Redeploy

# 4. Wait 2-3 minutes

# 5. Test your site!
```

---

## 📊 Expected Behavior

When working correctly:

1. **Open Vercel site**
2. **Courses page loads**
3. **Courses display**
4. **No errors in console**
5. **Network tab shows 200 OK responses**

---

## 🔧 Advanced: Update CORS to Allow Multiple Origins

If you need to allow multiple domains (development + production):

**Edit `backend/server.js`:**

```javascript
// Replace the CORS section with:
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Then push to GitHub and Railway will redeploy.

---

## 📞 Still Not Working?

### **Provide These Details:**

1. **Railway backend URL**: `https://your-backend.railway.app`
2. **Vercel frontend URL**: `https://your-app.vercel.app`
3. **Test backend health**: `curl https://your-backend.railway.app/api/health`
4. **Browser console errors**: Screenshot or copy error messages
5. **Railway logs**: Copy last 20 lines
6. **Vercel environment variables**: Screenshot (hide sensitive values)

---

## ✅ Success Indicators

Your connection is working when:

- ✅ Backend health endpoint returns JSON
- ✅ Backend courses endpoint returns array
- ✅ Frontend loads without errors
- ✅ Courses display on frontend
- ✅ No CORS errors in console
- ✅ Network tab shows 200 responses

---

**Most likely fix: Update CLIENT_URL in Railway to match your Vercel URL exactly!** 🎯

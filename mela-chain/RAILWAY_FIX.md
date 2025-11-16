# 🔧 Railway Deployment Error Fix

## ❌ Error: "Railpack could not determine how to build the app"

This happens because Railway is looking at your **project root** (`mela-chain/`) instead of the **backend folder** (`mela-chain/backend/`).

---

## ✅ Solution: Set Root Directory

### **Method 1: Via Railway Dashboard (Easiest)**

1. **Go to Railway Dashboard**:
   - Open [railway.app](https://railway.app)
   - Click on your project
   - Click on your service

2. **Open Settings**:
   - Click the "Settings" tab (top navigation)

3. **Set Root Directory**:
   - Scroll down to "Build & Deploy" section
   - Find **"Root Directory"**
   - Enter: `backend`
   - Click outside the field to save

4. **Set Start Command** (while you're here):
   - In the same section, find **"Start Command"**
   - Enter: `node server.js`
   - Click outside to save

5. **Redeploy**:
   - Go to "Deployments" tab
   - Click "Deploy" or wait for auto-deploy
   - Railway will now build from the `backend` folder

---

### **Method 2: Using railway.toml File**

Create this file in your **project root**:

**File: `c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain\railway.toml`**

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[service]
rootDirectory = "backend"
```

Then push to GitHub:
```bash
git add railway.toml
git commit -m "Add Railway configuration"
git push
```

Railway will automatically redeploy with the correct settings.

---

### **Method 3: Using railway.json (Alternative)**

Create this file in your **backend folder**:

**File: `c:\Users\HP\Downloads\Mela_Polkadot_Project\mela-chain\backend\railway.json`**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🎯 Recommended Approach

**Use Method 1** (Dashboard) - It's the easiest and most reliable:

1. Go to Railway Settings
2. Set Root Directory: `backend`
3. Set Start Command: `node server.js`
4. Save and redeploy

---

## ✅ After Setting Root Directory

Railway should detect:
- ✅ Node.js project
- ✅ `package.json`
- ✅ Dependencies
- ✅ Start script

You'll see in logs:
```
Detected Node.js
Installing dependencies...
npm install
Starting application...
node server.js
```

---

## 🔍 Verify Settings

After setting root directory, check:

1. **Settings Tab**:
   - Root Directory: `backend` ✅
   - Start Command: `node server.js` ✅

2. **Deployment Logs** should show:
   ```
   Detected Node.js
   Found package.json
   Installing dependencies
   Running: node server.js
   Server running on port 5000
   MongoDB connected
   ```

---

## 🐛 If Still Not Working

### **Check 1: Verify package.json exists**
```bash
# Should exist at:
backend/package.json
```

### **Check 2: Verify start script**
In `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **Check 3: Clear and Redeploy**
1. Go to Settings
2. Scroll to "Danger Zone"
3. Click "Remove All Deployments"
4. Go to Deployments
5. Click "Deploy"

---

## 📊 Expected Build Output

After fixing, you should see:

```
╭─────────────────╮
│ Railpack 0.11.0 │
╰─────────────────╯

Detected Node.js

Installing dependencies...
npm install

Building...
npm run build (if needed)

Starting...
node server.js

✓ Server running on port 5000
✓ MongoDB connected
✓ Deployment successful
```

---

## 🎯 Quick Fix Steps

1. **Go to Railway Dashboard**
2. **Click Settings**
3. **Set Root Directory**: `backend`
4. **Set Start Command**: `node server.js`
5. **Wait for auto-redeploy** (or click Deploy)
6. **Check logs** - should see "Server running"

---

## ✅ Success Indicators

Deployment is successful when you see:

- ✅ "Detected Node.js" in logs
- ✅ "Installing dependencies" in logs
- ✅ "Server running on port 5000" in logs
- ✅ "MongoDB connected" in logs
- ✅ Green checkmark on deployment
- ✅ Domain is accessible

---

**This should fix your deployment! The key is setting the Root Directory to `backend`. 🚀**

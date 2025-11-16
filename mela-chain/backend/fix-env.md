# 🔧 Fix Your .env File

## The Problem

Your `.env` file still shows:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

These are placeholder values, not your actual credentials from Google.

---

## ✅ How to Fix

### Step 1: Find Your Google Credentials

Go back to Google Cloud Console:
https://console.cloud.google.com/apis/credentials

You should see your OAuth 2.0 Client ID. Click on it to see:
- **Client ID** - A long string like: `123456789012-abc123def456ghi789jkl.apps.googleusercontent.com`
- **Client Secret** - A string like: `GOCSPX-AbCdEfGhIjKlMnOp`

### Step 2: Edit .env File

Open `backend/.env` in your editor and find these lines (around line 35-40):

**Replace this:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**With your actual credentials (example format):**
```env
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOp
```

**IMPORTANT:**
- ❌ Don't use quotes: `GOOGLE_CLIENT_ID="123..."`
- ❌ Don't add spaces: `GOOGLE_CLIENT_ID = 123...`
- ✅ Just: `GOOGLE_CLIENT_ID=123...`
- ✅ Make sure it's all on ONE line (no line breaks)

### Step 3: Also Update Email

Find this line:
```env
EMAIL_USER=your-email@gmail.com
```

Replace with:
```env
EMAIL_USER=samiberhanu12@gmail.com
```

### Step 4: Save and Restart

1. Save the `.env` file
2. Stop your backend server (Ctrl+C)
3. Restart it:
   ```bash
   npm run dev
   ```

---

## 🔍 How to Verify

After restarting, check the backend console. You should NOT see any errors about Google OAuth.

Then test:
1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. You should see the Google consent screen (not an error)

---

## 🐛 Common Mistakes

### Mistake 1: Line breaks in credentials
❌ Bad:
```env
GOOGLE_CLIENT_ID=123456789012-abc123def456
ghi789jkl.apps.googleusercontent.com
```

✅ Good:
```env
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl.apps.googleusercontent.com
```

### Mistake 2: Extra spaces
❌ Bad: `GOOGLE_CLIENT_ID = 123...`
✅ Good: `GOOGLE_CLIENT_ID=123...`

### Mistake 3: Quotes
❌ Bad: `GOOGLE_CLIENT_ID="123..."`
✅ Good: `GOOGLE_CLIENT_ID=123...`

### Mistake 4: Wrong credentials
Make sure you copied from the correct OAuth client in Google Console.

---

## 📋 Complete Example

Here's what your Google OAuth section should look like (with your real values):

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOp
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## ⚠️ Still Getting Error 401?

If you still get "OAuth client was not found" after fixing the .env file:

1. **Double-check the Client ID in Google Console:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Click on your OAuth 2.0 Client ID
   - Copy the Client ID again (make sure you copy ALL of it)

2. **Make sure the redirect URI is correct in Google Console:**
   - It should be EXACTLY: `http://localhost:5000/api/auth/google/callback`
   - No trailing slash
   - Check for typos

3. **Try creating a new OAuth client:**
   - Sometimes the old one gets corrupted
   - Create a new OAuth 2.0 Client ID
   - Use the new credentials

---

Need help? Share a screenshot of your Google Cloud Console OAuth client settings (hide the secret!).

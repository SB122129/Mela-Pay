# Script to add Google OAuth and Email configuration to .env

$envContent = @"

# Session Secret
SESSION_SECRET=mela_chain_session_secret_2024

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=qmuo gejh vwfp yrvx

# Google OAuth Configuration
# Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
"@

Add-Content -Path ".env" -Value $envContent
Write-Host "✅ Google OAuth configuration added to .env file!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to update these values:" -ForegroundColor Yellow
Write-Host "1. EMAIL_USER - Your Gmail address" -ForegroundColor Cyan
Write-Host "2. GOOGLE_CLIENT_ID - From Google Cloud Console" -ForegroundColor Cyan
Write-Host "3. GOOGLE_CLIENT_SECRET - From Google Cloud Console" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 See QUICK_START_GOOGLE_AUTH.md for instructions" -ForegroundColor Magenta

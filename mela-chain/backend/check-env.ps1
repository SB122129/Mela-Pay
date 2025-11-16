# Script to check if .env file has valid Google OAuth credentials

Write-Host "🔍 Checking your .env file..." -ForegroundColor Cyan
Write-Host ""

$envPath = ".env"

if (Test-Path $envPath) {
    $content = Get-Content $envPath -Raw
    
    # Check for Google Client ID
    if ($content -match "GOOGLE_CLIENT_ID=(.+)") {
        $clientId = $matches[1].Trim()
        
        if ($clientId -eq "your-google-client-id" -or $clientId -eq "") {
            Write-Host "❌ GOOGLE_CLIENT_ID is not set (still placeholder)" -ForegroundColor Red
            Write-Host "   Current value: $clientId" -ForegroundColor Yellow
        }
        elseif ($clientId -match "^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$") {
            Write-Host "✅ GOOGLE_CLIENT_ID looks valid" -ForegroundColor Green
            Write-Host "   Value: $($clientId.Substring(0, 20))..." -ForegroundColor Gray
        }
        else {
            Write-Host "⚠️  GOOGLE_CLIENT_ID format looks unusual" -ForegroundColor Yellow
            Write-Host "   Current value: $clientId" -ForegroundColor Yellow
            Write-Host "   Expected format: 123456789012-abc123.apps.googleusercontent.com" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "❌ GOOGLE_CLIENT_ID not found in .env" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Check for Google Client Secret
    if ($content -match "GOOGLE_CLIENT_SECRET=(.+)") {
        $clientSecret = $matches[1].Trim()
        
        if ($clientSecret -eq "your-google-client-secret" -or $clientSecret -eq "") {
            Write-Host "❌ GOOGLE_CLIENT_SECRET is not set (still placeholder)" -ForegroundColor Red
            Write-Host "   Current value: $clientSecret" -ForegroundColor Yellow
        }
        elseif ($clientSecret -match "^GOCSPX-[A-Za-z0-9_-]+$") {
            Write-Host "✅ GOOGLE_CLIENT_SECRET looks valid" -ForegroundColor Green
            Write-Host "   Value: GOCSPX-***" -ForegroundColor Gray
        }
        else {
            Write-Host "⚠️  GOOGLE_CLIENT_SECRET format looks unusual" -ForegroundColor Yellow
            Write-Host "   Current value: $($clientSecret.Substring(0, [Math]::Min(10, $clientSecret.Length)))..." -ForegroundColor Yellow
            Write-Host "   Expected format: GOCSPX-AbCdEfGh..." -ForegroundColor Gray
        }
    }
    else {
        Write-Host "❌ GOOGLE_CLIENT_SECRET not found in .env" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Check for Email User
    if ($content -match "EMAIL_USER=(.+)") {
        $emailUser = $matches[1].Trim()
        
        if ($emailUser -eq "your-email@gmail.com" -or $emailUser -eq "") {
            Write-Host "⚠️  EMAIL_USER is not set (still placeholder)" -ForegroundColor Yellow
            Write-Host "   Current value: $emailUser" -ForegroundColor Yellow
        }
        elseif ($emailUser -match "@gmail\.com$") {
            Write-Host "✅ EMAIL_USER is set" -ForegroundColor Green
            Write-Host "   Value: $emailUser" -ForegroundColor Gray
        }
        else {
            Write-Host "⚠️  EMAIL_USER doesn't look like a Gmail address" -ForegroundColor Yellow
            Write-Host "   Current value: $emailUser" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    
    # Summary
    $hasValidClientId = $content -match "GOOGLE_CLIENT_ID=\d+-[a-z0-9]+\.apps\.googleusercontent\.com"
    $hasValidSecret = $content -match "GOOGLE_CLIENT_SECRET=GOCSPX-[A-Za-z0-9_-]+"
    
    if ($hasValidClientId -and $hasValidSecret) {
        Write-Host "✅ Your Google OAuth credentials look good!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your backend: npm run dev" -ForegroundColor White
        Write-Host "2. Test Google Sign-In at: http://localhost:3000/login" -ForegroundColor White
    }
    else {
        Write-Host "❌ Your Google OAuth credentials need to be updated" -ForegroundColor Red
        Write-Host ""
        Write-Host "To fix:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
        Write-Host "2. Copy your Client ID and Client Secret" -ForegroundColor White
        Write-Host "3. Update them in the .env file" -ForegroundColor White
        Write-Host "4. Make sure there are no quotes or extra spaces" -ForegroundColor White
        Write-Host ""
        Write-Host "See fix-env.md for detailed instructions" -ForegroundColor Magenta
    }
}
else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host ""

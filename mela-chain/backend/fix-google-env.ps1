# Script to fix Google OAuth credentials in .env file

Write-Host "🔧 Fixing Google OAuth credentials in .env file..." -ForegroundColor Cyan
Write-Host ""

$envPath = ".env"

if (Test-Path $envPath) {
    # Read the entire file
    $content = Get-Content $envPath -Raw
    
    # Remove quotes and spaces from GOOGLE_CLIENT_ID
    $content = $content -replace 'GOOGLE_CLIENT_ID\s*=\s*"([^"]+)"', 'GOOGLE_CLIENT_ID=$1'
    
    # Remove quotes and spaces from GOOGLE_CLIENT_SECRET
    $content = $content -replace 'GOOGLE_CLIENT_SECRET\s*=\s*"([^"]+)"', 'GOOGLE_CLIENT_SECRET=$1'
    
    # Remove quotes and spaces from GOOGLE_CALLBACK_URL
    $content = $content -replace 'GOOGLE_CALLBACK_URL\s*=\s*"([^"]+)"', 'GOOGLE_CALLBACK_URL=$1'
    
    # Write back to file
    Set-Content -Path $envPath -Value $content -NoNewline
    
    Write-Host "✅ Fixed! Credentials now have no quotes or spaces" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying..." -ForegroundColor Cyan
    
    # Show the fixed lines
    $lines = Get-Content $envPath | Select-String "GOOGLE_"
    foreach ($line in $lines) {
        Write-Host "  $line" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "✅ Done! Now restart your backend:" -ForegroundColor Green
    Write-Host "   npm run dev" -ForegroundColor White
}
else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

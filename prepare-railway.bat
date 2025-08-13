@echo off
echo ================================
echo    RAILWAY DEPLOYMENT PREP
echo ================================
echo.

echo 1. Cleaning up old files...
call clean-wisbyte.bat

echo 2. Updating package.json for Railway...
powershell -Command "(Get-Content package.json) -replace '3051', '3000' | Set-Content package.json"

echo 3. Replacing server.js with Railway version...
copy server-railway.js server.js >nul 2>&1

echo 4. Updating .env.example with correct settings...
powershell -Command "(Get-Content .env.example) -replace 'PORT=3051', 'PORT=3000' | Set-Content .env.example"
powershell -Command "(Get-Content .env.example) -replace 'CASSO_BANK_ID=12345', 'CASSO_BANK_ID=12981' | Set-Content .env.example"

echo 5. Testing data initialization...
node test-data-init.js

echo.
echo ✅ READY FOR RAILWAY DEPLOYMENT!
echo.
echo 📋 Next steps:
echo 1. git add .
echo 2. git commit -m "Initial commit"
echo 3. git push origin main
echo 4. Connect repository to Railway
echo 5. Set environment variables in Railway dashboard
echo 6. Deploy!
echo.
echo 🔧 Environment variables to set in Railway:
echo TOKEN=your_discord_bot_token
echo VIETQR_CLIENT_ID=your_vietqr_client_id
echo VIETQR_API_KEY=your_vietqr_api_key
echo CASSO_API_KEY=your_casso_api_key
echo CASSO_BANK_ID=12981
echo.
pause
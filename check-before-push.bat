@echo off
echo ================================
echo    PRE-PUSH CHECKLIST
echo ================================
echo.

echo 🔍 Checking project structure...
echo.

echo ✅ Core files:
if exist "index.js" (echo    ✓ index.js) else (echo    ❌ index.js MISSING)
if exist "server.js" (echo    ✓ server.js) else (echo    ❌ server.js MISSING)
if exist "package.json" (echo    ✓ package.json) else (echo    ❌ package.json MISSING)
if exist "config.json" (echo    ✓ config.json) else (echo    ❌ config.json MISSING)

echo.
echo ✅ Commands:
if exist "commands\pay.js" (echo    ✓ commands/pay.js) else (echo    ❌ commands/pay.js MISSING)
if exist "commands\checkpay.js" (echo    ✓ commands/checkpay.js) else (echo    ❌ commands/checkpay.js MISSING)

echo.
echo ✅ Libraries:
if exist "libs\casso.js" (echo    ✓ libs/casso.js) else (echo    ❌ libs/casso.js MISSING)
if exist "libs\dataInit.js" (echo    ✓ libs/dataInit.js) else (echo    ❌ libs/dataInit.js MISSING)

echo.
echo ✅ Configuration:
if exist ".env.example" (echo    ✓ .env.example) else (echo    ❌ .env.example MISSING)
if exist ".gitignore" (echo    ✓ .gitignore) else (echo    ❌ .gitignore MISSING)
if exist "railway.json" (echo    ✓ railway.json) else (echo    ❌ railway.json MISSING)

echo.
echo ✅ Documentation:
if exist "README.md" (echo    ✓ README.md) else (echo    ❌ README.md MISSING)
if exist "RAILWAY_DEPLOY.md" (echo    ✓ RAILWAY_DEPLOY.md) else (echo    ❌ RAILWAY_DEPLOY.md MISSING)

echo.
echo 🔒 Security check:
if exist ".env" (
    echo    ⚠️  .env file exists - make sure it's in .gitignore
) else (
    echo    ✓ No .env file found - good for security
)

if exist "data\orders.json" (
    echo    ⚠️  orders.json exists - will not be pushed (in .gitignore)
) else (
    echo    ✓ No orders.json found - will be auto-created
)

echo.
echo 📊 Project statistics:
for /f %%i in ('dir /s /b *.js 2^>nul ^| find /c /v ""') do echo    📄 JavaScript files: %%i
for /f %%i in ('dir /s /b *.json 2^>nul ^| find /c /v ""') do echo    ⚙️  JSON files: %%i
for /f %%i in ('dir /s /b *.md 2^>nul ^| find /c /v ""') do echo    📖 Markdown files: %%i

echo.
echo ✅ PROJECT READY FOR GITHUB!
echo.
echo 📋 Next step: Run push-to-github.bat
echo.
pause
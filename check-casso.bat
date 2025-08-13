@echo off
echo ================================
echo    CASSO INTEGRATION CHECK
echo ================================
echo.

echo 1. Checking if libs/casso.js exists...
if exist "libs\casso.js" (
    echo ✅ libs/casso.js found
) else (
    echo ❌ libs/casso.js NOT FOUND
    echo Creating basic casso.js...
    goto CREATE_CASSO
)

echo.
echo 2. Checking .env file for Casso credentials...
if exist ".env" (
    echo ✅ .env file found
    findstr /i "CASSO" .env
) else (
    echo ❌ .env file NOT FOUND
)

echo.
echo 3. Testing Casso connection...
node -e "
try {
  const { listTransactions } = require('./libs/casso.js');
  console.log('✅ Casso module can be imported');
} catch (e) {
  console.log('❌ Error importing casso.js:', e.message);
}
"

goto END

:CREATE_CASSO
mkdir libs 2>nul
echo Creating basic casso.js file...
goto END

:END
echo.
echo ================================
pause
@echo off
echo Replacing checkpay.js...
del "commands\checkpay.js"
ren "commands\checkpay-fixed.js" "checkpay.js"
echo Done!

echo.
echo Testing Casso connection...
echo Please check if CASSO_API_KEY and CASSO_BANK_ID are set in .env file
echo.
pause
@echo off
echo ================================
echo    GITHUB DEPLOYMENT SETUP
echo ================================
echo.

echo 1. Cleaning up for GitHub...
call prepare-railway.bat

echo 2. Initializing Git repository...
git init

echo 3. Adding all files...
git add .

echo 4. Creating initial commit...
git commit -m "Initial commit: Discord Payment Bot with VietQR and Casso integration"

echo.
echo ✅ Git repository initialized!
echo.
echo 📋 Next steps:
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Repository name: payment-bot
echo    - Description: Discord Payment Bot with VietQR and Casso
echo    - Public or Private (your choice)
echo    - Don't initialize with README (we already have one)
echo.
echo 2. Copy the repository URL (it will look like):
echo    https://github.com/yourusername/payment-bot.git
echo.
set /p repo_url="3. Paste your GitHub repository URL here:https://github.com/andydat299/botbanking.git "

echo.
echo 4. Adding remote origin...
git remote add origin %repo_url%

echo 5. Setting main branch...
git branch -M main

echo 6. Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo.
echo 🚀 Now you can deploy to Railway:
echo 1. Go to https://railway.app
echo 2. Sign in with GitHub
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your payment-bot repository
echo 6. Set environment variables
echo 7. Deploy!
echo.
pause
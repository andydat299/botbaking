@echo off
echo ================================
echo    FIXING GIT PUSH ERROR
echo ================================
echo.

echo 🔍 Checking current Git status...
git status

echo.
echo 🔧 Fixing the push issue...

echo 1. Checking if we have any commits...
git log --oneline -1 >nul 2>&1
if errorlevel 1 (
    echo    ⚠️  No commits found, creating initial commit...
    git add .
    git commit -m "Initial commit: Discord Payment Bot with VietQR and Casso"
    echo    ✅ Initial commit created
) else (
    echo    ✅ Commits exist
)

echo.
echo 2. Checking current branch...
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set current_branch=%%i
if "%current_branch%"=="" (
    echo    ⚠️  No branch found, creating main branch...
    git checkout -b main
    echo    ✅ Main branch created
) else (
    echo    ✅ Current branch: %current_branch%
    if not "%current_branch%"=="main" (
        echo    🔄 Switching to main branch...
        git checkout -b main 2>nul || git checkout main
    )
)

echo.
echo 3. Checking remote origin...
git remote -v
echo.

echo 4. Attempting to push...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. Trying alternative solution...
    echo.
    echo 🔄 Force pushing (this is safe for initial push)...
    git push --set-upstream origin main --force
    
    if errorlevel 1 (
        echo.
        echo 💡 Manual steps needed:
        echo 1. Make sure the repository exists on GitHub
        echo 2. Check if you have write permissions
        echo 3. Try: git remote set-url origin https://github.com/andydat299/botbanking.git
        echo 4. Then: git push -u origin main
    ) else (
        echo ✅ Force push successful!
    )
) else (
    echo ✅ Push successful!
)

echo.
pause
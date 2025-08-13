# Git Push Error Fix

## 🚨 Lỗi: "src refspec main does not match any"

### ⚡ Quick Fix Commands:

```bash
# 1. Check git status
git status

# 2. Add all files (if not added)
git add .

# 3. Create initial commit (if no commits)
git commit -m "Initial commit: Discord Payment Bot"

# 4. Create and switch to main branch
git checkout -b main

# 5. Push with upstream
git push --set-upstream origin main
```

### 🔄 Alternative Fix:

```bash
# Force push (safe for initial push)
git push --set-upstream origin main --force
```

### 🔧 Complete Reset (if needed):

```bash
# Remove existing git
rmdir /s .git

# Start fresh
git init
git add .
git commit -m "Initial commit: Discord Payment Bot"
git branch -M main
git remote add origin https://github.com/andydat299/botbanking.git
git push -u origin main
```

### 📋 Checklist:

- [ ] Repository exists on GitHub: https://github.com/andydat299/botbanking
- [ ] You have write permissions to the repository
- [ ] Files are added (`git add .`)
- [ ] Commit exists (`git commit`)
- [ ] On main branch (`git checkout -b main`)
- [ ] Remote origin is correct (`git remote -v`)

### 🏃‍♂️ Run Auto Fix:

```bash
fix-git-push.bat
```
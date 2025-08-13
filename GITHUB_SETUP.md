# 📂 Hướng dẫn push lên GitHub từng bước

## 🚀 Cách 1: Tự động (Khuyến nghị)

```bash
push-to-github.bat
```

## ⚙️ Cách 2: Manual

### Bước 1: Chuẩn bị project
```bash
prepare-railway.bat
```

### Bước 2: Tạo repository trên GitHub
1. Vào https://github.com/new
2. Repository name: `payment-bot`
3. Description: `Discord Payment Bot with VietQR and Casso`
4. **Public** hoặc **Private** (tùy chọn)
5. ❌ **KHÔNG** check "Add a README file"
6. ❌ **KHÔNG** add .gitignore hoặc license
7. Click **"Create repository"**

### Bước 3: Git commands
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Discord Payment Bot"

# Add remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/payment-bot.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 📋 Files sẽ được push

### ✅ Core Files
- `index.js` - Main bot file
- `server.js` - Express server
- `package.json` - Dependencies
- `config.json` - Bot config

### ✅ Commands
- `commands/pay.js` - Payment command
- `commands/checkpay.js` - Check payment
- `commands/thunhap.js` - Income report

### ✅ Libraries
- `libs/casso.js` - Casso API integration
- `libs/dataInit.js` - Data initialization

### ✅ Configuration
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules
- `railway.json` - Railway config

### ✅ Documentation
- `README.md` - Project documentation
- `RAILWAY_DEPLOY.md` - Deployment guide

### ❌ Files sẽ KHÔNG được push
- `.env` - Environment secrets
- `data/orders.json` - Order data
- `node_modules/` - Dependencies
- Temporary/backup files

## 🔐 Environment Variables

Sau khi push, bạn cần set trong Railway:

```env
TOKEN=your_discord_bot_token
VIETQR_CLIENT_ID=your_vietqr_client_id  
VIETQR_API_KEY=your_vietqr_api_key
CASSO_API_KEY=your_casso_api_key
CASSO_BANK_ID=12981
```

## 🚀 Sau khi push

1. **Repository URL:** `https://github.com/YOUR_USERNAME/payment-bot`
2. **Railway Deploy:** Connect GitHub repo tới Railway
3. **Set Environment Variables** trong Railway dashboard
4. **Deploy và test!**

## 🐛 Troubleshooting

### Authentication issues
```bash
# Use personal access token thay vì password
# Hoặc setup SSH keys
```

### Permission denied
```bash
# Check repository permissions
# Make sure you're the owner/collaborator
```

### Already exists
```bash
# If you already have a repo with same name
git remote set-url origin https://github.com/YOUR_USERNAME/payment-bot.git
```
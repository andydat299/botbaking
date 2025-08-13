# FILES CẦN THIẾT ĐỂ DEPLOY LÊN GITHUB CHO RAILWAY

## 📋 DANH SÁCH FILE CODE CẦN THIẾT

### 🔧 Core Configuration Files
- `package.json` ✅ - Dependencies và scripts
- `package-lock.json` ✅ - Lock dependencies
- `.nvmrc` ✅ - Node.js version
- `railway.json` ✅ - Railway configuration
- `config.json` ✅ - Bot configuration

### 🤖 Main Bot Files
- `index.js` ✅ - Entry point của bot
- `server.js` ✅ - Express server cho webhook
- `deploy-commands.js` ✅ - Deploy slash commands

### 📂 Commands Directory
- `commands/pay.js` ✅ - Tạo QR thanh toán
- `commands/checkpay.js` ✅ - Kiểm tra thanh toán
- `commands/revenue.js` ✅ - Xem doanh thu
- `commands/thunhap.js` ✅ - Thống kê thu nhập

### 📚 Libraries Directory
- `libs/casso.js` ✅ - Casso API integration
- `libs/dataInit.js` ✅ - Initialize data structure

### 🌐 Routes Directory
- `routes/cassoWebhook.js` ✅ - Webhook endpoint cho Casso

### 📄 Documentation Files
- `README.md` ✅ - Hướng dẫn sử dụng
- `.env.example` ✅ - Template environment variables
- `RAILWAY_DEPLOY.md` ✅ - Hướng dẫn deploy
- `GITHUB_SETUP.md` ✅ - Hướng dẫn setup GitHub

### 🔒 Security Files
- `.gitignore` ✅ - Ignore sensitive files

### 📊 Data Directory (Structure Only)
- `data/` folder structure sẽ được tạo tự động
- KHÔNG bao gồm: `data/logs.json`, `data/orders.json` (sensitive data)

---

## ❌ FILES KHÔNG CẦN TRÊN GITHUB

### 🔐 Sensitive Files (đã có trong .gitignore)
- `.env` - Environment variables thật
- `data/logs.json` - Log dữ liệu
- `data/orders.json` - Dữ liệu đơn hàng
- `node_modules/` - Dependencies (sẽ cài tự động)

### 💻 Local Development Files
- `*.bat` files - Windows batch scripts
- `test-*.js` - Test files (không cần cho production)
- `node-cron.js` - Development tools
- `get-bank-id.js` - Utility scripts

---

## 🚀 CÁC BƯỚC DEPLOY

1. **Đảm bảo tất cả file cần thiết đã có:**
   ```bash
   git status
   ```

2. **Add và commit tất cả file:**
   ```bash
   git add .
   git commit -m "Deploy: All necessary files for Railway"
   ```

3. **Push lên GitHub:**
   ```bash
   git push origin main
   ```

4. **Trên Railway:**
   - Connect với GitHub repo
   - Set environment variables từ `.env.example`
   - Deploy sẽ tự động chạy

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Environment Variables:** Nhớ set tất cả biến trong `.env.example` trên Railway
2. **Database:** `data/` folder sẽ được tạo tự động khi bot chạy lần đầu
3. **Port:** Railway sẽ tự động assign PORT, không cần config thêm
4. **Health Check:** Endpoint `/health` đã được setup cho Railway monitoring

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] File `package.json` có đầy đủ dependencies
- [ ] File `.env.example` có tất cả biến cần thiết  
- [ ] File `railway.json` được config đúng
- [ ] Tất cả file code đã được commit
- [ ] `.gitignore` đã loại trừ file sensitive
- [ ] README.md có hướng dẫn đầy đủ

✅ **Tất cả file code đã sẵn sàng để deploy lên Railway!**

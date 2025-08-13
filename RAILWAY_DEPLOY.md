# 🚀 Railway Deployment Guide

## Quick Deploy

1. **Chạy script chuẩn bị:**
   ```bash
   prepare-railway.bat
   ```

2. **Push lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Payment Bot"
   git branch -M main
   git remote add origin https://github.com/yourusername/payment-bot.git
   git push -u origin main
   ```

3. **Deploy trên Railway:**
   - Vào https://railway.app
   - Chọn "New Project" → "Deploy from GitHub repo"
   - Chọn repository `payment-bot`
   - Railway sẽ tự động detect Node.js và deploy

## ⚙️ Environment Variables

Trong Railway dashboard, thiết lập:

### Required Variables
```env
TOKEN=your_discord_bot_token
VIETQR_CLIENT_ID=your_vietqr_client_id
VIETQR_API_KEY=your_vietqr_api_key
CASSO_API_KEY=your_casso_api_key
CASSO_BANK_ID=12981
```

### Optional Variables
```env
PORT=3000                    # Railway tự set
RAILWAY_STATIC_URL=auto      # Railway tự set
```

## 🔧 Railway Configuration

### Build Command
```
npm install
```

### Start Command  
```
npm start
```

### Health Check
- **Path:** `/health`
- **Timeout:** 100s

## 📊 Monitoring

### Logs
- Railway dashboard → Deployments → Logs
- Real-time logging với timestamps

### Health Check
```
GET https://your-app.railway.app/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-13T10:30:00.000Z",
  "uptime": 3600,
  "service": "Payment Bot"
}
```

## 🎯 Custom Domain (Optional)

1. Railway dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records
4. SSL auto-enabled

## 🐛 Troubleshooting

### Build Failures
- Check Node.js version (18+ required)
- Verify package.json syntax
- Check Railway build logs

### Runtime Errors
- Verify environment variables
- Check Discord bot permissions
- Test API credentials

### Common Issues

**Bot không phản hồi:**
```bash
# Check TOKEN variable
echo $TOKEN

# Verify bot permissions
# Admin permissions required
```

**Slash commands không sync:**
```bash
# Deploy commands manually
npm run deploy
```

**VietQR/Casso errors:**
```bash
# Test connections
npm run test
```

## 🔄 Updates & Redeploy

### Auto Deploy
- Push to `main` branch → Tự động deploy
- Railway sẽ rebuild và restart

### Manual Deploy  
- Railway dashboard → Deploy Latest

### Rollback
- Railway dashboard → Deployments → Previous version → Promote

## 💰 Cost Estimation

### Railway Pricing
- **Hobby Plan:** $5/month + usage
- **Pro Plan:** $20/month + usage
- **Free tier:** Limited resources

### Usage Factors
- Memory: ~100-200MB
- CPU: Minimal
- Network: API calls + webhook traffic
- Storage: JSON files (~1MB)

## 📱 Mobile Management

Railway mobile app:
- Monitor deployments
- View logs
- Restart services
- Update environment variables

## 🎉 Go Live Checklist

- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Health check responds
- [ ] Discord slash commands deployed
- [ ] VietQR API tested
- [ ] Casso webhook configured
- [ ] Bot invited to Discord server
- [ ] Test payment flow

---

🎯 **Your bot is now running on Railway!**
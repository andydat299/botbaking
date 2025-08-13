import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function getBankAccounts() {
  try {
    const response = await axios.get('https://oauth.casso.vn/v2/userInfo', {
      headers: {
        'Authorization': `Apikey ${process.env.CASSO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      const bankAccounts = response.data.data.bank_acc_list;
      
      console.log('📋 Danh sách tài khoản ngân hàng:');
      bankAccounts.forEach(account => {
        console.log(`🏦 ${account.bank.shortName} - ${account.account_number}`);
        console.log(`   📍 Bank ID: ${account.id}`);
        console.log(`   💰 Số dư: ${account.balance?.toLocaleString('vi-VN')} VND`);
        console.log('   ────────────────────────');
      });

      return bankAccounts;
    }
  } catch (error) {
    console.error('❌ Lỗi lấy bank accounts:', error.response?.data || error.message);
  }
}

// Chạy function
getBankAccounts();
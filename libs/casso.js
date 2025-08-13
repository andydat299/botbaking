// libs/casso.js
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const CASSO_API_KEY = process.env.CASSO_API_KEY;
const CASSO_BANK_ID = process.env.CASSO_BANK_ID;

if (!CASSO_API_KEY || !CASSO_BANK_ID) {
  console.warn('⚠️ CASSO_API_KEY hoặc CASSO_BANK_ID chưa được thiết lập trong .env');
}

/**
 * Lấy danh sách giao dịch từ Casso API
 * @param {string} date - Ngày theo format YYYY-MM-DD
 * @returns {Array} Danh sách giao dịch
 */
export async function listTransactions(date) {
  try {
    console.log(`🔍 Đang lấy giao dịch ngày ${date} từ Casso...`);
    
    const response = await axios.get('https://oauth.casso.vn/v2/transactions', {
      headers: {
        'Authorization': `Apikey ${CASSO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        bank_acc_id: CASSO_BANK_ID,
        fromDate: date,
        toDate: date,
        page: 1,
        pageSize: 200
      }
    });

    if (response.data && response.data.data && response.data.data.records) {
      const transactions = response.data.data.records;
      console.log(`✅ Lấy thành công ${transactions.length} giao dịch`);
      
      return transactions.map(tx => ({
        id: tx.id,
        amount: parseInt(tx.amount),
        description: tx.description || '',
        when: tx.when,
        bank_sub_acc_id: tx.bank_sub_acc_id
      }));
    } else {
      console.warn('⚠️ Casso API trả về dữ liệu không đúng format');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi gọi Casso API:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('API Key Casso không hợp lệ');
    } else if (error.response?.status === 403) {
      throw new Error('Không có quyền truy cập Casso API');
    } else if (error.response?.status === 404) {
      throw new Error('Bank ID không tồn tại');
    } else {
      throw new Error(`Lỗi Casso API: ${error.message}`);
    }
  }
}

/**
 * Test kết nối Casso
 */
export async function testConnection() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const transactions = await listTransactions(today);
    console.log(`✅ Test Casso thành công - ${transactions.length} giao dịch hôm nay`);
    return true;
  } catch (error) {
    console.error('❌ Test Casso thất bại:', error.message);
    return false;
  }
}

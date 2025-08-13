import fs from 'fs-extra';
import path from 'path';

/**
 * Khởi tạo cấu trúc thư mục và files cần thiết
 */
export async function initializeDataStructure() {
  try {
    // Tạo thư mục data nếu chưa có
    const dataDir = path.join(process.cwd(), 'data');
    await fs.ensureDir(dataDir);
    
    // Tạo file orders.json nếu chưa có
    const ordersPath = path.join(dataDir, 'orders.json');
    if (!await fs.pathExists(ordersPath)) {
      await fs.writeJSON(ordersPath, [], { spaces: 2 });
      console.log('✅ Created orders.json file');
    }
    
    // Tạo file logs.json nếu chưa có (để lưu logs)
    const logsPath = path.join(dataDir, 'logs.json');
    if (!await fs.pathExists(logsPath)) {
      await fs.writeJSON(logsPath, [], { spaces: 2 });
      console.log('✅ Created logs.json file');
    }
    
    console.log('✅ Data structure initialized successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error initializing data structure:', error);
    return false;
  }
}

/**
 * Đảm bảo file orders.json có cấu trúc đúng
 */
export async function ensureOrdersFile() {
  try {
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const orders = await fs.readJSON(ordersPath).catch(() => []);
    
    // Validate structure
    if (!Array.isArray(orders)) {
      await fs.writeJSON(ordersPath, [], { spaces: 2 });
      console.log('✅ Fixed orders.json structure');
    }
    
    return orders;
  } catch (error) {
    console.error('❌ Error ensuring orders file:', error);
    return [];
  }
}
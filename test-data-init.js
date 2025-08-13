import { initializeDataStructure, ensureOrdersFile } from './libs/dataInit.js';

console.log('🧪 Testing data initialization...');

async function testDataInit() {
  try {
    // Test initialization
    const success = await initializeDataStructure();
    if (!success) {
      throw new Error('Data initialization failed');
    }
    
    // Test orders file
    const orders = await ensureOrdersFile();
    console.log(`✅ Orders file initialized with ${orders.length} records`);
    
    console.log('✅ All data initialization tests passed!');
    
  } catch (error) {
    console.error('❌ Data initialization test failed:', error);
    process.exit(1);
  }
}

testDataInit();
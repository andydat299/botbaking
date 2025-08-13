import { testConnection } from './libs/casso.js';

console.log('🧪 Testing Casso connection...');

testConnection()
  .then(success => {
    if (success) {
      console.log('✅ Casso integration is working!');
    } else {
      console.log('❌ Casso integration failed!');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  });
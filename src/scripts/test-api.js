// Simple script to test API endpoints
const fetch = require('node-fetch');

async function testCategoriesAPI() {
  try {
    console.log('Testing Categories API...');
    
    // Test GET /api/admin/categories
    console.log('\nTesting GET /api/admin/categories');
    const response = await fetch('http://localhost:3000/api/admin/categories');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Categories count:', data.categories ? data.categories.length : 'N/A');
    
    if (data.categories && data.categories.length > 0) {
      console.log('First category:', data.categories[0]);
    } else {
      console.log('No categories found');
    }
    
    console.log('\nAPI test completed successfully!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testCategoriesAPI();

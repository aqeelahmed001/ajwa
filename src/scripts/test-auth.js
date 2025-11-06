// Simple script to test NextAuth configuration
require('dotenv').config({ path: '.env.local' });

console.log('Testing NextAuth configuration...');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '[Set]' : '[Not Set]');

// Check if required environment variables are set
if (!process.env.NEXTAUTH_URL) {
  console.warn('Warning: NEXTAUTH_URL is not set. NextAuth may not work correctly.');
  console.log('Setting NEXTAUTH_URL to http://localhost:3000');
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not set. Using default development secret.');
  console.log('This is fine for development but should be set for production.');
}

console.log('NextAuth configuration test completed.');

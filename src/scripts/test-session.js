// Simple script to test session cookie
const http = require('http');

console.log('Testing session cookie...');

// Make a request to the session API
const req = http.get('http://localhost:3000/api/auth/session', {
  headers: {
    'Cookie': 'next-auth.session-token=your_session_token_here; next-auth.csrf-token=your_csrf_token_here'
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const sessionData = JSON.parse(data);
      console.log('Session Data:', sessionData);
    } catch (error) {
      console.log('Raw Response:', data);
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();

// Also check what cookies are stored in the browser
console.log('\nTo check cookies in your browser:');
console.log('1. Open Chrome DevTools (F12)');
console.log('2. Go to Application tab');
console.log('3. Click on Cookies in the sidebar');
console.log('4. Select your domain (localhost:3000)');
console.log('5. Look for next-auth.session-token cookie');

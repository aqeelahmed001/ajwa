// Simple script to test dashboard access
const http = require('http');

console.log('Testing dashboard access...');

// Make a request to the dashboard page
const req = http.get('http://localhost:3000/admin/dashboard', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Dashboard access successful!');
    } else if (res.statusCode === 307 || res.statusCode === 302) {
      console.log('Redirected to:', res.headers.location);
    } else {
      console.log('Dashboard access failed with status code:', res.statusCode);
    }
    
    // Check if the response contains any error messages
    if (data.includes('error') || data.includes('Error')) {
      console.log('Error detected in response body');
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();

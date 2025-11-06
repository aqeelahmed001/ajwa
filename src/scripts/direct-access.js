// Simple script to open the direct login page in the browser
const { exec } = require('child_process');

console.log('Opening direct login page in browser...');

// Open the direct login page in the default browser
const url = 'http://localhost:3000/admin/direct-login';

// Determine the command based on the platform
let command;
switch (process.platform) {
  case 'darwin': // macOS
    command = `open "${url}"`;
    break;
  case 'win32': // Windows
    command = `start "${url}"`;
    break;
  default: // Linux and others
    command = `xdg-open "${url}"`;
}

// Execute the command
exec(command, (error) => {
  if (error) {
    console.error('Error opening browser:', error);
    return;
  }
  console.log('Browser opened successfully!');
  console.log('URL:', url);
});

console.log('\nInstructions:');
console.log('1. Click the "Access Admin Dashboard" button on the page');
console.log('2. You should be redirected to the admin dashboard');
console.log('3. If you see the dashboard, the direct access is working');
console.log('4. You can now work on the category section');

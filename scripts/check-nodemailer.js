// This script checks if the nodemailer API is working with version 7.x
const nodemailer = require('nodemailer');

console.log('Nodemailer version:', nodemailer.version);

// Create a test transporter
const testTransporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'test@example.com',
    pass: 'password',
  },
});

console.log('Transporter created successfully');
console.log('Transporter configuration:', testTransporter.options);

// Test if the API methods we use are available
console.log('Available methods:');
console.log('- createTransport:', typeof nodemailer.createTransport === 'function');
console.log('- sendMail:', typeof testTransporter.sendMail === 'function');

console.log('Nodemailer API check completed successfully');

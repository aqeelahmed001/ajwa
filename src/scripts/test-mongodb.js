// Simple script to test MongoDB connection
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Successfully connected to MongoDB!');
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    console.log(`Database host: ${mongoose.connection.host}`);
    
    // List all collections
    console.log('\nAvailable collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();

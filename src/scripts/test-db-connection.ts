import { connectToDatabase } from '../lib/mongodb';

/**
 * Simple script to test the MongoDB connection
 */
async function testDbConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectToDatabase();
    const mongoose = require('mongoose');
    console.log('Successfully connected to MongoDB!');
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Database host: ${mongoose.connection.host}`);
    console.log(`Database port: ${mongoose.connection.port}`);
    
    // List all collections
    console.log('\nAvailable collections:');
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      if (collections.length === 0) {
        console.log('No collections found. Database is empty.');
      } else {
        collections.forEach((collection: { name: string }) => {
          console.log(`- ${collection.name}`);
        });
      }
    } else {
      console.log('Database connection not fully established. Cannot list collections.');
    }
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test function
testDbConnection();

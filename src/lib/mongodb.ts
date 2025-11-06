import mongoose from 'mongoose';
import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please add your MongoDB database name to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Connect to MongoDB using mongoose for models
export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return mongoose;
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    // Set bufferCommands to true to allow commands before connection is established
    mongoose.set('bufferCommands', true);
    
    // If connection is in progress, wait for it to complete
    if (mongoose.connection.readyState === 2) {
      console.log('MongoDB connection in progress, waiting...');
      // Wait for connection to be established
      return new Promise((resolve, reject) => {
        // Set up event listeners
        mongoose.connection.once('connected', () => {
          console.log('MongoDB connection established');
          resolve(mongoose);
        });
        
        mongoose.connection.once('error', (err) => {
          console.error('MongoDB connection error:', err);
          reject(err);
        });
        
        // Set a timeout in case the connection takes too long
        setTimeout(() => {
          if (mongoose.connection.readyState !== 1) {
            reject(new Error('MongoDB connection timeout'));
          }
        }, 10000); // 10 second timeout
      });
    }
    
    console.log('Initiating new MongoDB connection...');
    // Connect with explicit options
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // These options ensure more reliable connections
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    // Wait for the connection to be fully established
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve(true);
      } else {
        mongoose.connection.once('connected', resolve);
      }
    });
    
    console.log('MongoDB connected successfully, state:', mongoose.connection.readyState);
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

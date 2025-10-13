import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define a type-safe global cache
type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

// Declare the global cache variable
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Initialize the cache
const cache: MongooseCache = global.mongooseCache || { conn: null, promise: null };

// In development, maintain the cache across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.mongooseCache = cache;
}

async function dbConnect() {
  // If we have a connection already, return it
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection is being established, wait for it
  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Create new connection promise
    cache.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  // Wait for the connection to be established
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;

import mongoose from 'mongoose';

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env file');
}

// Type assertion since we've checked MONGODB_URI is not undefined
const uri = MONGODB_URI as string;

console.log('Connecting to MongoDB Atlas...');

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Attempting to connect to MongoDB Atlas...');
      cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
        console.log('MongoDB Atlas connected successfully');
        console.log('Database name:', mongoose.connection.name);
        return mongoose;
      }).catch((error) => {
        console.error('MongoDB Atlas connection error:', error);
        throw error;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Failed to connect to MongoDB Atlas:', e);
    cached.promise = null;
    throw e;
  }
}

// Add connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB Atlas connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Atlas disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB Atlas connected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB; 
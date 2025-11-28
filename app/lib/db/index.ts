import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Use In-Memory DB if no URI is provided or if we want to force it for this env
    // For this environment, we force it because local mongod is missing.
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
         if (!mongoServer) {
             mongoServer = await MongoMemoryServer.create();
             const uri = mongoServer.getUri();
             console.log("Started In-Memory MongoDB at:", uri);
             cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
                return mongoose;
             });
         }
    } else {
         cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
         });
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

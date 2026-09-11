import mongoose from "mongoose";
import { env } from "@/lib/env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.MONGODB_URI, {
        bufferCommands: false,
        dbName: "buzzieworld",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .catch((error) => {
        // Allow the next request to make a fresh connection attempt.
        cached.promise = null;
        cached.conn = null;

        console.error("MongoDB connection failed:", error);

        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}


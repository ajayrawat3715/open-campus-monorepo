import mongoose from "mongoose";
import { env } from "@cms/config";

/**
 * =========================================================================================
 * SERVERLESS-SAFE MONGOOSE CONNECTION POOL CACHING
 * =========================================================================================
 *
 * WHY DOES THIS CACHE EXIST?
 *
 * 1. The Serverless Lifecycle & Execution Model:
 *    In standard Node.js server architectures (e.g., long-running express servers in Docker),
 *    the app boots once, opens a single database connection pool, and maintains it indefinitely.
 *    In contrast, Vercel Serverless Functions execute on ephemeral micro-containers (AWS Lambda).
 *    These containers are created, frozen after execution, thawed for subsequent requests,
 *    and eventually destroyed based on traffic fluctuations.
 *
 * 2. The Connection Pool Exhaustion Problem:
 *    Without global caching, every incoming API route execution would initiate a new
 *    `mongoose.connect()` call. In high-traffic bursts, hundreds of concurrent lambdas would
 *    each open 5-10 socket connections, quickly exceeding the maximum connection limits
 *    of MongoDB Atlas (e.g., 100 on M0/M2/M5, 500 on M10). This results in `MongoServerError:
 *    connection pool exhausted` or cascading 504 gateway timeouts.
 *
 * 3. Race Conditions During Cold Starts:
 *    When multiple concurrent API requests hit the same newly spun up container simultaneously,
 *    storing only `conn` allows race conditions where multiple connection handshakes are initiated
 *    in parallel before the first one finishes.
 *    By caching BOTH `conn` (the established instance) AND `promise` (the in-flight connection promise),
 *    all concurrent requests await the exact same connection handshake.
 *
 * 4. Node.js Global Scope Persistence:
 *    In Node.js, the `global` object persists across warm serverless container invocations.
 *    Binding the cache to `global.mongooseCache` guarantees that thawed serverless invocations
 *    reuse the existing database socket seamlessly.
 * =========================================================================================
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the Node.js global namespace so TypeScript recognizes global.mongooseCache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Retrieve the existing cache from the global object or initialize a fresh cache
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes and returns a shared, serverless-safe Mongoose database connection.
 * Safe to call repeatedly in any route, middleware, script, or serverless function.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = env.MONGODB_URI;

  if (!uri) {
    throw new Error("Database connection failed: MONGODB_URI environment variable is missing.");
  }

  // 1. If connection already exists and is healthy (readyState 1 = connected), return it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If a connection handshake is currently in flight, await that existing promise
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable Mongoose buffering to catch connection drops immediately
      maxPoolSize: 10, // Conservative pool size suited for serverless multiplexing
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((error) => {
        // Reset promise on failure so subsequent requests can retry
        cached.promise = null;
        console.error("MongoDB connection handshake failed:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnects cleanly from MongoDB.
 * Primarily used by test suites, seed scripts, and graceful shutdown handlers.
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

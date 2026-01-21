import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI or DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Connection pool configuration to prevent exhausting MongoDB Atlas limits
    // For serverless environments (Vercel, AWS Lambda), use smaller pools (10-20)
    // For traditional servers, you can use larger pools (50-100)
    // This limits connections per instance, preventing connection exhaustion
    const maxPoolSize = process.env.MONGODB_MAX_POOL_SIZE
      ? Number.parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10)
      : 10 // Default to 10 for serverless-friendly configuration

    const minPoolSize = process.env.MONGODB_MIN_POOL_SIZE
      ? Number.parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10)
      : 1

    const opts = {
      bufferCommands: false,
      // Limit the maximum number of connections in the pool
      // This prevents a single instance from consuming too many connections
      maxPoolSize,
      // Minimum number of connections to maintain
      minPoolSize,
      // Connection timeout settings
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45_000, // How long to wait for a socket operation
      connectTimeoutMS: 10_000, // How long to wait for initial connection
      // Enable connection monitoring
      heartbeatFrequencyMS: 10_000, // How often to check server status
    }

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log(
          `Database connected successfully (pool: ${minPoolSize}-${maxPoolSize} connections)`
        )
        return mongoose
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB

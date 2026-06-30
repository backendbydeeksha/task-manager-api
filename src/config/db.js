const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from the environment.
 * Throws an error (instead of silently failing) so server.js can
 * catch it, log a clear message, and exit rather than running without a DB.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    // This is a configuration mistake, not a network error — fail fast with a clear message
    throw new Error(
      'MONGO_URI is not defined. Create a .env file from .env.example and add your connection string.'
    );
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;

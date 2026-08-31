const mongoose = require('mongoose');

let memoryServer = null;
let fallbackAttempted = false;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('Using in-memory MongoDB for development');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (!fallbackAttempted && process.env.USE_MEMORY_DB !== 'true') {
      fallbackAttempted = true;
      console.warn('Local MongoDB unavailable, falling back to in-memory database...');
      process.env.USE_MEMORY_DB = 'true';
      return connectDB();
    }
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

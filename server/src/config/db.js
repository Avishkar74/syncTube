// Database connection helper (placeholder)
// Replace with real mongoose connection if using MongoDB.

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/synctube';
  // e.g., using mongoose:
  // const mongoose = require('mongoose');
  // await mongoose.connect(uri);
  return { uri };
}

module.exports = { connectDB };

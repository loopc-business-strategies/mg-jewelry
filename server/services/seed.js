const path = require('path');
if (!process.env.RAILWAY_ENVIRONMENT && !process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}
const connectDB = require('../config/db');
const Product = require('../models/Product');
const { seedDatabase } = require('./seedDatabase');

const seed = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

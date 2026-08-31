const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');
const seedRunner = require('./seedRunner');
const { adminEmail, adminPassword } = require('../config/env');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Settings.deleteMany({}),
    Blog.deleteMany({}),
  ]);

  await seedRunner();

  console.log('Database seeded successfully!');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

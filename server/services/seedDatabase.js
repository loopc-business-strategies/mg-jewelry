const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');
const seedRunner = require('./seedRunner');
const { adminEmail, adminPassword } = require('../config/env');

async function wipeDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Settings.deleteMany({}),
    Blog.deleteMany({}),
  ]);
}

async function seedDatabase() {
  await wipeDatabase();
  await seedRunner();
  console.log('Database seeded successfully!');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

async function needsLegacyReseed() {
  const legacyProduct = await Product.findOne({ sku: /^AG-/ }).select('_id').lean();
  return Boolean(legacyProduct);
}

module.exports = { seedDatabase, wipeDatabase, needsLegacyReseed };

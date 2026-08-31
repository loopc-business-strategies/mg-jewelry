const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');
const seedRunner = require('./seedRunner');
const { adminEmail, adminPassword } = require('../config/env');
const { getProductImages, getCategoryImage } = require('../config/productImages');

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

async function needsBrokenImageFix() {
  const remoteProduct = await Product.findOne({
    images: { $elemMatch: { $not: { $regex: '^/images/products/' } } },
  }).select('_id').lean();
  if (remoteProduct) return true;

  const remoteCategory = await Category.findOne({
    image: { $not: { $regex: '^/images/products/' } },
  }).select('_id').lean();
  if (remoteCategory) return true;

  const remoteBlog = await Blog.findOne({
    image: { $not: { $regex: '^/images/products/' } },
  }).select('_id').lean();
  if (remoteBlog) return true;

  return false;
}

async function fixBrokenImages() {
  const products = await Product.find({});
  let productUpdates = 0;

  for (const product of products) {
    const needsFix = !product.images?.length || product.images.some((url) => !url?.startsWith('/images/products/'));
    if (needsFix) {
      product.images = getProductImages(product.category, product.subcategory);
      await product.save();
      productUpdates += 1;
    }
  }

  const categories = await Category.find({});
  let categoryUpdates = 0;

  for (const category of categories) {
    if (!category.image?.startsWith('/images/products/')) {
      category.image = getCategoryImage(category.slug);
      await category.save();
      categoryUpdates += 1;
    }
  }

  const blogs = await Blog.find({});
  let blogUpdates = 0;

  for (const blog of blogs) {
    if (!blog.image?.startsWith('/images/products/')) {
      blog.image = getCategoryImage('rings');
      await blog.save();
      blogUpdates += 1;
    }
  }

  console.log(`Fixed product images: ${productUpdates}, categories: ${categoryUpdates}, blogs: ${blogUpdates}`);
}

module.exports = {
  seedDatabase,
  wipeDatabase,
  needsLegacyReseed,
  needsBrokenImageFix,
  fixBrokenImages,
};

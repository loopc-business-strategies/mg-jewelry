const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');
const seedRunner = require('./seedRunner');
const { adminEmail, adminPassword } = require('../config/env');
const {
  getProductImages,
  getCategoryImage,
  isSharedPrimaryPath,
} = require('../config/productImages');

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
      product.images = getProductImages(product.category, product.subcategory, product.sku);
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

async function needsDuplicateImageFix() {
  const products = await Product.find({}).select('images sku').lean();
  if (!products.length) return false;

  const primaries = new Map();
  for (const product of products) {
    const primary = product.images?.[0];
    if (!primary) return true;
    if (isSharedPrimaryPath(primary)) return true;
    if (!primary.includes('/images/products/product-')) return true;
    if (primaries.has(primary)) return true;
    primaries.set(primary, product.sku);
  }

  return false;
}

async function fixDuplicateImages() {
  const products = await Product.find({});
  let updates = 0;

  for (const product of products) {
    const nextImages = getProductImages(product.category, product.subcategory, product.sku);
    const same =
      product.images?.length === nextImages.length &&
      product.images.every((url, i) => url === nextImages[i]);

    if (!same) {
      product.images = nextImages;
      await product.save();
      updates += 1;
    }
  }

  console.log(`Reassigned unique product images: ${updates}`);
}

module.exports = {
  seedDatabase,
  wipeDatabase,
  needsLegacyReseed,
  needsBrokenImageFix,
  fixBrokenImages,
  needsDuplicateImageFix,
  fixDuplicateImages,
};

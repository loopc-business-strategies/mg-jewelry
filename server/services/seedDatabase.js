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
  isLegacyImagePath,
  isJewelryStockUrl,
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
  const products = await Product.find({}).select('images').lean();
  for (const product of products) {
    if (!product.images?.length || product.images.some((url) => !isJewelryStockUrl(url))) {
      return true;
    }
  }

  const categories = await Category.find({}).select('image').lean();
  for (const category of categories) {
    if (!isJewelryStockUrl(category.image)) return true;
  }

  const blogs = await Blog.find({}).select('image').lean();
  for (const blog of blogs) {
    if (!isJewelryStockUrl(blog.image)) return true;
  }

  return false;
}

async function fixBrokenImages() {
  const products = await Product.find({});
  let productUpdates = 0;

  for (const product of products) {
    const needsFix = !product.images?.length || product.images.some((url) => !isJewelryStockUrl(url));
    if (needsFix) {
      product.images = getProductImages(product.category, product.subcategory, product.sku);
      await product.save();
      productUpdates += 1;
    }
  }

  const categories = await Category.find({});
  let categoryUpdates = 0;

  for (const category of categories) {
    if (!isJewelryStockUrl(category.image)) {
      category.image = getCategoryImage(category.slug);
      await category.save();
      categoryUpdates += 1;
    }
  }

  const blogs = await Blog.find({});
  let blogUpdates = 0;

  for (const blog of blogs) {
    if (!isJewelryStockUrl(blog.image)) {
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
    if (isLegacyImagePath(primary)) return true;
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

async function needsCategoryEditorialFix() {
  const legacyCategory = await Category.findOne({
    image: { $regex: '^/images/(products|categories)/' },
  }).select('_id').lean();
  return Boolean(legacyCategory);
}

async function fixCategoryEditorialImages() {
  const categories = await Category.find({});
  let updates = 0;

  for (const category of categories) {
    const nextImage = getCategoryImage(category.slug);
    if (category.image !== nextImage) {
      category.image = nextImage;
      await category.save();
      updates += 1;
    }
  }

  console.log(`Updated category editorial images: ${updates}`);
}

async function needsJewelryImageFix() {
  const products = await Product.find({}).select('images').lean();
  for (const product of products) {
    if (!product.images?.length || product.images.some(isLegacyImagePath)) return true;
  }

  const categories = await Category.find({}).select('image').lean();
  for (const category of categories) {
    if (isLegacyImagePath(category.image)) return true;
  }

  const blogs = await Blog.find({}).select('image').lean();
  for (const blog of blogs) {
    if (isLegacyImagePath(blog.image)) return true;
  }

  return false;
}

async function fixJewelryImages() {
  const products = await Product.find({});
  let productUpdates = 0;

  for (const product of products) {
    const needsFix = !product.images?.length || product.images.some(isLegacyImagePath);
    if (needsFix) {
      product.images = getProductImages(product.category, product.subcategory, product.sku);
      await product.save();
      productUpdates += 1;
    }
  }

  const categories = await Category.find({});
  let categoryUpdates = 0;

  for (const category of categories) {
    if (isLegacyImagePath(category.image)) {
      category.image = getCategoryImage(category.slug);
      await category.save();
      categoryUpdates += 1;
    }
  }

  const blogs = await Blog.find({});
  let blogUpdates = 0;

  for (const blog of blogs) {
    if (isLegacyImagePath(blog.image)) {
      blog.image = getCategoryImage('rings');
      await blog.save();
      blogUpdates += 1;
    }
  }

  console.log(`Fixed jewelry images: ${productUpdates} products, ${categoryUpdates} categories, ${blogUpdates} blogs`);
}

module.exports = {
  seedDatabase,
  wipeDatabase,
  needsLegacyReseed,
  needsBrokenImageFix,
  fixBrokenImages,
  needsDuplicateImageFix,
  fixDuplicateImages,
  needsCategoryEditorialFix,
  fixCategoryEditorialImages,
  needsJewelryImageFix,
  fixJewelryImages,
};

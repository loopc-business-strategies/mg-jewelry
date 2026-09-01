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
  isCatalogProductImagePath,
  isValidProductImagePath,
  CHAIN_CATALOG,
  BANGLE_CATALOG,
} = require('../config/productImages');

function isValidStoredProductImage(url) {
  return isValidProductImagePath(url);
}

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
    if (!product.images?.length || product.images.some((url) => !isValidStoredProductImage(url))) {
      return true;
    }
  }

  const categories = await Category.find({}).select('image').lean();
  for (const category of categories) {
    if (!isValidStoredProductImage(category.image)) return true;
  }

  const blogs = await Blog.find({}).select('image').lean();
  for (const blog of blogs) {
    if (!isValidStoredProductImage(blog.image) && isLegacyImagePath(blog.image)) return true;
  }

  return false;
}

async function fixBrokenImages() {
  const products = await Product.find({});
  let productUpdates = 0;

  for (const product of products) {
    const needsFix = !product.images?.length || product.images.some((url) => !isValidStoredProductImage(url));
    if (needsFix) {
      product.images = getProductImages(product.category, product.subcategory, product.sku);
      await product.save();
      productUpdates += 1;
    }
  }

  const categories = await Category.find({});
  let categoryUpdates = 0;

  for (const category of categories) {
    if (!isValidStoredProductImage(category.image)) {
      category.image = getCategoryImage(category.slug);
      await category.save();
      categoryUpdates += 1;
    }
  }

  const blogs = await Blog.find({});
  let blogUpdates = 0;

  for (const blog of blogs) {
    if (isLegacyImagePath(blog.image)) {
      blog.image = getCategoryImage('chains');
      await blog.save();
      blogUpdates += 1;
    }
  }

  console.log(`Fixed product images: ${productUpdates}, categories: ${categoryUpdates}, blogs: ${blogUpdates}`);
}

async function needsCatalogImageMigration() {
  const products = await Product.find({}).select('images category sku').lean();
  if (!products.length) return false;

  const primaries = new Set();
  for (const product of products) {
    const primary = product.images?.[0];
    if (!isCatalogProductImagePath(primary)) return true;
    if (primaries.has(primary)) return true;
    primaries.add(primary);
  }

  const chainProducts = products
    .filter((product) => product.category === 'chains')
    .sort((a, b) => a.sku.localeCompare(b.sku));
  for (let i = 0; i < chainProducts.length; i += 1) {
    if (chainProducts[i].images?.[0] !== CHAIN_CATALOG[i % CHAIN_CATALOG.length]) return true;
  }

  const bangleProducts = products
    .filter((product) => product.category === 'bangles')
    .sort((a, b) => a.sku.localeCompare(b.sku));
  for (let i = 0; i < bangleProducts.length; i += 1) {
    if (bangleProducts[i].images?.[0] !== BANGLE_CATALOG[i % BANGLE_CATALOG.length]) return true;
  }

  const categories = await Category.find({}).select('image slug').lean();
  for (const category of categories) {
    const expected = getCategoryImage(category.slug);
    if (!isCatalogProductImagePath(category.image) || category.image !== expected) return true;
  }

  return false;
}

async function migrateToCatalogImages() {
  let productUpdates = 0;

  const chainProducts = await Product.find({ category: 'chains' }).sort({ sku: 1 });
  for (let i = 0; i < chainProducts.length; i += 1) {
    const nextImages = [CHAIN_CATALOG[i % CHAIN_CATALOG.length]];
    const same =
      chainProducts[i].images?.length === nextImages.length &&
      chainProducts[i].images.every((url, idx) => url === nextImages[idx]);
    if (!same) {
      chainProducts[i].images = nextImages;
      await chainProducts[i].save();
      productUpdates += 1;
    }
  }

  const bangleProducts = await Product.find({ category: 'bangles' }).sort({ sku: 1 });
  for (let i = 0; i < bangleProducts.length; i += 1) {
    const nextImages = [BANGLE_CATALOG[i % BANGLE_CATALOG.length]];
    const same =
      bangleProducts[i].images?.length === nextImages.length &&
      bangleProducts[i].images.every((url, idx) => url === nextImages[idx]);
    if (!same) {
      bangleProducts[i].images = nextImages;
      await bangleProducts[i].save();
      productUpdates += 1;
    }
  }

  const categories = await Category.find({});
  let categoryUpdates = 0;

  for (const category of categories) {
    const nextImage = getCategoryImage(category.slug);
    if (category.image !== nextImage) {
      category.image = nextImage;
      await category.save();
      categoryUpdates += 1;
    }
  }

  console.log(`Migrated to catalogue images: ${productUpdates} products, ${categoryUpdates} categories`);
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
      blog.image = getCategoryImage('chains');
      await blog.save();
      blogUpdates += 1;
    }
  }

  console.log(`Fixed jewelry images: ${productUpdates} products, ${categoryUpdates} categories, ${blogUpdates} blogs`);
}

const ALLOWED_CATALOG_SLUGS = ['chains', 'bangles'];

async function needsChainsBanglesCatalogFix() {
  const legacyCategory = await Category.findOne({ slug: { $nin: ALLOWED_CATALOG_SLUGS } }).select('_id').lean();
  if (legacyCategory) return true;

  const legacyProduct = await Product.findOne({ category: { $nin: ALLOWED_CATALOG_SLUGS } }).select('_id').lean();
  if (legacyProduct) return true;

  const chainCount = await Category.countDocuments({ slug: 'chains' });
  const bangleCount = await Category.countDocuments({ slug: 'bangles' });
  if (chainCount === 0 || bangleCount === 0) return true;

  return false;
}

async function migrateToChainsBanglesCatalog() {
  const { getCategoriesData, buildProducts, getBlogPosts } = require('./seedRunner');
  const { getCategoryImage } = require('../config/productImages');

  await Category.deleteMany({ slug: { $nin: ALLOWED_CATALOG_SLUGS } });
  await Product.deleteMany({});

  const categoriesData = getCategoriesData();
  for (const [i, c] of categoriesData.entries()) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      {
        ...c,
        image: getCategoryImage(c.slug),
        order: i,
        seoTitle: `${c.name} | Modern Gold Jewelry Manufacturer`,
        seoDescription: c.seoContent,
      },
      { upsert: true, new: true }
    );
  }

  await Product.insertMany(buildProducts());

  const blogPosts = getBlogPosts();
  const blogs = await Blog.find({});
  for (let i = 0; i < blogs.length; i += 1) {
    const post = blogPosts[i % blogPosts.length];
    blogs[i].title = post.title;
    blogs[i].slug = post.slug;
    blogs[i].excerpt = post.excerpt;
    blogs[i].content = post.content;
    blogs[i].category = post.category;
    blogs[i].image = post.image;
    await blogs[i].save();
  }

  console.log('Migrated catalog to chains and bangles only');
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
  needsCatalogImageMigration,
  migrateToCatalogImages,
  needsChainsBanglesCatalogFix,
  migrateToChainsBanglesCatalog,
};

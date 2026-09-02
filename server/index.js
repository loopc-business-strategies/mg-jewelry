const path = require('path');
if (!process.env.RAILWAY_ENVIRONMENT && !process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const { validateEnv } = require('./config/validateEnv');
validateEnv();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { corsOrigins, port } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { couponCartRoutes, couponAdminRoutes } = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wholesaleRoutes = require('./routes/wholesaleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const contentRoutes = require('./routes/contentRoutes');
const goldBuyingRoutes = require('./routes/goldBuyingRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

connectDB().then(async () => {
  const Product = require('./models/Product');
  const {
    seedDatabase,
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
  } = require('./services/seedDatabase');
  const count = await Product.countDocuments();
  const forceReseed = process.env.FORCE_RESEED === 'true';

  if (count === 0) {
    console.log('Empty database detected — running seed...');
    await seedDatabase();
  } else if (forceReseed || await needsLegacyReseed()) {
    console.log(forceReseed ? 'FORCE_RESEED enabled — reseeding database...' : 'Legacy catalog detected — reseeding database...');
    await seedDatabase();
  } else if (await needsChainsBanglesCatalogFix()) {
    console.log('Legacy catalog detected — migrating to chains and bangles...');
    await migrateToChainsBanglesCatalog();
  } else if (await needsJewelryImageFix()) {
    console.log('Legacy or non-jewelry images detected — migrating to jewelry stock photos...');
    await fixJewelryImages();
  } else if (await needsCatalogImageMigration()) {
    console.log('Migrating product images to local catalogue assets...');
    await migrateToCatalogImages();
  } else if (await needsBrokenImageFix()) {
    console.log('Broken product images detected — patching catalog...');
    await fixBrokenImages();
  } else if (await needsDuplicateImageFix()) {
    console.log('Duplicate product images detected — reassigning unique photos...');
    await fixDuplicateImages();
  } else if (await needsCategoryEditorialFix()) {
    console.log('Legacy category images detected — migrating to editorial photography...');
    await fixCategoryEditorialImages();
  }
});

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

app.use('/api/webhooks', webhookRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: dbState === 1 ? 'ok' : 'degraded',
    db: dbState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cart', couponCartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/gold-buying', goldBuyingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/coupons', couponAdminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', contentRoutes);
app.use('/api', newsletterRoutes);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const shutdown = () => {
  server.close(() => {
    mongoose.connection.close(false).then(() => process.exit(0));
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

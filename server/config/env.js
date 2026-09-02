const path = require('path');
const { isProduction } = require('./validateEnv');

if (!process.env.RAILWAY_ENVIRONMENT && !process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const parseOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map((o) => o.trim());
  }
  const url = process.env.CLIENT_URL || 'http://localhost:5173';
  return [url];
};

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (isProduction) {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev_secret_change_me';
};

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: getJwtSecret(),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: parseOrigins(),
  wholesalePriceVisibility: process.env.WHOLESALE_PRICE_VISIBILITY || 'approved_only',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@moderngoldjewelry.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'changeme',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

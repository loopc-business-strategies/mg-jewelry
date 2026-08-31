require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const parseOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map((o) => o.trim());
  }
  const url = process.env.CLIENT_URL || 'http://localhost:5173';
  return [url];
};

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: parseOrigins(),
  wholesalePriceVisibility: process.env.WHOLESALE_PRICE_VISIBILITY || 'approved_only',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@aurumgrove.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'changeme',
};

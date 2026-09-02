const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);

const validateEnv = () => {
  const errors = [];

  if (isProduction && !process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is required in production');
  }

  if (isProduction && !process.env.MONGODB_URI && process.env.USE_MEMORY_DB !== 'true') {
    errors.push('MONGODB_URI is required in production');
  }

  if (errors.length) {
    console.error('Environment validation failed:');
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
};

module.exports = { validateEnv, isProduction };

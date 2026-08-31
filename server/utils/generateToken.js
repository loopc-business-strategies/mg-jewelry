const generateToken = (id) => {
  const jwt = require('jsonwebtoken');
  const { jwtSecret } = require('../config/env');
  return jwt.sign({ id }, jwtSecret, { expiresIn: '30d' });
};

module.exports = generateToken;

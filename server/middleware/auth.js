const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const { jwtSecret } = require('../config/env');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      req.user = null;
    }
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && ['admin', 'super_admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const wholesaleOnly = async (req, res, next) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
  if (!wholesale) {
    return res.status(403).json({ message: 'Wholesale account required' });
  }
  req.wholesaleCustomer = wholesale;
  next();
};

const wholesaleApproved = async (req, res, next) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
  if (!wholesale || wholesale.status !== 'approved') {
    return res.status(403).json({ message: 'Approved wholesale account required' });
  }
  req.wholesaleCustomer = wholesale;
  next();
};

module.exports = { protect, optionalAuth, adminOnly, wholesaleOnly, wholesaleApproved };

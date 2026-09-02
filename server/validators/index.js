const { body, param, query } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').isEmail().withMessage('Valid email required'),
];

const resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const orderRules = [
  body('shippingAddress.name').trim().notEmpty().withMessage('Name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').optional().isIn(['upi', 'credit_card', 'debit_card', 'net_banking', 'cod', 'stripe']),
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
];

const couponRules = [
  body('code').trim().notEmpty().withMessage('Coupon code required'),
];

const newsletterRules = [
  body('email').isEmail().withMessage('Valid email required'),
];

const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID'),
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  orderRules,
  reviewRules,
  couponRules,
  newsletterRules,
  mongoIdParam,
};

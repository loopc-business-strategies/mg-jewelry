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

const ENQUIRY_TYPES = [
  'Sell Gold',
  'Buy Gold / Jewellery',
  'Wholesale / Bulk Order',
  'Custom Jewellery',
  'Partnership',
  'Other',
];

const enquiryRules = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 120 }),
  body('company').optional({ values: 'falsy' }).trim().isLength({ max: 160 }),
  body('email').trim().isEmail().withMessage('Valid email required').isLength({ max: 200 }),
  body('phone').trim().matches(/^[0-9+()\-.\s]{5,40}$/).withMessage('Valid phone number required'),
  body('enquiryType').isIn(ENQUIRY_TYPES).withMessage('Please select an enquiry type'),
  body('requirement').trim().notEmpty().withMessage('Requirement is required').isLength({ max: 1000 }),
  body('message').optional({ values: 'falsy' }).trim().isLength({ max: 3000 }),
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
  enquiryRules,
};

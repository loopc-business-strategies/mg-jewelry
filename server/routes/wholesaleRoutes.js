const express = require('express');
const {
  registerWholesale, getWholesaleProfile, getWholesaleProducts,
  getWholesaleCart, addToWholesaleCart, createWholesaleOrder,
  submitInquiry, getWholesaleOrders,
} = require('../controllers/wholesaleController');
const { protect, optionalAuth, wholesaleApproved } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerWholesale);
router.post('/inquiry', submitInquiry);
router.get('/products', optionalAuth, getWholesaleProducts);
router.get('/profile', protect, getWholesaleProfile);
router.get('/cart', protect, wholesaleApproved, getWholesaleCart);
router.post('/cart', protect, wholesaleApproved, addToWholesaleCart);
router.post('/orders', protect, wholesaleApproved, createWholesaleOrder);
router.get('/orders', protect, wholesaleApproved, getWholesaleOrders);

module.exports = router;

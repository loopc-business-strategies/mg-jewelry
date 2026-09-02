const express = require('express');
const {
  createOrder, getMyOrders, getOrderById, trackOrder, confirmPayment,
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { orderRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.get('/track', trackOrder);
router.post('/', optionalAuth, orderRules, validate, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, mongoIdParam, validate, getOrderById);
router.post('/:id/confirm-payment', protect, mongoIdParam, validate, confirmPayment);

module.exports = router;

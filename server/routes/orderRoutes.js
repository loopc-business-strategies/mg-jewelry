const express = require('express');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { buildItemsFromCart, buildOrderItems, calculateTotals } = require('../services/orderService');
const { reserveStock, confirmStock, releaseStock } = require('../services/inventoryService');
const { createPaymentIntent } = require('../services/stripeService');
const { sendOrderConfirmation } = require('../services/emailService');
const { logAction } = require('../services/auditService');
const { isAdminRole } = require('../middleware/permissions');
const ApiError = require('../utils/ApiError');

const addStatusHistory = (order, to, userId, note) => {
  order.statusHistory.push({
    from: order.status,
    to,
    changedBy: userId,
    note,
    at: new Date(),
  });
  order.status = to;
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, isGuest, guestEmail, guestPhone } = req.body;
    let orderItems = items;
    const cart = req.user ? await Cart.findOne({ userId: req.user._id }) : null;
    const couponCode = cart?.couponCode;

    if (!orderItems?.length) {
      if (!req.user) throw new ApiError('Cart is empty', 400, 'EMPTY_CART');
      orderItems = await buildItemsFromCart(req.user._id);
    } else {
      orderItems = await buildOrderItems(orderItems);
    }

    const totals = await calculateTotals(orderItems, couponCode);
    const isCod = paymentMethod === 'cod';
    const initialStatus = isCod ? 'confirmed' : 'pending_payment';

    const order = await Order.create({
      userId: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: isCod ? 'pending' : 'pending',
      status: initialStatus,
      isGuest: isGuest || !req.user,
      guestEmail: guestEmail || shippingAddress?.email,
      guestPhone: guestPhone || shippingAddress?.phone,
      ...totals,
      statusHistory: [{ from: null, to: initialStatus, note: 'Order created', at: new Date() }],
    });

    await reserveStock(orderItems, order._id);

    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    if (isCod) {
      await confirmStock(orderItems, order._id);
      order.paymentStatus = 'pending';
      await order.save();
      const email = req.user?.email || shippingAddress?.email;
      if (email) await sendOrderConfirmation(email, order);
      if (req.user) await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], couponCode: null });
      return res.status(201).json({ success: true, data: order });
    }

    if (req.user) await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], couponCode: null });

    let paymentIntent = null;
    try {
      paymentIntent = await createPaymentIntent({
        amount: totals.total,
        currency: 'inr',
        metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
      });
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save();
    } catch {
      await releaseStock(orderItems, order._id);
      order.status = 'payment_failed';
      await order.save();
      throw new ApiError('Payment gateway unavailable. Try COD or configure Stripe.', 503, 'PAYMENT_UNAVAILABLE');
    }

    res.status(201).json({
      success: true,
      data: {
        order,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404, 'NOT_FOUND');
    const isOwner = req.user && order.userId?.toString() === req.user._id.toString();
    const isAdmin = req.user && isAdminRole(req.user.role);
    if (!isOwner && !isAdmin) throw new ApiError('Not authorized', 403, 'FORBIDDEN');
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.query;
    if (!orderNumber || !email) throw new ApiError('Order number and email required', 400, 'VALIDATION_ERROR');
    const order = await Order.findOne({
      orderNumber,
      $or: [{ guestEmail: email }, { 'shippingAddress.email': email }],
    });
    if (!order) throw new ApiError('Order not found', 404, 'NOT_FOUND');
    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        trackingUrl: order.trackingUrl,
        awbNumber: order.awbNumber,
        courier: order.courier,
        estimatedDelivery: order.estimatedDelivery,
        statusHistory: order.statusHistory,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404, 'NOT_FOUND');
    if (order.userId?.toString() !== req.user._id.toString()) throw new ApiError('Not authorized', 403, 'FORBIDDEN');
    if (order.paymentStatus === 'paid') return res.json({ success: true, data: order });

    addStatusHistory(order, 'paid', req.user._id, 'Payment confirmed');
    order.paymentStatus = 'paid';
    await confirmStock(order.items, order._id);
    await order.save();

    const email = req.user.email || order.shippingAddress?.email;
    if (email) await sendOrderConfirmation(email, order);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, trackOrder, confirmPayment };

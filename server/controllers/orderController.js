const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, isGuest, guestEmail, guestPhone } = req.body;

  let orderItems = items;
  if (!orderItems && req.user) {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      sku: item.productId.sku,
      image: item.productId.images?.[0],
      quantity: item.quantity,
      size: item.size,
      price: item.productId.price,
      mrp: item.productId.mrp,
    }));
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = orderItems.reduce(
    (sum, item) => sum + (item.mrp - item.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  const order = await Order.create({
    userId: req.user?._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    isGuest: isGuest || !req.user,
    guestEmail,
    guestPhone,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    status: 'confirmed',
  });

  if (req.user) {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
  }

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user && order.userId?.toString() !== req.user._id.toString() && !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
};

module.exports = { createOrder, getMyOrders, getOrderById };

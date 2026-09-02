const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const { calculateTotals } = require('../services/orderService');
const ApiError = require('../utils/ApiError');

const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
};

const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) throw new ApiError('Coupon not found', 404, 'NOT_FOUND');
    res.json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError('Coupon not found', 404, 'NOT_FOUND');
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart?.items?.length) throw new ApiError('Cart is empty', 400, 'EMPTY_CART');

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      sku: item.productId.sku,
      quantity: item.quantity,
      price: item.productId.price,
      mrp: item.productId.mrp,
    }));

    const totals = await calculateTotals(orderItems, code);
    cart.couponCode = code.toUpperCase();
    await cart.save();

    res.json({ success: true, data: totals });
  } catch (err) {
    next(err);
  }
};

const removeCoupon = async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { couponCode: null });
  res.json({ success: true, message: 'Coupon removed' });
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, applyCoupon, removeCoupon };

const Settings = require('../models/Settings');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { calculateGoldPrice } = require('./goldPricingService');
const { getAvailableStock } = require('./inventoryService');

const getSettings = async () => {
  let settings = await Settings.findOne({ key: 'site' });
  if (!settings) {
    settings = await Settings.create({ key: 'site' });
  }
  return settings;
};

const buildOrderItems = async (rawItems) => {
  const orderItems = [];
  for (const item of rawItems) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) throw new ApiError('Product unavailable', 400, 'PRODUCT_UNAVAILABLE');
    if (getAvailableStock(product) < item.quantity) throw new ApiError(`Insufficient stock for ${product.name}`, 400, 'INSUFFICIENT_STOCK');
    const pricing = await calculateGoldPrice(product);
    orderItems.push({
      productId: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0],
      quantity: item.quantity,
      size: item.size,
      price: pricing.price,
      mrp: pricing.mrp,
      goldWeight: product.goldWeight,
      purity: product.purity,
    });
  }
  return orderItems;
};

const buildItemsFromCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart?.items?.length) throw new ApiError('Cart is empty', 400, 'EMPTY_CART');
  return buildOrderItems(
    cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      size: item.size,
    }))
  );
};

const calculateTotals = async (orderItems, couponCode = null) => {
  const settings = await getSettings();
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = orderItems.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
  let discount = Math.max(0, mrpTotal - subtotal);
  let couponDiscount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) throw new ApiError('Invalid coupon', 400, 'INVALID_COUPON');
    if (coupon.expiry && coupon.expiry < new Date()) throw new ApiError('Coupon expired', 400, 'COUPON_EXPIRED');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ApiError('Coupon usage limit reached', 400, 'COUPON_LIMIT');
    if (subtotal < (coupon.minOrder || 0)) throw new ApiError(`Minimum order ₹${coupon.minOrder} required`, 400, 'COUPON_MIN_ORDER');
    couponDiscount = coupon.type === 'percentage'
      ? Math.round(subtotal * (coupon.discount / 100))
      : coupon.discount;
    if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    discount += couponDiscount;
  }

  const afterDiscount = subtotal - couponDiscount;
  const shipping = afterDiscount >= (settings.freeShippingThreshold || 5000) ? 0 : 99;
  const tax = Math.round(afterDiscount * ((settings.taxRate || 3) / 100));
  const total = afterDiscount + shipping + tax;

  return { subtotal, discount, couponDiscount, shipping, tax, total, couponCode: couponCode?.toUpperCase() };
};

module.exports = { getSettings, buildOrderItems, buildItemsFromCart, calculateTotals };

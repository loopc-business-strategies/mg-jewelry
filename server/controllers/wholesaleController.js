const Product = require('../models/Product');
const User = require('../models/User');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const WholesaleCart = require('../models/WholesaleCart');
const WholesaleOrder = require('../models/WholesaleOrder');
const WholesaleInquiry = require('../models/WholesaleInquiry');
const { wholesalePriceVisibility } = require('../config/env');
const { getBulkPricingTiers, calculateCartTotals } = require('../services/bulkPricing');
const generateToken = require('../utils/generateToken');

const registerWholesale = async (req, res) => {
  const {
    businessName, ownerName, email, phone, password,
    gstNumber, businessType, businessAddress, city, state, pincode,
    website, expectedMonthlyPurchase, categoriesInterested, country,
  } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: ownerName || businessName,
      email,
      phone,
      password: password || `ws_${Date.now()}`,
      role: 'wholesale_pending',
    });
  } else {
    user.role = 'wholesale_pending';
    await user.save();
  }

  const existing = await WholesaleCustomer.findOne({ userId: user._id });
  if (existing) {
    return res.status(400).json({ message: 'Wholesale application already submitted' });
  }

  const wholesale = await WholesaleCustomer.create({
    userId: user._id,
    businessName,
    ownerName,
    email,
    phone,
    gstNumber,
    businessType,
    businessAddress,
    city,
    state,
    pincode,
    website,
    country,
    expectedMonthlyPurchase,
    categoriesInterested,
    status: 'pending',
  });

  res.status(201).json({
    message: 'Wholesale application submitted. Pending approval.',
    wholesale,
    token: generateToken(user._id),
  });
};

const getWholesaleProfile = async (req, res) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
  res.json(wholesale);
};

const getWholesaleProducts = async (req, res) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user?._id });
  const isApproved = wholesale?.status === 'approved';
  const showPrices = wholesalePriceVisibility !== 'approved_only' || isApproved;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 24;
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const mapped = products.map((p) => ({
    ...p.toObject(),
    wholesalePriceVisible: showPrices,
    displayWholesalePrice: showPrices ? p.wholesalePrice : null,
  }));

  res.json({ products: mapped, isApproved, showPrices });
};

const getWholesaleCart = async (req, res) => {
  let cart = await WholesaleCart.findOne({ wholesaleCustomerId: req.wholesaleCustomer._id })
    .populate('items.productId');
  if (!cart) {
    cart = await WholesaleCart.create({ wholesaleCustomerId: req.wholesaleCustomer._id, items: [] });
  }
  const tiers = await getBulkPricingTiers();
  const totals = calculateCartTotals(cart.items, tiers);
  res.json({ ...cart.toObject(), ...totals });
};

const addToWholesaleCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (quantity < product.moq) {
    return res.status(400).json({ message: `Minimum order quantity is ${product.moq}` });
  }

  let cart = await WholesaleCart.findOne({ wholesaleCustomerId: req.wholesaleCustomer._id });
  if (!cart) cart = await WholesaleCart.create({ wholesaleCustomerId: req.wholesaleCustomer._id, items: [] });

  const existingIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  const tiers = await getBulkPricingTiers();
  const { price, tierLabel } = require('../services/bulkPricing').calculateTierPrice(
    product.wholesalePrice,
    quantity,
    tiers
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity = quantity;
    cart.items[existingIndex].wholesalePrice = product.wholesalePrice;
    cart.items[existingIndex].appliedTierPrice = price;
    cart.items[existingIndex].tierLabel = tierLabel;
  } else {
    cart.items.push({ productId, quantity, wholesalePrice: product.wholesalePrice, appliedTierPrice: price, tierLabel });
  }

  await cart.save();
  cart = await WholesaleCart.findById(cart._id).populate('items.productId');
  const totals = calculateCartTotals(cart.items, tiers);
  res.json({ ...cart.toObject(), ...totals });
};

const createWholesaleOrder = async (req, res) => {
  const cart = await WholesaleCart.findOne({ wholesaleCustomerId: req.wholesaleCustomer._id })
    .populate('items.productId');
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: 'Wholesale cart is empty' });
  }

  const tiers = await getBulkPricingTiers();
  const { items, subtotal, total } = calculateCartTotals(cart.items, tiers);

  const orderItems = items.map((item) => ({
    productId: item.productId._id || item.productId,
    name: item.productId.name,
    sku: item.productId.sku,
    quantity: item.quantity,
    wholesalePrice: item.wholesalePrice,
    appliedTierPrice: item.appliedTierPrice,
    total: item.total,
  }));

  const order = await WholesaleOrder.create({
    wholesaleCustomerId: req.wholesaleCustomer._id,
    items: orderItems,
    shippingAddress: req.body.shippingAddress,
    subtotal,
    total,
    bulkDiscountApplied: subtotal - total,
    status: 'pending',
  });

  await WholesaleCart.findOneAndUpdate({ wholesaleCustomerId: req.wholesaleCustomer._id }, { items: [] });
  res.status(201).json(order);
};

const submitInquiry = async (req, res) => {
  const inquiry = await WholesaleInquiry.create(req.body);
  res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
};

const getWholesaleOrders = async (req, res) => {
  const orders = await WholesaleOrder.find({ wholesaleCustomerId: req.wholesaleCustomer._id })
    .sort({ createdAt: -1 });
  res.json(orders);
};

module.exports = {
  registerWholesale,
  getWholesaleProfile,
  getWholesaleProducts,
  getWholesaleCart,
  addToWholesaleCart,
  createWholesaleOrder,
  submitInquiry,
  getWholesaleOrders,
};

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const WholesaleOrder = require('../models/WholesaleOrder');
const WholesaleInquiry = require('../models/WholesaleInquiry');
const Settings = require('../models/Settings');
const { DEFAULT_TIERS } = require('../services/bulkPricing');

const getDashboard = async (req, res) => {
  const [
    totalOrders,
    totalCustomers,
    wholesaleCustomers,
    pendingWholesale,
    products,
    lowStock,
    b2cOrders,
    wsOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    WholesaleCustomer.countDocuments({ status: 'approved' }),
    WholesaleCustomer.countDocuments({ status: 'pending' }),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 10 } }),
    Order.find().sort({ createdAt: -1 }).limit(5),
    WholesaleOrder.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const b2cRevenue = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const wsRevenue = await WholesaleOrder.aggregate([
    { $match: { status: { $nin: ['cancelled'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  res.json({
    stats: {
      totalOrders,
      totalCustomers,
      wholesaleCustomers,
      pendingWholesale,
      products,
      lowStock,
      b2cRevenue: b2cRevenue[0]?.total || 0,
      wholesaleRevenue: wsRevenue[0]?.total || 0,
      totalRevenue: (b2cRevenue[0]?.total || 0) + (wsRevenue[0]?.total || 0),
    },
    recentB2COrders: b2cOrders,
    recentWholesaleOrders: wsOrders,
  });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

const getWholesaleApplications = async (req, res) => {
  const applications = await WholesaleCustomer.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
  res.json(applications);
};

const approveWholesale = async (req, res) => {
  const wholesale = await WholesaleCustomer.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', approvedAt: new Date() },
    { new: true }
  );
  if (wholesale) {
    await User.findByIdAndUpdate(wholesale.userId, { role: 'wholesale_customer' });
    res.json(wholesale);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

const rejectWholesale = async (req, res) => {
  const wholesale = await WholesaleCustomer.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', rejectedReason: req.body.reason },
    { new: true }
  );
  if (wholesale) {
    await User.findByIdAndUpdate(wholesale.userId, { role: 'customer' });
    res.json(wholesale);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

const suspendWholesale = async (req, res) => {
  const wholesale = await WholesaleCustomer.findByIdAndUpdate(
    req.params.id,
    { status: 'suspended' },
    { new: true }
  );
  if (wholesale) {
    await User.findByIdAndUpdate(wholesale.userId, { role: 'wholesale_pending' });
    res.json(wholesale);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

const getWholesaleOrders = async (req, res) => {
  const orders = await WholesaleOrder.find()
    .populate('wholesaleCustomerId')
    .sort({ createdAt: -1 });
  res.json(orders);
};

const updateWholesaleOrderStatus = async (req, res) => {
  const order = await WholesaleOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

const getInquiries = async (req, res) => {
  const inquiries = await WholesaleInquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
};

const getBulkPricing = async (req, res) => {
  const settings = await Settings.findOne({ key: 'global' });
  res.json(settings?.bulkPricingTiers || DEFAULT_TIERS);
};

const updateBulkPricing = async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { key: 'global' },
    { bulkPricingTiers: req.body.tiers },
    { upsert: true, new: true }
  );
  res.json(settings.bulkPricingTiers);
};

const getCustomers = async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password');
  res.json(customers);
};

module.exports = {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  getWholesaleApplications,
  approveWholesale,
  rejectWholesale,
  suspendWholesale,
  getWholesaleOrders,
  updateWholesaleOrderStatus,
  getInquiries,
  getBulkPricing,
  updateBulkPricing,
  getCustomers,
};

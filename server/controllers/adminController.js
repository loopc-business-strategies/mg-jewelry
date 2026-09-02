const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const WholesaleOrder = require('../models/WholesaleOrder');
const WholesaleInquiry = require('../models/WholesaleInquiry');
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const { DEFAULT_TIERS } = require('../services/bulkPricing');
const { getGoldRates } = require('../services/goldPricingService');
const { logAction } = require('../services/auditService');
const { generateInvoicePdf } = require('../services/invoiceService');
const { sendEmail } = require('../services/emailService');
const ApiError = require('../utils/ApiError');

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
    charts: await getDashboardCharts(),
  });
};

const getDashboardCharts = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailySales = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $nin: ['cancelled', 'payment_failed'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', name: { $first: '$items.name' }, sold: { $sum: '$items.quantity' } } },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  const b2bCount = await WholesaleOrder.countDocuments();
  const b2cCount = await Order.countDocuments();

  return { dailySales, topProducts, channelSplit: { b2c: b2cCount, b2b: b2bCount } };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
  res.json(orders);
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404, 'NOT_FOUND');
    const prev = order.status;
    order.status = req.body.status;
    order.statusHistory.push({
      from: prev,
      to: req.body.status,
      changedBy: req.user._id,
      note: req.body.note || 'Status updated by admin',
      at: new Date(),
    });
    if (req.body.status === 'shipped') {
      order.courier = req.body.courier || order.courier;
      order.awbNumber = req.body.awbNumber || order.awbNumber;
      order.trackingUrl = req.body.trackingUrl || order.trackingUrl;
      order.estimatedDelivery = req.body.estimatedDelivery || order.estimatedDelivery;
      order.shippedAt = new Date();
      const email = order.shippingAddress?.email || order.guestEmail;
      if (email) {
        await sendEmail({
          to: email,
          subject: `Your order ${order.orderNumber} has shipped`,
          html: `<p>Your order is on its way!</p>${order.trackingUrl ? `<p><a href="${order.trackingUrl}">Track shipment</a></p>` : ''}`,
        });
      }
    }
    if (req.body.status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    await logAction(req.user._id, 'order.status_update', 'Order', order._id, { from: prev, to: req.body.status });
    res.json(order);
  } catch (err) {
    next(err);
  }
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

const getGoldRatesAdmin = async (req, res) => {
  const rates = await getGoldRates();
  res.json(rates);
};

const updateGoldRates = async (req, res, next) => {
  try {
    const GoldRate = require('../models/GoldRate');
    const rates = await GoldRate.findOneAndUpdate({ key: 'gold_rates' }, req.body, { upsert: true, new: true });
    await logAction(req.user._id, 'gold_rates.update', 'GoldRate', rates._id, req.body);
    res.json(rates);
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).populate('userId', 'name email');
  res.json(logs);
};

const deleteDemoProducts = async (req, res) => {
  const result = await Product.deleteMany({ isDemo: true });
  await logAction(req.user._id, 'demo.delete_products', 'Product', null, { deleted: result.deletedCount });
  res.json({ success: true, deleted: result.deletedCount });
};

const deleteDemoData = async (req, res) => {
  const [products, orders] = await Promise.all([
    Product.deleteMany({ isDemo: true }),
    Order.deleteMany({ isDemo: true }),
  ]);
  await logAction(req.user._id, 'demo.delete_all', null, null, { products: products.deletedCount, orders: orders.deletedCount });
  res.json({ success: true, products: products.deletedCount, orders: orders.deletedCount });
};

const downloadInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404, 'NOT_FOUND');
    const pdf = await generateInvoicePdf(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    res.send(pdf);
  } catch (err) {
    next(err);
  }
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
  getGoldRatesAdmin,
  updateGoldRates,
  getAuditLogs,
  deleteDemoProducts,
  deleteDemoData,
  downloadInvoice,
};

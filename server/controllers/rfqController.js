const RFQ = require('../models/RFQ');
const Quote = require('../models/Quote');
const WholesaleCustomer = require('../models/WholesaleCustomer');

exports.createRFQ = async (req, res, next) => {
  try {
    const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
    const rfq = await RFQ.create({
      ...req.body,
      buyerId: wholesale?._id,
      userId: req.user._id,
    });
    res.status(201).json(rfq);
  } catch (err) {
    next(err);
  }
};

exports.getMyRFQs = async (req, res, next) => {
  try {
    const rfqs = await RFQ.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(rfqs);
  } catch (err) {
    next(err);
  }
};

exports.getRFQById = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate('buyerId')
      .populate('assignedSalesperson', 'name email');
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });

    const isOwner = rfq.userId?.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const quotes = await Quote.find({ rfqId: rfq._id });
    res.json({ rfq, quotes });
  } catch (err) {
    next(err);
  }
};

exports.getAllRFQs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const rfqs = await RFQ.find(filter)
      .populate('buyerId', 'businessName email country businessType')
      .populate('assignedSalesperson', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await RFQ.countDocuments(filter);
    res.json({ rfqs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.updateRFQ = async (req, res, next) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    res.json(rfq);
  } catch (err) {
    next(err);
  }
};

exports.createQuote = async (req, res, next) => {
  try {
    const { lineItems, totalAmount, currency, validUntil, message } = req.body;
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });

    const quote = await Quote.create({
      rfqId: rfq._id,
      lineItems,
      totalAmount,
      currency: currency || 'USD',
      validUntil,
      message,
      status: 'SENT',
      createdBy: req.user._id,
    });

    rfq.status = 'QUOTED';
    await rfq.save();

    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

exports.getQuotes = async (req, res, next) => {
  try {
    const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
    if (!wholesale) return res.json([]);

    const rfqIds = (await RFQ.find({ buyerId: wholesale._id }).select('_id')).map((r) => r._id);
    const quotes = await Quote.find({ rfqId: { $in: rfqIds } }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

exports.getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find()
      .populate({ path: 'rfqId', populate: { path: 'buyerId', select: 'businessName email country' } })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

exports.updateQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

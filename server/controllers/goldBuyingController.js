const GoldBuyingLead = require('../models/GoldBuyingLead');

exports.createLead = async (req, res, next) => {
  try {
    const images = req.files?.map((f) => `/uploads/gold-leads/${f.filename}`) || [];
    const lead = await GoldBuyingLead.create({
      ...req.body,
      images,
      statusHistory: [{ status: 'NEW', note: 'Lead submitted' }],
    });
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const leads = await GoldBuyingLead.find(filter)
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await GoldBuyingLead.countDocuments(filter);
    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await GoldBuyingLead.findById(req.params.id).populate('assignedStaff', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await GoldBuyingLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const { status, assignedStaff, adminNotes } = req.body;
    if (status && status !== lead.status) {
      lead.statusHistory.push({
        status,
        note: adminNotes || `Status changed to ${status}`,
        changedBy: req.user._id,
      });
      lead.status = status;
    }
    if (assignedStaff !== undefined) lead.assignedStaff = assignedStaff || null;
    if (adminNotes !== undefined) lead.adminNotes = adminNotes;

    await lead.save();
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

exports.getLeadStats = async (req, res, next) => {
  try {
    const stats = await GoldBuyingLead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

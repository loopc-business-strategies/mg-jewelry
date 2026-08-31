const mongoose = require('mongoose');

const wholesaleInquirySchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: String,
    state: String,
    businessType: String,
    gstNumber: String,
    categoryInterested: String,
    expectedMonthlyQuantity: String,
    message: String,
    status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WholesaleInquiry', wholesaleInquirySchema);

const mongoose = require('mongoose');

const wholesaleCustomerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true },
    ownerName: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstNumber: String,
    businessType: String,
    businessAddress: String,
    city: String,
    state: String,
    pincode: String,
    website: String,
    expectedMonthlyPurchase: String,
    categoriesInterested: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    approvedAt: Date,
    rejectedReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('WholesaleCustomer', wholesaleCustomerSchema);

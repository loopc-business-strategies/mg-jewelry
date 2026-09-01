const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: String,
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const goldBuyingLeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    city: String,
    goldType: String,
    approximateWeight: String,
    estimatedPurity: String,
    description: String,
    images: [String],
    preferredContactMethod: { type: String, enum: ['phone', 'email', 'whatsapp', 'visit'], default: 'phone' },
    preferredAppointmentDate: Date,
    message: String,
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'APPOINTMENT', 'INSPECTION', 'VALUATION', 'QUOTED', 'ACCEPTED', 'COMPLETED', 'REJECTED'],
      default: 'NEW',
    },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminNotes: String,
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoldBuyingLead', goldBuyingLeadSchema);

const mongoose = require('mongoose');

const rfqItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  sku: String,
  quantity: { type: Number, default: 1 },
  purity: String,
  requiredWeight: String,
  size: String,
  notes: String,
}, { _id: false });

const rfqSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'WholesaleCustomer' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [rfqItemSchema],
    targetDeliveryDate: Date,
    destinationCountry: String,
    message: String,
    status: {
      type: String,
      enum: ['NEW', 'UNDER_REVIEW', 'QUOTED', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'CONVERTED_TO_ORDER'],
      default: 'NEW',
    },
    assignedSalesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RFQ', rfqSchema);

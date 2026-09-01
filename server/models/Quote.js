const mongoose = require('mongoose');

const quoteLineItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  sku: String,
  unitPrice: Number,
  quantity: Number,
  total: Number,
  notes: String,
}, { _id: false });

const quoteSchema = new mongoose.Schema(
  {
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    lineItems: [quoteLineItemSchema],
    totalAmount: Number,
    currency: { type: String, default: 'USD' },
    validUntil: Date,
    message: String,
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
      default: 'DRAFT',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);

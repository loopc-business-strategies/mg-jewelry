const mongoose = require('mongoose');

const bulkPricingTierSchema = new mongoose.Schema({
  minQty: Number,
  maxQty: Number,
  discountPercent: Number,
  label: String,
});

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    bulkPricingTiers: [bulkPricingTierSchema],
    wholesalePriceVisibility: { type: String, default: 'approved_only' },
    freeShippingThreshold: { type: Number, default: 5000 },
    taxRate: { type: Number, default: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);

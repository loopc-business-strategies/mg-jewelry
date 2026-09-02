const mongoose = require('mongoose');

const goldRateSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'gold_rates', unique: true },
    rate24k: { type: Number, default: 7500 },
    rate22k: { type: Number, default: 6875 },
    rate21k: { type: Number, default: 6563 },
    rate18k: { type: Number, default: 5625 },
    defaultMakingCharge: { type: Number, default: 1500 },
    defaultWastagePercent: { type: Number, default: 8 },
    defaultTaxPercent: { type: Number, default: 3 },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoldRate', goldRateSchema);

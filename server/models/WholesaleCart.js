const mongoose = require('mongoose');

const wholesaleCartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 10, min: 1 },
  wholesalePrice: Number,
  appliedTierPrice: Number,
  tierLabel: String,
});

const wholesaleCartSchema = new mongoose.Schema(
  {
    wholesaleCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WholesaleCustomer',
      required: true,
      unique: true,
    },
    items: [wholesaleCartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WholesaleCart', wholesaleCartSchema);

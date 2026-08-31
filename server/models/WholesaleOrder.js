const mongoose = require('mongoose');

const wholesaleOrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  sku: String,
  quantity: Number,
  wholesalePrice: Number,
  appliedTierPrice: Number,
  total: Number,
});

const wholesaleOrderSchema = new mongoose.Schema(
  {
    wholesaleCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'WholesaleCustomer', required: true },
    orderNumber: { type: String, unique: true },
    items: [wholesaleOrderItemSchema],
    shippingAddress: {
      businessName: String,
      contactPerson: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    bulkDiscountApplied: { type: Number, default: 0 },
    subtotal: Number,
    total: Number,
    notes: String,
  },
  { timestamps: true }
);

wholesaleOrderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `WS${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

module.exports = mongoose.model('WholesaleOrder', wholesaleOrderSchema);

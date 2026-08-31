const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  sku: String,
  image: String,
  quantity: Number,
  size: String,
  price: Number,
  mrp: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: String,
      phone: String,
      email: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'credit_card', 'debit_card', 'net_banking', 'cod'],
      default: 'cod',
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    subtotal: Number,
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number,
    isGuest: { type: Boolean, default: false },
    guestEmail: String,
    guestPhone: String,
    notes: String,
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `AG${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);

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
  goldWeight: Number,
  purity: String,
});

const statusHistorySchema = new mongoose.Schema({
  from: String,
  to: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  at: { type: Date, default: Date.now },
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
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'credit_card', 'debit_card', 'net_banking', 'cod', 'stripe'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: [
        'pending_payment', 'payment_failed', 'paid', 'pending', 'confirmed',
        'processing', 'quality_check', 'packed', 'shipped', 'delivered',
        'cancelled', 'return_requested', 'returned', 'refund_pending', 'refunded',
      ],
      default: 'pending_payment',
    },
    statusHistory: [statusHistorySchema],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number,
    currency: { type: String, default: 'INR' },
    isGuest: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
    guestEmail: String,
    guestPhone: String,
    notes: String,
    stripePaymentIntentId: String,
    stripeSessionId: String,
    paymentAmount: Number,
    courier: String,
    awbNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `MGJ${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const inventoryHistorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    previousAvailable: Number,
    newAvailable: Number,
    previousReserved: Number,
    newReserved: Number,
    adjustment: Number,
    reason: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

inventoryHistorySchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model('InventoryHistory', inventoryHistorySchema);

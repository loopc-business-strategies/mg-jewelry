const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');

const getAvailableStock = (product) => product.availableStock ?? product.stock ?? 0;

const logHistory = async (productId, prev, next, reason, userId, orderId) => {
  await InventoryHistory.create({
    productId,
    previousAvailable: prev.available,
    newAvailable: next.available,
    previousReserved: prev.reserved,
    newReserved: next.reserved,
    adjustment: next.available - prev.available,
    reason,
    userId,
    orderId,
  });
};

const reserveStock = async (items, orderId, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const available = getAvailableStock(product);
    if (available < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const prev = { available, reserved: product.reservedStock || 0 };
    product.availableStock = available - item.quantity;
    product.reservedStock = (product.reservedStock || 0) + item.quantity;
    product.stock = product.availableStock;
    await product.save({ session });
    await logHistory(product._id, prev, { available: product.availableStock, reserved: product.reservedStock }, 'reserve', null, orderId);
  }
};

const confirmStock = async (items, orderId, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);
    if (!product) continue;
    const prev = { available: getAvailableStock(product), reserved: product.reservedStock || 0 };
    product.reservedStock = Math.max(0, (product.reservedStock || 0) - item.quantity);
    product.soldStock = (product.soldStock || 0) + item.quantity;
    await product.save({ session });
    await logHistory(product._id, prev, { available: getAvailableStock(product), reserved: product.reservedStock }, 'confirm', null, orderId);
  }
};

const releaseStock = async (items, orderId, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.productId).session(session);
    if (!product) continue;
    const prev = { available: getAvailableStock(product), reserved: product.reservedStock || 0 };
    product.availableStock = getAvailableStock(product) + item.quantity;
    product.reservedStock = Math.max(0, (product.reservedStock || 0) - item.quantity);
    product.stock = product.availableStock;
    await product.save({ session });
    await logHistory(product._id, prev, { available: product.availableStock, reserved: product.reservedStock }, 'release', null, orderId);
  }
};

const adjustStock = async (productId, quantity, reason, userId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  const prev = { available: getAvailableStock(product), reserved: product.reservedStock || 0 };
  product.availableStock = getAvailableStock(product) + quantity;
  product.stock = product.availableStock;
  await product.save();
  await logHistory(product._id, prev, { available: product.availableStock, reserved: product.reservedStock }, reason, userId);
  return product;
};

module.exports = { getAvailableStock, reserveStock, confirmStock, releaseStock, adjustStock };

const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }
  res.json(cart);
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });

  const existingIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId && item.size === size
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, size, price: product.price });
  }

  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.productId');
  res.json(cart);
};

const updateCartItem = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.id(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (req.body.quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = req.body.quantity;
  }

  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.productId');
  res.json(updated);
};

const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.productId');
  res.json(updated);
};

const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

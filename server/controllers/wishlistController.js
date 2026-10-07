const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { resolveLang, localizeProduct } = require('../utils/localizeProduct');

function localizeWishlist(wishlist, lang) {
  const doc = wishlist.toObject ? wishlist.toObject() : { ...wishlist };
  return {
    ...doc,
    products: (doc.products || []).map((p) => (p && typeof p === 'object' && p.name ? localizeProduct(p, lang) : p)),
  };
}

const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
  }
  res.json(localizeWishlist(wishlist, resolveLang(req)));
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, products: [] });

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  const updated = await Wishlist.findById(wishlist._id).populate('products');
  res.json(localizeWishlist(updated, resolveLang(req)));
};

const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.id);
  await wishlist.save();
  const updated = await Wishlist.findById(wishlist._id).populate('products');
  res.json(localizeWishlist(updated, resolveLang(req)));
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };

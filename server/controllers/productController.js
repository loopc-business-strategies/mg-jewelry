const Product = require('../models/Product');

const buildProductQuery = (query) => {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.subcategory) filter.subcategory = query.subcategory;
  if (query.gender) filter.gender = query.gender;
  if (query.metal) filter.metal = query.metal;
  if (query.purity) filter.purity = query.purity;
  if (query.occasion) filter.occasion = query.occasion;
  if (query.collection) filter.collection = query.collection;
  if (query.featured === 'true') filter.featured = true;
  if (query.newArrival === 'true') filter.newArrival = true;
  if (query.bestSeller === 'true') filter.bestSeller = true;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.discount === 'true') filter.discount = { $gt: 0 };
  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  if (query.hasDiamond === 'true') filter['diamondDetails.hasDiamond'] = true;
  return filter;
};

const getSortOption = (sort) => {
  switch (sort) {
    case 'newest': return { createdAt: -1 };
    case 'price_asc': return { price: 1 };
    case 'price_desc': return { price: -1 };
    case 'best_selling': return { bestSeller: -1, reviewCount: -1 };
    default: return { featured: -1, createdAt: -1 };
  }
};

const getProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 24;
  const filter = buildProductQuery(req.query);
  const sort = getSortOption(req.query.sort);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
    showing: `${skip + 1}–${Math.min(skip + limit, total)}`,
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) res.json({ message: 'Product removed' });
  else res.status(404).json({ message: 'Product not found' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, buildProductQuery };

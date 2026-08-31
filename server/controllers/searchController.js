const Product = require('../models/Product');

const searchProducts = async (req, res) => {
  const q = req.query.q || '';
  const limit = Number(req.query.limit) || 10;

  if (!q.trim()) {
    return res.json({ products: [], suggestions: [] });
  }

  const filter = {
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { sku: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { subcategory: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { metal: { $regex: q, $options: 'i' } },
    ],
  };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.metal) filter.metal = req.query.metal;
  if (req.query.gender) filter.gender = req.query.gender;

  const products = await Product.find(filter).limit(limit);
  const suggestions = products.slice(0, 5).map((p) => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.images?.[0],
  }));

  res.json({ products, suggestions, total: products.length });
};

module.exports = { searchProducts };

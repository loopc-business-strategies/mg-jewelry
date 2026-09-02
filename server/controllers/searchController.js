const Product = require('../models/Product');
const { getAvailableStock } = require('../services/inventoryService');
const { resolveLang, localizeProduct } = require('../utils/localizeProduct');

const searchProducts = async (req, res) => {
  const q = req.query.q || '';
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const lang = resolveLang(req);

  const filter = { isActive: true };

  if (q.trim()) {
    const regex = { $regex: q, $options: 'i' };
    filter.$or = [
      { name: regex },
      { sku: regex },
      { category: regex },
      { subcategory: regex },
      { tags: regex },
      { metal: regex },
      ...['en', 'ru', 'uz', 'ar', 'tr'].flatMap((code) => [
        { [`translations.${code}.name`]: regex },
        { [`translations.${code}.description`]: regex },
      ]),
    ];
  }

  if (req.query.category) filter.category = req.query.category;
  if (req.query.metal) filter.metal = req.query.metal;
  if (req.query.gender) filter.gender = req.query.gender;
  if (req.query.purity) filter.purity = req.query.purity;
  if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
  if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
  if (req.query.inStock === 'true') filter.availableStock = { $gt: 0 };

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const enriched = products.map((p) => {
    const localized = localizeProduct(p, lang);
    return {
      ...localized,
      stock: getAvailableStock(p),
      inStock: getAvailableStock(p) > 0,
    };
  });

  const suggestions = enriched.slice(0, 5).map((p) => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.images?.[0],
  }));

  res.json({ products: enriched, suggestions, total, page, pages: Math.ceil(total / limit) });
};

module.exports = { searchProducts };

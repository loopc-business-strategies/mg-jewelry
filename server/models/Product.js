const mongoose = require('mongoose');

const diamondDetailsSchema = new mongoose.Schema({
  carat: Number,
  clarity: String,
  color: String,
  cut: String,
  hasDiamond: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subcategory: String,
    description: String,
    shortDescription: String,
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    wholesalePrice: Number,
    moq: { type: Number, default: 10 },
    stock: { type: Number, default: 100 },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'women' },
    metal: { type: String, default: 'Gold' },
    purity: String,
    weight: String,
    diamondDetails: diamondDetailsSchema,
    occasion: [String],
    collection: { type: String, default: '' },
    tags: [String],
    images: [String],
    sizes: [String],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', sku: 'text', tags: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const diamondDetailsSchema = new mongoose.Schema({
  carat: Number,
  clarity: String,
  color: String,
  cut: String,
  hasDiamond: { type: Boolean, default: false },
});

const localeSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    shortDescription: String,
    seoTitle: String,
    seoDescription: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, index: true },
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
    availableStock: Number,
    reservedStock: { type: Number, default: 0 },
    soldStock: { type: Number, default: 0 },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'women' },
    metal: { type: String, default: 'Gold' },
    purity: String,
    weight: String,
    goldWeight: Number,
    makingCharge: Number,
    wastagePercent: Number,
    stoneCharge: { type: Number, default: 0 },
    pricingMode: { type: String, enum: ['fixed', 'dynamic'], default: 'fixed' },
    diamondDetails: diamondDetailsSchema,
    occasion: [String],
    collection: { type: String, default: '' },
    tags: [String],
    images: [String],
    video: String,
    sizes: [String],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false, index: true },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    translations: {
      en: localeSchema,
      ru: localeSchema,
      uz: localeSchema,
      ar: localeSchema,
      tr: localeSchema,
    },
  },
  { timestamps: true }
);

productSchema.pre('save', function () {
  if (this.availableStock == null) this.availableStock = this.stock;
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

productSchema.index({ name: 'text', sku: 'text', tags: 'text', category: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isDemo: 1 });

module.exports = mongoose.model('Product', productSchema);

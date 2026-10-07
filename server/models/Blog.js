const mongoose = require('mongoose');

const blogLocaleSchema = new mongoose.Schema(
  {
    title: String,
    excerpt: String,
    content: String,
    seoTitle: String,
    seoDescription: String,
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    image: String,
    category: {
      type: String,
      enum: [
        'Jewellery Guide',
        'Buying Guide',
        'Gold Jewellery',
        'Diamond Jewellery',
        'Wedding Jewellery',
        'Gift Ideas',
        'Jewellery Care',
        'Fashion Trends',
      ],
    },
    author: String,
    isPublished: { type: Boolean, default: true },
    seoTitle: String,
    seoDescription: String,
    translations: {
      en: blogLocaleSchema,
      ru: blogLocaleSchema,
      uz: blogLocaleSchema,
      ar: blogLocaleSchema,
      tr: blogLocaleSchema,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);

const Product = require('../models/Product');
const Blog = require('../models/Blog');
const {
  TRANSLATED_LANGS,
  buildProductTranslation,
  buildBlogTranslation,
} = require('../data/catalogTranslations');

function missingTranslations(doc, requiredField, build) {
  const set = {};
  for (const lang of TRANSLATED_LANGS) {
    if (doc.translations?.[lang]?.[requiredField]) continue;
    const translation = build(doc, lang);
    if (translation) set[`translations.${lang}`] = translation;
  }
  return set;
}

async function migrateCatalogTranslations() {
  let products = 0;
  let blogs = 0;

  const productDocs = await Product.find({})
    .select('name description shortDescription seoTitle seoDescription translations')
    .lean();
  for (const doc of productDocs) {
    const set = missingTranslations(doc, 'name', buildProductTranslation);
    if (Object.keys(set).length === 0) continue;
    await Product.updateOne({ _id: doc._id }, { $set: set });
    products += 1;
  }

  const blogDocs = await Blog.find({}).select('slug title translations').lean();
  for (const doc of blogDocs) {
    const set = missingTranslations(doc, 'title', buildBlogTranslation);
    if (Object.keys(set).length === 0) continue;
    await Blog.updateOne({ _id: doc._id }, { $set: set });
    blogs += 1;
  }

  return { products, blogs };
}

module.exports = { migrateCatalogTranslations };

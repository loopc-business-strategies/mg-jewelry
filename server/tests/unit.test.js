const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { hasPermission, isAdminRole } = require('../middleware/permissions');
const ApiError = require('../utils/ApiError');

describe('permissions', () => {
  it('super_admin has all permissions', () => {
    assert.equal(hasPermission('super_admin', 'orders'), true);
    assert.equal(hasPermission('super_admin', 'anything'), true);
  });

  it('catalog_manager has product permissions only', () => {
    assert.equal(hasPermission('catalog_manager', 'products'), true);
    assert.equal(hasPermission('catalog_manager', 'orders'), false);
  });

  it('isAdminRole identifies admin roles', () => {
    assert.equal(isAdminRole('admin'), true);
    assert.equal(isAdminRole('customer'), false);
  });
});

describe('ApiError', () => {
  it('creates error with status and code', () => {
    const err = new ApiError('Not found', 404, 'NOT_FOUND');
    assert.equal(err.message, 'Not found');
    assert.equal(err.statusCode, 404);
    assert.equal(err.code, 'NOT_FOUND');
  });
});

describe('catalog translations', () => {
  const {
    TRANSLATED_LANGS, PRODUCT_NAMES, BLOG_POSTS, buildProductTranslation, buildBlogTranslation,
  } = require('../data/catalogTranslations');
  const { localizeProduct, localizeBlog, localizeItemProducts } = require('../utils/localizeProduct');

  const liveProduct = {
    name: 'Rope Chain 22K',
    description: 'The Rope Chain 22K is manufactured at our Namangan facility for international gold and jewellery business partners.',
    shortDescription: 'Professional 22K gold chain — manufactured by Modern Gold for international buyers.',
    seoTitle: 'Rope Chain 22K | Modern Gold',
    seoDescription: 'Rope Chain 22K — 22K gold chains from Modern Gold, Central Asia.',
  };

  it('every product name and blog post has all languages', () => {
    for (const [name, entry] of Object.entries(PRODUCT_NAMES)) {
      for (const lang of TRANSLATED_LANGS) assert.ok(entry[lang], `${name} missing ${lang}`);
    }
    for (const [slug, entry] of Object.entries(BLOG_POSTS)) {
      assert.ok(entry.en.title, `${slug} missing en title`);
      for (const lang of TRANSLATED_LANGS) {
        for (const field of ['title', 'excerpt', 'content']) assert.ok(entry[lang]?.[field], `${slug} missing ${lang}.${field}`);
      }
    }
  });

  it('translates every templated field of a live product', () => {
    for (const lang of TRANSLATED_LANGS) {
      const tr = buildProductTranslation(liveProduct, lang);
      for (const field of ['name', 'description', 'shortDescription', 'seoTitle', 'seoDescription']) {
        assert.ok(tr[field], `${lang}.${field}`);
        assert.ok(!tr[field].includes('Rope Chain'), `${lang}.${field} still has the English name`);
      }
    }
    const seeded = {
      name: 'Heritage Rope Chain',
      description: 'The Heritage Rope Chain is precision-crafted at our Namangan facility for international jewelry partners and discerning customers worldwide.',
      shortDescription: 'Premium Gold chains — manufactured by Modern Gold Jewelry.',
      seoTitle: 'Heritage Rope Chain | Modern Gold Jewelry',
      seoDescription: 'Shop Heritage Rope Chain — premium Gold chains from Modern Gold Jewelry Manufacturing, Uzbekistan.',
    };
    assert.equal(Object.keys(buildProductTranslation(seeded, 'ru')).length, 5);
  });

  it('leaves custom products and edited blog posts alone', () => {
    assert.equal(buildProductTranslation({ ...liveProduct, name: 'Custom Admin Chain' }, 'ru'), null);
    const custom = buildProductTranslation({ ...liveProduct, description: 'Hand-written admin text.' }, 'ru');
    assert.equal(custom.description, undefined);
    assert.equal(buildBlogTranslation({ slug: 'gold-jewellery-care-tips', title: 'Edited title' }, 'ru'), null);
    assert.ok(buildBlogTranslation({ slug: 'gold-jewellery-care-tips', title: 'Gold Jewelry Care Tips' }, 'ar').title);
  });

  it('localizes products, cart items and blog posts', () => {
    const product = { ...liveProduct, _id: 'p1', translations: { ru: buildProductTranslation(liveProduct, 'ru') } };
    assert.equal(localizeProduct(product, 'ru').name, PRODUCT_NAMES['Rope Chain 22K'].ru);
    assert.equal(localizeProduct(product, 'en').name, 'Rope Chain 22K');
    const cart = localizeItemProducts({ items: [{ productId: product, quantity: 1 }, { productId: 'raw-id' }] }, 'ru');
    assert.equal(cart.items[0].productId.name, PRODUCT_NAMES['Rope Chain 22K'].ru);
    assert.equal(cart.items[1].productId, 'raw-id');
    const blog = { slug: 'x', title: 'T', excerpt: 'E', content: 'C', translations: { tr: { title: 'TT', excerpt: 'EE', content: 'CC' } } };
    assert.equal(localizeBlog(blog, 'tr').title, 'TT');
    assert.equal(localizeBlog(blog, 'ru').title, 'T');
    assert.equal(localizeBlog(blog, 'tr').translations, undefined);
  });
});

describe('gold pricing', () => {
  it('returns fixed price for non-dynamic products', async () => {
    const { calculateGoldPrice } = require('../services/goldPricingService');
    const product = { pricingMode: 'fixed', price: 50000, mrp: 55000 };
    const result = await calculateGoldPrice(product);
    assert.equal(result.price, 50000);
    assert.equal(result.mrp, 55000);
    assert.equal(result.breakdown, null);
  });
});

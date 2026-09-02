const SUPPORTED_LANGS = ['en', 'ru', 'uz', 'ar', 'tr'];

function resolveLang(req) {
  const q = req.query?.lang;
  if (q && SUPPORTED_LANGS.includes(q)) return q;
  const header = req.headers['accept-language'];
  if (header) {
    const code = header.split(',')[0]?.trim()?.slice(0, 2)?.toLowerCase();
    if (SUPPORTED_LANGS.includes(code)) return code;
  }
  return 'en';
}

function getTranslationsMap(doc) {
  if (!doc?.translations) return {};
  if (doc.translations instanceof Map) {
    return Object.fromEntries(doc.translations);
  }
  return doc.translations;
}

function pickTranslation(product, lang) {
  const doc = product?.toObject ? product.toObject() : { ...product };
  const tr = getTranslationsMap(doc);
  const localized = tr[lang] || tr.en || {};
  return {
    name: localized.name || doc.name,
    description: localized.description ?? doc.description,
    shortDescription: localized.shortDescription ?? doc.shortDescription,
    seoTitle: localized.seoTitle ?? doc.seoTitle,
    seoDescription: localized.seoDescription ?? doc.seoDescription,
  };
}

function localizeProduct(product, lang = 'en') {
  if (!product) return product;
  const doc = product.toObject ? product.toObject() : { ...product };
  const text = pickTranslation(doc, lang);
  const { translations, ...rest } = doc;
  return { ...rest, ...text };
}

function localizeProducts(products, lang = 'en') {
  return products.map((p) => localizeProduct(p, lang));
}

function buildTranslationsFromBody(body) {
  const translations = body.translations || {};
  const en = translations.en || {};
  if (!en.name && body.name) {
    translations.en = {
      name: body.name,
      description: body.description,
      shortDescription: body.shortDescription,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      ...en,
    };
  }
  return translations;
}

module.exports = {
  SUPPORTED_LANGS,
  resolveLang,
  localizeProduct,
  localizeProducts,
  pickTranslation,
  buildTranslationsFromBody,
};

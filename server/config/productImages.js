const LOCAL = (file) => `/images/products/${file}`;
const CATEGORY_LIFESTYLE = (slug) => `/images/categories/${slug}.jpg`;

const PRODUCT_IMAGES = Array.from({ length: 32 }, (_, i) =>
  LOCAL(`product-${String(i + 1).padStart(2, '0')}.jpg`)
);

const CATEGORY_FALLBACKS = {
  rings: CATEGORY_LIFESTYLE('rings'),
  earrings: CATEGORY_LIFESTYLE('earrings'),
  necklaces: CATEGORY_LIFESTYLE('necklaces'),
  bracelets: CATEGORY_LIFESTYLE('bracelets'),
  pendants: CATEGORY_LIFESTYLE('pendants'),
  'gold-jewelry': CATEGORY_LIFESTYLE('gold-jewelry'),
  'diamond-jewelry': CATEGORY_LIFESTYLE('diamond-jewelry'),
  'custom-jewelry': CATEGORY_LIFESTYLE('custom-jewelry'),
  'bridal-jewelry': CATEGORY_LIFESTYLE('bridal-jewelry'),
  'fashion-jewelry': CATEGORY_LIFESTYLE('earrings'),
  'wholesale-collections': CATEGORY_LIFESTYLE('wholesale-collections'),
  bangles: CATEGORY_LIFESTYLE('bangles'),
  gifting: LOCAL('default-01.jpg'),
  default: LOCAL('default-01.jpg'),
};

const SUBCATEGORY_MAP = {
  'diamond-rings': 'rings',
  'gold-rings': 'rings',
  'solitaire-rings': 'rings',
  'engagement-rings': 'rings',
  'wedding-rings': 'rings',
  'stud-earrings': 'earrings',
  'hoop-earrings': 'earrings',
  'drop-earrings': 'earrings',
  'gold-necklaces': 'necklaces',
  'layered-necklaces': 'necklaces',
  'pendant-necklaces': 'pendants',
  'gold-bracelets': 'bracelets',
  'diamond-bracelets': 'bracelets',
  'tennis-bracelets': 'bracelets',
  'gold-pendants': 'pendants',
  'diamond-pendants': 'pendants',
  'gold-chains': 'gold-jewelry',
  'gold-sets': 'gold-jewelry',
  'diamond-sets': 'diamond-jewelry',
  'private-label': 'custom-jewelry',
  'bespoke-designs': 'custom-jewelry',
  'bridal-sets': 'bridal-jewelry',
  'wedding-bands': 'bridal-jewelry',
  contemporary: 'fashion-jewelry',
  'statement-pieces': 'fashion-jewelry',
  'bulk-orders': 'wholesale-collections',
  'partner-collections': 'wholesale-collections',
};

const SHARED_PRIMARY_PATHS = [
  '/images/products/ring-01.jpg',
  '/images/products/ring-02.jpg',
  '/images/products/earring-01.jpg',
  '/images/products/earring-02.jpg',
  '/images/products/necklace-01.jpg',
  '/images/products/necklace-02.jpg',
  '/images/products/bracelet-01.jpg',
  '/images/products/pendant-01.jpg',
  '/images/products/gold-set-01.jpg',
  '/images/products/default-01.jpg',
];

function resolveCategory(category, subcategory) {
  if (category && CATEGORY_FALLBACKS[category]) return category;
  if (subcategory && SUBCATEGORY_MAP[subcategory]) return SUBCATEGORY_MAP[subcategory];
  if (subcategory && CATEGORY_FALLBACKS[subcategory]) return subcategory;
  return 'default';
}

function parseSkuIndex(skuOrIndex) {
  if (typeof skuOrIndex === 'number' && Number.isFinite(skuOrIndex)) {
    return Math.max(0, Math.floor(skuOrIndex));
  }
  if (typeof skuOrIndex === 'string') {
    const match = skuOrIndex.match(/(\d+)/);
    if (match) return Math.max(0, parseInt(match[1], 10) - 1);
  }
  return 0;
}

function getProductImages(category, subcategory, skuOrIndex = 0) {
  const index = parseSkuIndex(skuOrIndex);
  const primary = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
  const secondary = PRODUCT_IMAGES[(index + 11) % PRODUCT_IMAGES.length];
  return [primary, secondary];
}

function getCategoryImage(category) {
  const slug = resolveCategory(category);
  return CATEGORY_FALLBACKS[slug] || CATEGORY_FALLBACKS.default;
}

function getCategoryFallback(category, subcategory) {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_FALLBACKS[slug] || CATEGORY_FALLBACKS.default;
}

function getProductImage(category, subcategory, index = 0, skuOrIndex = 0) {
  const images = getProductImages(category, subcategory, skuOrIndex);
  return images[index] || images[0];
}

function isSharedPrimaryPath(url) {
  return SHARED_PRIMARY_PATHS.includes(url);
}

function isValidCategoryImagePath(url) {
  return url?.startsWith('/images/categories/') || url?.startsWith('/images/products/');
}

module.exports = {
  PRODUCT_IMAGES,
  CATEGORY_FALLBACKS,
  SHARED_PRIMARY_PATHS,
  getProductImages,
  getCategoryImage,
  getCategoryFallback,
  getProductImage,
  parseSkuIndex,
  isSharedPrimaryPath,
  isValidCategoryImagePath,
};

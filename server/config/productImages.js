const jewelryStock = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const LEGACY_NON_JEWELRY_UNSPLASH_IDS = [
  '1581091226825-a6a2a5aee158',
  '1565793298595-6a879b1d9492',
  '1504328345606-18bbc8c9d7d1',
  '1610375461246-207c099ac6cc',
  '1581092160562-40aa08e78837',
  '1497366216548-37526070297c',
];

function isLegacyImagePath(url) {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/images/products/')) return true;
  if (trimmed.startsWith('/images/categories/')) return true;
  if (trimmed.startsWith('/images/editorial/')) return true;
  if (LEGACY_NON_JEWELRY_UNSPLASH_IDS.some((id) => trimmed.includes(id))) return true;
  return false;
}

function isJewelryStockUrl(url) {
  return typeof url === 'string' && url.includes('images.unsplash.com') && !isLegacyImagePath(url);
}

const JEWELRY_PRODUCT_IDS = [
  '1605100804763-247f67b3557e',
  '1535632066927-ab7c754af398',
  '1599643478518-a784e5dc4c8f',
  '1611085583191-a6cfe1657e70',
  '1573408301185-9146fe634ad0',
  '1617038220319-276d3aab2915',
  '1602751584552-8cf4eae49f4e',
  '1516638918792-21578567a634',
  '1515562141207-7a88fb7ce338',
  '1506630448388-459e089110ec',
  '1611599085274-84caa4e2e4a7',
  '1469334031218-e382a71b716b',
  '1603561591562-778103b7d5bc',
  '1535632066927-ab7c754af398',
  '1599643478518-a784e5dc4c8f',
  '1611085583191-a6cfe1657e70',
  '1605100804763-247f67b3557e',
  '1573408301185-9146fe634ad0',
  '1617038220319-276d3aab2915',
  '1602751584552-8cf4eae49f4e',
  '1516638918792-21578567a634',
  '1515562141207-7a88fb7ce338',
  '1506630448388-459e089110ec',
  '1611599085274-84caa4e2e4a7',
  '1469334031218-e382a71b716b',
  '1603561591562-778103b7d5bc',
  '1535632066927-ab7c754af398',
  '1599643478518-a784e5dc4c8f',
  '1611085583191-a6cfe1657e70',
  '1605100804763-247f67b3557e',
  '1573408301185-9146fe634ad0',
  '1617038220319-276d3aab2915',
];

const PRODUCT_IMAGES = JEWELRY_PRODUCT_IDS.map((id) => jewelryStock(id));

const CATEGORY_JEWELRY_IDS = {
  rings: '1605100804763-247f67b3557e',
  earrings: '1535632066927-ab7c754af398',
  necklaces: '1599643478518-a784e5dc4c8f',
  bracelets: '1611085583191-a6cfe1657e70',
  pendants: '1573408301185-9146fe634ad0',
  'gold-jewelry': '1617038220319-276d3aab2915',
  'diamond-jewelry': '1602751584552-8cf4eae49f4e',
  'custom-jewelry': '1506630448388-459e089110ec',
  'bridal-jewelry': '1515562141207-7a88fb7ce338',
  'fashion-jewelry': '1535632066927-ab7c754af398',
  'wholesale-collections': '1516638918792-21578567a634',
  bangles: '1611085583191-a6cfe1657e70',
  gifting: '1573408301185-9146fe634ad0',
  default: '1573408301185-9146fe634ad0',
};

const CATEGORY_FALLBACKS = Object.fromEntries(
  Object.entries(CATEGORY_JEWELRY_IDS).map(([slug, id]) => [slug, jewelryStock(id)])
);

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
  return isJewelryStockUrl(url) || url?.startsWith('/images/categories/') || url?.startsWith('/images/products/');
}

function isValidProductImagePath(url) {
  return isJewelryStockUrl(url) || url?.startsWith('/images/products/');
}

module.exports = {
  PRODUCT_IMAGES,
  CATEGORY_FALLBACKS,
  SHARED_PRIMARY_PATHS,
  LEGACY_NON_JEWELRY_UNSPLASH_IDS,
  getProductImages,
  getCategoryImage,
  getCategoryFallback,
  getProductImage,
  parseSkuIndex,
  isSharedPrimaryPath,
  isValidCategoryImagePath,
  isValidProductImagePath,
  isLegacyImagePath,
  isJewelryStockUrl,
};

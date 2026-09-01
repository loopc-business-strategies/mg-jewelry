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

function isCatalogProductImagePath(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('/images/chains/') || url.startsWith('/images/bangles/');
}

function isJewelryStockUrl(url) {
  return typeof url === 'string' && url.includes('images.unsplash.com') && !isLegacyImagePath(url);
}

const catalogImage = (folder, n) => `/images/${folder}/${folder.slice(0, -1)}-${String(n).padStart(2, '0')}.jpg`;

const CHAIN_CATALOG = Array.from({ length: 12 }, (_, i) => catalogImage('chains', i + 1));
const BANGLE_CATALOG = Array.from({ length: 12 }, (_, i) => catalogImage('bangles', i + 1));

const PRODUCT_IMAGES = [...CHAIN_CATALOG, ...BANGLE_CATALOG];

const CATEGORY_FALLBACKS = {
  chains: CHAIN_CATALOG[0],
  bangles: BANGLE_CATALOG[0],
  default: CHAIN_CATALOG[0],
};

const SUBCATEGORY_MAP = {
  'rope-chain': 'chains',
  'cuban-chain': 'chains',
  'figaro-chain': 'chains',
  'box-chain': 'chains',
  'classic-bangle': 'bangles',
  'kada-bangle': 'bangles',
  'hinged-bangle': 'bangles',
  'stackable-bangle': 'bangles',
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
  const slug = resolveCategory(category, subcategory);
  if (slug === 'bangles') {
    const bangleIdx = index % BANGLE_CATALOG.length;
    return [BANGLE_CATALOG[bangleIdx]];
  }
  const chainIdx = index % CHAIN_CATALOG.length;
  return [CHAIN_CATALOG[chainIdx]];
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

function isValidProductImagePath(url) {
  return isCatalogProductImagePath(url) || isJewelryStockUrl(url) || url?.startsWith('/images/products/');
}

function isValidCategoryImagePath(url) {
  return isCatalogProductImagePath(url) || isJewelryStockUrl(url) || url?.startsWith('/images/categories/') || url?.startsWith('/images/products/');
}

module.exports = {
  PRODUCT_IMAGES,
  CHAIN_CATALOG,
  BANGLE_CATALOG,
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
  isCatalogProductImagePath,
};

export const jewelryStock = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Legacy non-jewelry Unsplash IDs — used for DB migration detection */
export const LEGACY_NON_JEWELRY_UNSPLASH_IDS = [
  '1581091226825-a6a2a5aee158',
  '1565793298595-6a879b1d9492',
  '1504328345606-18bbc8c9d7d1',
  '1610375461246-207c099ac6cc',
  '1581092160562-40aa08e78837',
  '1497366216548-37526070297c',
];

export function isLegacyImagePath(url) {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/images/products/')) return true;
  if (trimmed.startsWith('/images/categories/')) return true;
  if (trimmed.startsWith('/images/editorial/')) return true;
  if (LEGACY_NON_JEWELRY_UNSPLASH_IDS.some((id) => trimmed.includes(id))) return true;
  return false;
}

export function isJewelryStockUrl(url) {
  return typeof url === 'string' && url.includes('images.unsplash.com') && !isLegacyImagePath(url);
}

const CHAIN_IMAGE_IDS = [
  '1599643478518-a784e5dc4c8f',
  '1617038220319-276d3aab2915',
  '1516638918792-21578567a634',
  '1469334031218-e382a71b716b',
  '1603561591562-778103b7d5bc',
  '1506630448388-459e089110ec',
  '1611599085274-84caa4e2e4a7',
  '1515562141207-7a88fb7ce338',
  '1605100804763-247f67b3557e',
  '1535632066927-ab7c754af398',
  '1602751584552-8cf4eae49f4e',
  '1573408301185-9146fe634ad0',
];

const BANGLE_IMAGE_IDS = [
  '1611085583191-a6cfe1657e70',
  '1602751584552-8cf4eae49f4e',
  '1605100804763-247f67b3557e',
  '1573408301185-9146fe634ad0',
  '1535632066927-ab7c754af398',
  '1617038220319-276d3aab2915',
  '1516638918792-21578567a634',
  '1603561591562-778103b7d5bc',
  '1506630448388-459e089110ec',
  '1611599085274-84caa4e2e4a7',
  '1515562141207-7a88fb7ce338',
  '1469334031218-e382a71b716b',
];

export const PRODUCT_IMAGES = [...CHAIN_IMAGE_IDS, ...BANGLE_IMAGE_IDS].map((id) => jewelryStock(id));

const CATEGORY_JEWELRY_IDS = {
  chains: '1599643478518-a784e5dc4c8f',
  bangles: '1611085583191-a6cfe1657e70',
  default: '1599643478518-a784e5dc4c8f',
};

export const PRODUCT_CATEGORY_FALLBACKS = Object.fromEntries(
  Object.entries(CATEGORY_JEWELRY_IDS).map(([slug, id]) => [slug, jewelryStock(id)])
);

export const CATEGORY_FALLBACKS = { ...PRODUCT_CATEGORY_FALLBACKS };

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

function resolveCategory(category, subcategory) {
  if (category && CATEGORY_FALLBACKS[category]) return category;
  if (subcategory && SUBCATEGORY_MAP[subcategory]) return SUBCATEGORY_MAP[subcategory];
  if (subcategory && CATEGORY_FALLBACKS[subcategory]) return subcategory;
  return 'default';
}

function getImagePool(category, subcategory) {
  const slug = resolveCategory(category, subcategory);
  return slug === 'bangles' ? BANGLE_IMAGE_IDS : CHAIN_IMAGE_IDS;
}

export function parseSkuIndex(skuOrIndex) {
  if (typeof skuOrIndex === 'number' && Number.isFinite(skuOrIndex)) {
    return Math.max(0, Math.floor(skuOrIndex));
  }
  if (typeof skuOrIndex === 'string') {
    const match = skuOrIndex.match(/(\d+)/);
    if (match) return Math.max(0, parseInt(match[1], 10) - 1);
  }
  return 0;
}

export const getProductImages = (category, subcategory, skuOrIndex = 0) => {
  const pool = getImagePool(category, subcategory);
  const index = parseSkuIndex(skuOrIndex);
  const primaryIdx = index % pool.length;
  let secondaryIdx = (index + 5) % pool.length;
  if (secondaryIdx === primaryIdx) secondaryIdx = (secondaryIdx + 1) % pool.length;
  return [jewelryStock(pool[primaryIdx]), jewelryStock(pool[secondaryIdx])];
};

export const getCategoryFallback = (category, subcategory) => {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_FALLBACKS[slug] || CATEGORY_FALLBACKS.default;
};

export const getProductCategoryFallback = (category, subcategory) =>
  getCategoryFallback(category, subcategory);

export const resolveProductImage = (product, index = 0) => {
  const url = product?.images?.[index];
  if (url && typeof url === 'string' && url.trim() && !isLegacyImagePath(url)) return url.trim();
  const images = getProductImages(product?.category, product?.subcategory, product?.sku);
  return images[index] || images[0] || CATEGORY_FALLBACKS.default;
};

export const getProductImage = resolveProductImage;

export const getProductAlt = (product, index = 0) => {
  const name = product?.name || 'Jewelry piece';
  const cat = product?.category ? product.category.replace(/-/g, ' ') : 'jewelry';
  return index > 0 ? `${name} — alternate view` : `${name} — ${cat} by Modern Gold Jewelry`;
};

const SVG = (file) => `/images/fallbacks/${file}`;

export const CATEGORY_SVG_FALLBACKS = {
  chains: SVG('product-fallback-necklace.svg'),
  bangles: SVG('product-fallback-bracelet.svg'),
  default: SVG('product-fallback-default.svg'),
};

export function getCategorySvgFallback(category, subcategory) {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_SVG_FALLBACKS[slug] || CATEGORY_SVG_FALLBACKS.default;
}

export const heroImage = jewelryStock('1469334031218-e382a71b716b', 1200);
export const premiumBanner = jewelryStock('1599643478518-a784e5dc4c8f', 1200);
export const aboutHero = jewelryStock('1516638918792-21578567a634', 1200);
export const wholesaleHero = jewelryStock('1611085583191-a6cfe1657e70', 1200);
export const customHero = jewelryStock('1506630448388-459e089110ec', 1200);

export const categoryImages = {
  chains: jewelryStock(CATEGORY_JEWELRY_IDS.chains),
  bangles: jewelryStock(CATEGORY_JEWELRY_IDS.bangles),
};

export const getCategoryImage = (slug) =>
  categoryImages[slug] || categoryImages.chains || CATEGORY_FALLBACKS.default;

export const IMAGE_PLACEHOLDER_LABEL = 'Real Image Coming Soon';

export const factoryGallery = [
  { src: jewelryStock('1617038220319-276d3aab2915'), label: 'Chain Craftsmanship' },
  { src: jewelryStock('1599643478518-a784e5dc4c8f'), label: 'Gold Chain Detail' },
  { src: jewelryStock('1611085583191-a6cfe1657e70'), label: 'Bangle Work' },
  { src: jewelryStock('1516638918792-21578567a634'), label: 'Finished Chains' },
  { src: jewelryStock('1602751584552-8cf4eae49f4e'), label: 'Polishing' },
  { src: jewelryStock('1515562141207-7a88fb7ce338'), label: 'Finished Pieces' },
];

export const showroomGallery = [
  { src: jewelryStock('1515562141207-7a88fb7ce338'), label: 'Showroom' },
  { src: jewelryStock('1599643478518-a784e5dc4c8f'), label: 'Chain Display' },
  { src: jewelryStock('1611085583191-a6cfe1657e70'), label: 'Bangle Collection' },
  { src: jewelryStock('1469334031218-e382a71b716b'), label: 'Gold Jewelry' },
];

export const marketAccentColors = [
  'from-coral/20 to-champagne',
  'from-sapphire/15 to-pearl',
  'from-emerald/15 to-ivory',
  'from-ruby/15 to-cream',
  'from-turquoise/15 to-pearl',
  'from-lavender/15 to-champagne',
  'from-gold/20 to-cream',
  'from-rose-gold/20 to-ivory',
  'from-burgundy/10 to-champagne',
];

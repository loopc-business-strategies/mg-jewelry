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

const catalogImage = (folder, n) => `/images/${folder}/${folder.slice(0, -1)}-${String(n).padStart(2, '0')}.jpg`;

export const CHAIN_CATALOG = Array.from({ length: 12 }, (_, i) => catalogImage('chains', i + 1));
export const BANGLE_CATALOG = Array.from({ length: 12 }, (_, i) => catalogImage('bangles', i + 1));

export const PRODUCT_IMAGES = [...CHAIN_CATALOG, ...BANGLE_CATALOG];

export function isCatalogProductImagePath(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('/images/chains/') || url.startsWith('/images/bangles/');
}

export const PRODUCT_CATEGORY_FALLBACKS = {
  chains: CHAIN_CATALOG[0],
  bangles: BANGLE_CATALOG[0],
  default: CHAIN_CATALOG[0],
};

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
  const index = parseSkuIndex(skuOrIndex);
  const slug = resolveCategory(category, subcategory);
  if (slug === 'bangles') {
    const bangleIdx = index % BANGLE_CATALOG.length;
    return [BANGLE_CATALOG[bangleIdx]];
  }
  const chainIdx = index % CHAIN_CATALOG.length;
  return [CHAIN_CATALOG[chainIdx]];
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

export const heroImage = '/images/demo/hero-refinery.jpg';
export const premiumBanner = jewelryStock('1599643478518-a784e5dc4c8f', 1200);
export const aboutHero = jewelryStock('1516638918792-21578567a634', 1200);
export const wholesaleHero = jewelryStock('1611085583191-a6cfe1657e70', 1200);
export const customHero = jewelryStock('1506630448388-459e089110ec', 1200);

export const categoryImages = {
  chains: CHAIN_CATALOG[0],
  bangles: BANGLE_CATALOG[0],
};

export const getCategoryImage = (slug) =>
  categoryImages[slug] || categoryImages.chains || CATEGORY_FALLBACKS.default;

export const IMAGE_PLACEHOLDER_LABEL = 'Real Image Coming Soon';

export const dualPathImages = {
  sellGold: '/images/demo/sell-gold.jpg',
  buyGold: '/images/demo/buy-gold.jpg',
};

// Future client photography: /images/modern-gold/showroom.jpg, factory.jpg, team.jpg, quality.jpg
export const presenceImages = [
  {
    id: 'showroom',
    title: 'SHOWROOM & OFFICE',
    description: 'A professional space for welcoming customers, partners and international business visitors.',
    image: '/images/demo/showroom.jpg',
    alt: 'Showroom and business office — demo corporate photography',
    demoLabel: 'Showroom & Office — Demo Image',
    isDemo: true,
    featured: true,
  },
  {
    id: 'manufacturing',
    title: 'MANUFACTURING',
    description: 'Skilled craftsmanship and production processes supporting our gold jewellery operations.',
    image: '/images/demo/manufacturing.jpg',
    alt: 'Gold jewellery manufacturing workshop — demo photography',
    demoLabel: 'Manufacturing Operations — Demo Image',
    isDemo: true,
    featured: false,
  },
  {
    id: 'team',
    title: 'OUR PEOPLE',
    description: 'Experienced professionals working across production, quality, business development and customer relationships.',
    image: '/images/demo/team.jpg',
    alt: 'Professional business team in meeting — demo corporate photography',
    demoLabel: 'Professional Team — Demo Image',
    isDemo: true,
    featured: false,
  },
  {
    id: 'quality',
    title: 'QUALITY & OPERATIONS',
    description: 'Careful inspection, weighing and quality-focused processes across our gold operations.',
    image: '/images/demo/quality.jpg',
    alt: 'Gold quality inspection and weighing — demo photography',
    demoLabel: 'Quality & Operations — Demo Image',
    isDemo: true,
    featured: true,
  },
];

export const manufacturingProcessSteps = [
  {
    label: 'Melting & Refining',
    src: jewelryStock('1751979362679-8687eb4d9301'),
    alt: 'Molten metal being poured during refining',
  },
  {
    label: 'Chain Making',
    src: jewelryStock('1628058494685-6c2f796ac24a'),
    alt: 'Jeweler crafting a gold chain in the workshop',
  },
  {
    label: 'Bangle Making',
    src: jewelryStock('1715374033196-0ff662284a7e'),
    alt: 'Artisan making bangles at a jewelry workbench',
  },
  {
    label: 'Quality Inspection',
    src: jewelryStock('1772442125263-c9dd28bbd938'),
    alt: 'Jeweler inspecting jewelry quality at a workbench',
  },
  {
    label: 'Packaging',
    src: jewelryStock('1675697994142-f19c20168079'),
    alt: 'Jeweler packing finished jewelry into a gift box',
  },
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

export const ourMgScreens = {
  login: '/images/our-mg/login.png',
  home: '/images/our-mg/home.png',
  products: '/images/our-mg/products.png',
  productDetail: '/images/our-mg/product-detail.png',
  profile: '/images/our-mg/profile.png',
  orders: '/images/our-mg/orders.png',
};

export const ourMgShowcaseScreens = [
  { id: 'login', labelKey: 'login', number: '01' },
  { id: 'home', labelKey: 'dashboard', number: '02' },
  { id: 'products', labelKey: 'products', number: '03' },
  { id: 'orders', labelKey: 'orders', number: '04' },
  { id: 'profile', labelKey: 'profile', number: '05' },
];

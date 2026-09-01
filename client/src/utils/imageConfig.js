const LOCAL = (file) => `/images/products/${file}`;
const CATEGORY_LIFESTYLE = (slug) => `/images/categories/${slug}.jpg`;
const EDITORIAL = (file) => `/images/editorial/${file}`;

const UNSPLASH = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PRODUCT_CATEGORY_FALLBACKS = {
  rings: LOCAL('ring-01.jpg'),
  earrings: LOCAL('earring-01.jpg'),
  necklaces: LOCAL('necklace-01.jpg'),
  bracelets: LOCAL('bracelet-01.jpg'),
  pendants: LOCAL('pendant-01.jpg'),
  'gold-jewelry': LOCAL('gold-set-01.jpg'),
  'diamond-jewelry': LOCAL('ring-01.jpg'),
  'custom-jewelry': LOCAL('default-01.jpg'),
  'bridal-jewelry': LOCAL('necklace-01.jpg'),
  'fashion-jewelry': LOCAL('earring-02.jpg'),
  'wholesale-collections': LOCAL('gold-set-01.jpg'),
  chains: LOCAL('gold-set-01.jpg'),
  bangles: LOCAL('bracelet-01.jpg'),
  gifting: LOCAL('default-01.jpg'),
  default: LOCAL('default-01.jpg'),
};

export const PRODUCT_IMAGES = Array.from({ length: 32 }, (_, i) =>
  LOCAL(`product-${String(i + 1).padStart(2, '0')}.jpg`)
);

export const CATEGORY_FALLBACKS = {
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
  chains: CATEGORY_LIFESTYLE('gold-jewelry'),
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
  'bridal-jewellery': 'bridal-jewelry',
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
  const primary = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
  const secondary = PRODUCT_IMAGES[(index + 11) % PRODUCT_IMAGES.length];
  return [primary, secondary];
};

export const getCategoryFallback = (category, subcategory) => {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_FALLBACKS[slug] || CATEGORY_FALLBACKS.default;
};

export const getProductCategoryFallback = (category, subcategory) => {
  const slug = resolveCategory(category, subcategory);
  return PRODUCT_CATEGORY_FALLBACKS[slug] || PRODUCT_CATEGORY_FALLBACKS.default;
};

export const resolveProductImage = (product, index = 0) => {
  const url = product?.images?.[index];
  if (url && typeof url === 'string' && url.trim()) return url.trim();
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
  rings: SVG('product-fallback-ring.svg'),
  earrings: SVG('product-fallback-earring.svg'),
  necklaces: SVG('product-fallback-necklace.svg'),
  bracelets: SVG('product-fallback-bracelet.svg'),
  pendants: SVG('product-fallback-pendant.svg'),
  'gold-jewelry': SVG('product-fallback-default.svg'),
  'diamond-jewelry': SVG('product-fallback-ring.svg'),
  'custom-jewelry': SVG('product-fallback-default.svg'),
  'bridal-jewelry': SVG('product-fallback-necklace.svg'),
  'fashion-jewelry': SVG('product-fallback-earring.svg'),
  'wholesale-collections': SVG('product-fallback-default.svg'),
  bangles: SVG('product-fallback-bracelet.svg'),
  default: SVG('product-fallback-default.svg'),
};

export function getCategorySvgFallback(category, subcategory) {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_SVG_FALLBACKS[slug] || CATEGORY_SVG_FALLBACKS.default;
}

export const heroImage = EDITORIAL('hero.jpg');
export const premiumBanner = EDITORIAL('collection-promo.jpg');
export const aboutHero = EDITORIAL('about.jpg');
export const wholesaleHero = EDITORIAL('wholesale.jpg');
export const customHero = EDITORIAL('custom.jpg');

export const categoryImages = {
  rings: CATEGORY_LIFESTYLE('rings'),
  earrings: CATEGORY_LIFESTYLE('earrings'),
  necklaces: CATEGORY_LIFESTYLE('necklaces'),
  bracelets: CATEGORY_LIFESTYLE('bracelets'),
  pendants: CATEGORY_LIFESTYLE('pendants'),
  bangles: CATEGORY_LIFESTYLE('bangles'),
  'gold-jewelry': CATEGORY_LIFESTYLE('gold-jewelry'),
  'diamond-jewelry': CATEGORY_LIFESTYLE('diamond-jewelry'),
  'bridal-jewelry': CATEGORY_LIFESTYLE('bridal-jewelry'),
  'custom-jewelry': CATEGORY_LIFESTYLE('custom-jewelry'),
  'wholesale-collections': CATEGORY_LIFESTYLE('wholesale-collections'),
  'fashion-jewelry': CATEGORY_LIFESTYLE('earrings'),
};

export const getCategoryImage = (slug) =>
  categoryImages[slug] || categoryImages['gold-jewelry'] || CATEGORY_FALLBACKS.default;

export const IMAGE_PLACEHOLDER_LABEL = 'Real Image Coming Soon';

export const factoryGallery = [
  { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80&auto=format&fit=crop', label: 'Factory' },
  { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80&auto=format&fit=crop', label: 'Production' },
  { src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop', label: 'Chain Production' },
  { src: 'https://images.unsplash.com/photo-1610375461246-207c099ac6cc?w=800&q=80&auto=format&fit=crop', label: 'Quality Control' },
  { src: 'https://images.unsplash.com/photo-1617038220319-276d3aab2915?w=800&q=80&auto=format&fit=crop', label: 'Gold Handling' },
  { src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format&fit=crop', label: 'Packaging' },
];

export const showroomGallery = [
  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&auto=format&fit=crop', label: 'Showroom' },
  { src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&auto=format&fit=crop', label: 'Display Counter' },
  { src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80&auto=format&fit=crop', label: 'Product Samples' },
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop', label: 'Business Office' },
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

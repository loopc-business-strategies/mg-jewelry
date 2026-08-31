const UNSPLASH = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const CATEGORY_FALLBACKS = {
  rings: '/images/fallbacks/product-fallback-ring.svg',
  earrings: '/images/fallbacks/product-fallback-earring.svg',
  necklaces: '/images/fallbacks/product-fallback-necklace.svg',
  bracelets: '/images/fallbacks/product-fallback-bracelet.svg',
  pendants: '/images/fallbacks/product-fallback-pendant.svg',
  'gold-jewelry': '/images/fallbacks/product-fallback-default.svg',
  'diamond-jewelry': '/images/fallbacks/product-fallback-ring.svg',
  'custom-jewelry': '/images/fallbacks/product-fallback-default.svg',
  'bridal-jewelry': '/images/fallbacks/product-fallback-necklace.svg',
  'fashion-jewelry': '/images/fallbacks/product-fallback-earring.svg',
  'wholesale-collections': '/images/fallbacks/product-fallback-default.svg',
  bangles: '/images/fallbacks/product-fallback-bracelet.svg',
  gifting: '/images/fallbacks/product-fallback-default.svg',
  default: '/images/fallbacks/product-fallback-default.svg',
};

const SUBCATEGORY_MAP = {
  'diamond-rings': 'rings',
  'gold-rings': 'rings',
  'solitaire-rings': 'rings',
  'engagement-rings': 'rings',
  'wedding-rings': 'rings',
  'stud-earrings': 'earrings',
  'hoop-earrings': 'earrings',
  'gold-necklaces': 'necklaces',
  'pendant-necklaces': 'pendants',
  'gold-bracelets': 'bracelets',
  'diamond-bracelets': 'bracelets',
  'bridal-jewellery': 'bridal-jewelry',
};

export const getCategoryFallback = (category, subcategory) => {
  const slug = category || subcategory;
  if (slug && CATEGORY_FALLBACKS[slug]) return CATEGORY_FALLBACKS[slug];
  if (subcategory && SUBCATEGORY_MAP[subcategory]) {
    return CATEGORY_FALLBACKS[SUBCATEGORY_MAP[subcategory]] || CATEGORY_FALLBACKS.default;
  }
  if (category && SUBCATEGORY_MAP[category]) {
    return CATEGORY_FALLBACKS[SUBCATEGORY_MAP[category]] || CATEGORY_FALLBACKS.default;
  }
  return CATEGORY_FALLBACKS.default;
};

export const resolveProductImage = (product, index = 0) => {
  const url = product?.images?.[index];
  if (url && typeof url === 'string' && url.trim()) return url.trim();
  return getCategoryFallback(product?.category, product?.subcategory);
};

export const getProductImage = resolveProductImage;

export const getProductAlt = (product, index = 0) => {
  const name = product?.name || 'Jewelry piece';
  const cat = product?.category ? product.category.replace(/-/g, ' ') : 'jewelry';
  return index > 0 ? `${name} — alternate view` : `${name} — ${cat} by Modern Gold Jewelry`;
};

export const heroImage = UNSPLASH('1605100804763-247f67b3557e', 1600);
export const premiumBanner = UNSPLASH('1599643478518-a784e069c662', 1600);
export const aboutHero = UNSPLASH('1611591431799-11f2980a0c7f', 1600);
export const wholesaleHero = UNSPLASH('1515562141207-7a88fb7071ee', 1600);
export const manufacturingHero = UNSPLASH('1535632066922-ab7c3ab60908', 1600);
export const customHero = UNSPLASH('1617032210318-096e6c314904', 1600);

export const categoryImages = {
  rings: UNSPLASH('1515562141207-7a88fb7071ee', 600),
  earrings: UNSPLASH('1535632066922-ab7c3ab60908', 600),
  necklaces: UNSPLASH('1599643478518-a784e069c662', 600),
  bracelets: UNSPLASH('1611591431799-11f2980a0c7f', 600),
  pendants: UNSPLASH('1605100804763-247f67b3557e', 600),
  'gold-jewelry': UNSPLASH('1605100804763-247f67b3557e', 600),
  'diamond-jewelry': UNSPLASH('1515562141207-7a88fb7071ee', 600),
  'bridal-jewelry': UNSPLASH('1599643478518-a784e069c662', 600),
  'fashion-jewelry': UNSPLASH('1535632066922-ab7c3ab60908', 600),
  'wholesale-collections': UNSPLASH('1617032210318-096e6c314904', 600),
  bangles: UNSPLASH('1605100804763-247f67b3557e', 600),
};

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

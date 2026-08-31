const LOCAL = (file) => `/images/products/${file}`;

const UNSPLASH = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const CATEGORY_PRODUCT_IMAGES = {
  rings: [LOCAL('ring-01.jpg'), LOCAL('ring-02.jpg')],
  earrings: [LOCAL('earring-01.jpg'), LOCAL('earring-02.jpg')],
  necklaces: [LOCAL('necklace-01.jpg'), LOCAL('necklace-02.jpg')],
  bracelets: [LOCAL('bracelet-01.jpg'), LOCAL('ring-02.jpg')],
  pendants: [LOCAL('pendant-01.jpg'), LOCAL('ring-01.jpg')],
  'gold-jewelry': [LOCAL('gold-set-01.jpg'), LOCAL('ring-02.jpg')],
  'diamond-jewelry': [LOCAL('ring-01.jpg'), LOCAL('ring-02.jpg')],
  'custom-jewelry': [LOCAL('default-01.jpg'), LOCAL('ring-01.jpg')],
  'bridal-jewelry': [LOCAL('necklace-01.jpg'), LOCAL('necklace-02.jpg')],
  'fashion-jewelry': [LOCAL('earring-01.jpg'), LOCAL('earring-02.jpg')],
  'wholesale-collections': [LOCAL('gold-set-01.jpg'), LOCAL('default-01.jpg')],
  bangles: [LOCAL('bracelet-01.jpg'), LOCAL('gold-set-01.jpg')],
  gifting: [LOCAL('default-01.jpg'), LOCAL('pendant-01.jpg')],
  default: [LOCAL('default-01.jpg'), LOCAL('ring-01.jpg')],
};

export const CATEGORY_FALLBACKS = {
  rings: LOCAL('ring-01.jpg'),
  earrings: LOCAL('earring-01.jpg'),
  necklaces: LOCAL('necklace-01.jpg'),
  bracelets: LOCAL('bracelet-01.jpg'),
  pendants: LOCAL('pendant-01.jpg'),
  'gold-jewelry': LOCAL('gold-set-01.jpg'),
  'diamond-jewelry': LOCAL('ring-01.jpg'),
  'custom-jewelry': LOCAL('default-01.jpg'),
  'bridal-jewelry': LOCAL('necklace-01.jpg'),
  'fashion-jewelry': LOCAL('earring-01.jpg'),
  'wholesale-collections': LOCAL('gold-set-01.jpg'),
  bangles: LOCAL('bracelet-01.jpg'),
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
  if (category && CATEGORY_PRODUCT_IMAGES[category]) return category;
  if (subcategory && SUBCATEGORY_MAP[subcategory]) return SUBCATEGORY_MAP[subcategory];
  if (subcategory && CATEGORY_PRODUCT_IMAGES[subcategory]) return subcategory;
  return 'default';
}

export const getProductImages = (category, subcategory) => {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_PRODUCT_IMAGES[slug] || CATEGORY_PRODUCT_IMAGES.default;
};

export const getCategoryFallback = (category, subcategory) => {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_FALLBACKS[slug] || CATEGORY_FALLBACKS.default;
};

export const resolveProductImage = (product, index = 0) => {
  const url = product?.images?.[index];
  if (url && typeof url === 'string' && url.trim()) return url.trim();
  const images = getProductImages(product?.category, product?.subcategory);
  return images[index] || images[0] || CATEGORY_FALLBACKS.default;
};

export const getProductImage = resolveProductImage;

export const getProductAlt = (product, index = 0) => {
  const name = product?.name || 'Jewelry piece';
  const cat = product?.category ? product.category.replace(/-/g, ' ') : 'jewelry';
  return index > 0 ? `${name} — alternate view` : `${name} — ${cat} by Modern Gold Jewelry`;
};

export const heroImage = UNSPLASH('1605100804763-247f67b3557e', 1600);
export const premiumBanner = LOCAL('necklace-01.jpg');
export const aboutHero = LOCAL('bracelet-01.jpg');
export const wholesaleHero = LOCAL('ring-01.jpg');
export const manufacturingHero = LOCAL('earring-01.jpg');
export const customHero = LOCAL('default-01.jpg');

export const categoryImages = {
  rings: LOCAL('ring-01.jpg'),
  earrings: LOCAL('earring-01.jpg'),
  necklaces: LOCAL('necklace-01.jpg'),
  bracelets: LOCAL('bracelet-01.jpg'),
  pendants: LOCAL('pendant-01.jpg'),
  'gold-jewelry': LOCAL('gold-set-01.jpg'),
  'diamond-jewelry': LOCAL('ring-01.jpg'),
  'bridal-jewelry': LOCAL('necklace-02.jpg'),
  'fashion-jewelry': LOCAL('earring-02.jpg'),
  'wholesale-collections': LOCAL('gold-set-01.jpg'),
  bangles: LOCAL('bracelet-01.jpg'),
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

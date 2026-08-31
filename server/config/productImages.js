const LOCAL = (file) => `/images/products/${file}`;

const CATEGORY_PRODUCT_IMAGES = {
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

const BROKEN_UNSPLASH_IDS = [
  '1515562141207',
  '1535632066922',
  '1599643478518',
  '1611591431799',
  '1617032210318',
  '1602751584552',
];

function resolveCategory(category, subcategory) {
  if (category && CATEGORY_PRODUCT_IMAGES[category]) return category;
  if (subcategory && SUBCATEGORY_MAP[subcategory]) return SUBCATEGORY_MAP[subcategory];
  if (subcategory && CATEGORY_PRODUCT_IMAGES[subcategory]) return subcategory;
  return 'default';
}

function getProductImages(category, subcategory) {
  const slug = resolveCategory(category, subcategory);
  return CATEGORY_PRODUCT_IMAGES[slug] || CATEGORY_PRODUCT_IMAGES.default;
}

function getCategoryImage(category) {
  return getProductImages(category)[0];
}

function getProductImage(category, subcategory, index = 0) {
  const images = getProductImages(category, subcategory);
  return images[index] || images[0];
}

function isBrokenImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return BROKEN_UNSPLASH_IDS.some((id) => url.includes(id));
}

module.exports = {
  CATEGORY_PRODUCT_IMAGES,
  BROKEN_UNSPLASH_IDS,
  getProductImages,
  getCategoryImage,
  getProductImage,
  isBrokenImageUrl,
};

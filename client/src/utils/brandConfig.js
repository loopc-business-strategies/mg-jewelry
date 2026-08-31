export const brand = {
  name: 'Modern Gold Jewelry',
  legalName: 'Modern Gold Jewelry Manufacturing FE LLC',
  tagline: 'Precision Crafted. Globally Connected.',
  heroSubtitle:
    'Premium jewelry manufacturing from Uzbekistan for international partners and discerning customers worldwide.',
  address: '242 Girvonbulok Street, Namangan Davlatabad, Namangan – Uzbekistan',
  addressLines: [
    '242 Girvonbulok Street',
    'Namangan Davlatabad',
    'Namangan – Uzbekistan',
  ],
  siteUrl: 'https://mg-jewelry.vercel.app',
  location: 'Namangan, Uzbekistan',
};

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Collections', path: '/shop', megaMenu: true },
  { label: 'Manufacturing', path: '/manufacturing' },
  { label: 'Custom Jewelry', path: '/custom-jewelry' },
  { label: 'Contact', path: '/contact' },
];

export const manufacturingSteps = [
  { step: '01', title: 'Design', desc: 'Concept development and jewelry design.' },
  { step: '02', title: 'Development', desc: 'CAD refinement and production preparation.' },
  { step: '03', title: 'Casting', desc: 'Precision jewelry manufacturing.' },
  { step: '04', title: 'Finishing', desc: 'Polishing, detailing and surface finishing.' },
  { step: '05', title: 'Quality Control', desc: 'Detailed inspection and quality verification.' },
  { step: '06', title: 'Delivery', desc: 'Prepared for international customers and business partners.' },
];

export const trustIndicators = [
  { title: 'Precision Manufacturing', desc: 'Advanced production processes for consistent quality.' },
  { title: 'Quality-Focused Production', desc: 'Rigorous standards at every stage of manufacturing.' },
  { title: 'Custom Jewelry Capability', desc: 'Tailored designs and private-label collections.' },
  { title: 'International Market Focus', desc: 'Built to serve partners across global jewelry markets.' },
  { title: 'Professional Craftsmanship', desc: 'Skilled artisans and modern production techniques.' },
  { title: 'Reliable Business Partnerships', desc: 'Dedicated support for wholesalers and brands.' },
];

export const b2bAudience = [
  'Jewelry wholesalers',
  'Retailers',
  'Jewelry brands',
  'Distributors',
  'International buyers',
  'Private-label businesses',
  'Fashion brands',
  'Custom jewelry businesses',
];

export const categoryIcons = [
  { name: 'Rings', slug: 'rings', icon: '💍' },
  { name: 'Earrings', slug: 'earrings', icon: '✨' },
  { name: 'Necklaces', slug: 'necklaces', icon: '📿' },
  { name: 'Bracelets', slug: 'bracelets', icon: '⭕' },
  { name: 'Pendants', slug: 'pendants', icon: '🔶' },
  { name: 'Gold Jewelry', slug: 'gold-jewelry', icon: '🥇' },
  { name: 'Diamond Jewelry', slug: 'diamond-jewelry', icon: '💎' },
  { name: 'Bridal Jewelry', slug: 'bridal-jewelry', icon: '👰' },
  { name: 'Fashion Jewelry', slug: 'fashion-jewelry', icon: '✨' },
  { name: 'Wholesale', slug: 'wholesale-collections', icon: '📦' },
];

export const collectionCategories = [
  'rings',
  'earrings',
  'necklaces',
  'bracelets',
  'pendants',
  'gold-jewelry',
  'diamond-jewelry',
  'bridal-jewelry',
  'fashion-jewelry',
  'wholesale-collections',
];

export const whyChooseUs = trustIndicators;

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_selling', label: 'Best Selling' },
];

export const seoKeywords = [
  'jewelry manufacturer Uzbekistan',
  'gold jewelry manufacturer',
  'jewelry manufacturing',
  'jewelry wholesale',
  'custom jewelry manufacturing',
  'international jewelry manufacturer',
  'private label jewelry manufacturing',
];

export const productServiceActions = {
  quote: {
    type: 'quote',
    label: 'Request Quote',
    icon: 'MessageCircle',
    pageTitle: 'Request a Quote',
    submitLabel: 'Submit Quote Request',
    subject: 'Quote Request',
    messageTemplate: (product) => `I would like to request a quote for: ${product}`,
  },
  'video-call': {
    type: 'video-call',
    label: 'Video Call',
    icon: 'Video',
    pageTitle: 'Schedule a Video Call',
    submitLabel: 'Submit Video Call Request',
    subject: 'Video Call Request',
    messageTemplate: (product) => `I would like to schedule a video call to view: ${product}`,
  },
  'try-at-home': {
    type: 'try-at-home',
    label: 'Try at Home',
    icon: 'Home',
    pageTitle: 'Try at Home',
    submitLabel: 'Submit Try at Home Request',
    subject: 'Try at Home Request',
    messageTemplate: (product) => `I would like to try this piece at home: ${product}`,
  },
};

export function getContactServiceUrl(type, productName = '') {
  const params = new URLSearchParams({ type });
  if (productName) params.set('product', productName);
  return `/contact?${params.toString()}`;
}

export function getProductServiceAction(type) {
  return productServiceActions[type] || null;
}

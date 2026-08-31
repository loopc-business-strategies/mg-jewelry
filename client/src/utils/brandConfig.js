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

const slugToLabel = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const retailCategorySlugs = collectionCategories.filter((slug) => slug !== 'wholesale-collections');

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Collections', path: '/shop', menu: 'collections' },
  { label: 'Ecommerce', path: '/shop', menu: 'ecommerce' },
  { label: 'Contact', path: '/contact' },
];

export const retailNavLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'New Arrivals', path: '/shop?sort=newest' },
  { label: 'Best Sellers', path: '/shop?sort=best_selling' },
  ...retailCategorySlugs.map((slug) => ({
    label: slugToLabel(slug),
    path: `/shop/${slug}`,
  })),
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Cart', path: '/cart' },
];

export const wholesaleNavLinks = [
  { label: 'Wholesale Shop', path: '/wholesale/shop' },
  { label: 'Wholesale Collections', path: '/shop/wholesale-collections' },
  { label: 'Bulk Pricing', path: '/wholesale#bulk-pricing' },
  { label: 'Request a Quote', path: '/contact?type=quote' },
  { label: 'Become a Wholesale Partner', path: '/wholesale/register' },
  { label: 'Partner Login', path: '/login' },
  { label: 'Wholesale Dashboard', path: '/wholesale/dashboard' },
];

export const ecommerceMenu = {
  retail: {
    title: 'Retail',
    subtitle: 'Shop jewelry for individual customers',
    cta: { label: 'Shop Retail', path: '/shop' },
    links: [
      { label: 'Shop', path: '/shop' },
      { label: 'New Arrivals', path: '/shop?sort=newest' },
      { label: 'Best Sellers', path: '/shop?sort=best_selling' },
      { label: 'Collections', path: '/shop' },
      { label: 'Cart', path: '/cart' },
      { label: 'Wishlist', path: '/wishlist' },
    ],
  },
  wholesale: {
    title: 'Wholesale',
    subtitle: 'Bulk jewelry solutions for retailers, brands and distributors',
    cta: { label: 'Wholesale Partnership', path: '/wholesale/register' },
    secondaryCta: { label: 'Wholesale Shop', path: '/wholesale/shop' },
    links: [
      { label: 'Wholesale Shop', path: '/wholesale/shop' },
      { label: 'Wholesale Collections', path: '/shop/wholesale-collections' },
      { label: 'Bulk Pricing', path: '/wholesale#bulk-pricing' },
      { label: 'Request a Quote', path: '/contact?type=quote' },
      { label: 'Become a Partner', path: '/wholesale/register' },
      { label: 'Partner Login', path: '/login' },
    ],
  },
};

export function isEcommerceRoute(pathname) {
  return (
    pathname === '/shop' ||
    pathname.startsWith('/shop/') ||
    pathname.startsWith('/product/') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname === '/search' ||
    pathname === '/wishlist' ||
    pathname === '/wholesale' ||
    pathname.startsWith('/wholesale/')
  );
}

export function isCollectionsRoute(pathname) {
  return pathname === '/shop' || pathname.startsWith('/shop/');
}

export function isNavLinkActive(pathname, link) {
  if (link.menu === 'ecommerce') return isEcommerceRoute(pathname);
  if (link.menu === 'collections') return isCollectionsRoute(pathname) && !isEcommerceRoute(pathname);
  if (link.path === '/') return pathname === '/';
  return pathname === link.path || pathname.startsWith(`${link.path}/`);
}

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

export const heroTrustBadges = [
  { title: 'Certified Quality', desc: 'Hallmarked gold and verified diamonds.' },
  { title: 'Secure Shipping', desc: 'Insured delivery worldwide.' },
  { title: 'Lifetime Craftsmanship', desc: 'Precision made to endure.' },
];

export const servicePromises = [
  { title: 'Easy Returns', desc: '15-day hassle-free returns on retail orders.' },
  { title: 'Secure Payment', desc: 'Encrypted checkout and trusted payment methods.' },
  { title: 'Exceptional Quality', desc: 'Rigorous quality control at every stage.' },
  { title: 'Dedicated Support', desc: 'Personal assistance for every customer.' },
];

export const categoryShowcase = [
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'Rings', slug: 'rings' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Pendants', slug: 'pendants' },
  { name: 'Gold Jewelry', slug: 'gold-jewelry' },
];

export const footerColumns = {
  shop: [
    { label: 'All Collections', path: '/shop' },
    { label: 'Rings', path: '/shop/rings' },
    { label: 'Necklaces', path: '/shop/necklaces' },
    { label: 'Earrings', path: '/shop/earrings' },
    { label: 'New Arrivals', path: '/shop?sort=newest' },
    { label: 'Best Sellers', path: '/shop?sort=best_selling' },
  ],
  about: [
    { label: 'Our Story', path: '/about' },
    { label: 'Custom Jewelry', path: '/custom-jewelry' },
    { label: 'Wholesale', path: '/wholesale' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ],
  help: [
    { label: 'Shipping', path: '/shipping' },
    { label: 'Returns', path: '/returns' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Track Order', path: '/track-order' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
  ],
};

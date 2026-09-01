export const brand = {
  name: 'Modern Gold Jewelry',
  logo: '/images/logo.png',
  favicon: '/images/favicon.png',
  appleTouchIcon: '/images/apple-touch-icon.png',
  logoAlt: 'Modern Gold Jewelry',
  legalName: 'Modern Gold Jewelry Manufacturing FE LLC',
  tagline: 'Crafted in Uzbekistan. Connected to the World.',
  heroSubtitle:
    'Premium jewelry manufacturing and collections created for customers, retailers, wholesalers and international partners across Central Asia, Russia, the UK, Singapore, Malaysia, Hong Kong, the United States and Dubai.',
  address: '242 Girvonbulok Street, Namangan Davlatabad, Namangan – Uzbekistan',
  addressLines: [
    '242 Girvonbulok Street',
    'Namangan Davlatabad',
    'Namangan – Uzbekistan',
  ],
  siteUrl: 'https://mg-jewelry.vercel.app',
  location: 'Namangan, Uzbekistan',
};

export const socialLinks = [
  { label: 'Instagram', icon: 'instagram', href: '/contact' },
  { label: 'Facebook', icon: 'facebook', href: '/contact' },
  { label: 'LinkedIn', icon: 'linkedin', href: '/contact' },
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

const slugToLabel = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const retailCategorySlugs = collectionCategories.filter((slug) => slug !== 'wholesale-collections');

export const navLinks = [
  { label: 'Home', path: '/', key: 'nav.home' },
  { label: 'About', path: '/about', key: 'nav.about' },
  { label: 'Collections', path: '/shop', menu: 'collections', key: 'nav.collections' },
  { label: 'Retail', path: '/shop', menu: 'retail', key: 'nav.retail' },
  { label: 'Wholesale', path: '/wholesale', menu: 'wholesale', key: 'nav.wholesale' },
  { label: 'Contact', path: '/contact', key: 'nav.contact' },
];

export const sellGoldCta = {
  label: 'Sell Gold',
  path: '/gold-buying',
  key: 'nav.sellGold',
};

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

export const retailMenu = {
  title: 'Retail',
  subtitle: 'Shop jewelry for individual customers',
  cta: { label: 'Shop Retail', path: '/shop' },
  links: [
    { label: 'Shop', path: '/shop', key: 'retailMenu.shop' },
    { label: 'New Arrivals', path: '/shop?sort=newest', key: 'retailMenu.newArrivals' },
    { label: 'Best Sellers', path: '/shop?sort=best_selling', key: 'retailMenu.bestSellers' },
    { label: 'Collections', path: '/shop', key: 'retailMenu.collections' },
    { label: 'Cart', path: '/cart', key: 'retailMenu.cart' },
    { label: 'Wishlist', path: '/wishlist', key: 'retailMenu.wishlist' },
  ],
};

export const wholesaleMenu = {
  title: 'Wholesale',
  subtitle: 'Bulk jewelry solutions for retailers, brands and distributors',
  cta: { label: 'Wholesale Partnership', path: '/wholesale/register', key: 'wholesaleMenu.partnership' },
  secondaryCta: { label: 'Wholesale Shop', path: '/wholesale/shop', key: 'wholesaleMenu.shopCta' },
  links: [
    { label: 'Wholesale Shop', path: '/wholesale/shop', key: 'wholesaleMenu.shop' },
    { label: 'Wholesale Collections', path: '/shop/wholesale-collections', key: 'wholesaleMenu.collections' },
    { label: 'Bulk Pricing', path: '/wholesale#bulk-pricing', key: 'wholesaleMenu.bulkPricing' },
    { label: 'Request a Quote', path: '/contact?type=quote', key: 'wholesaleMenu.quote' },
    { label: 'Become a Partner', path: '/wholesale/register', key: 'wholesaleMenu.becomePartner' },
    { label: 'Partner Login', path: '/login', key: 'wholesaleMenu.partnerLogin' },
  ],
};

/** @deprecated Use retailMenu / wholesaleMenu */
export const ecommerceMenu = { retail: retailMenu, wholesale: wholesaleMenu };

export function isRetailRoute(pathname) {
  return (
    pathname.startsWith('/product/') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname === '/search' ||
    pathname === '/wishlist'
  );
}

export function isWholesaleRoute(pathname) {
  return (
    pathname === '/wholesale' ||
    pathname.startsWith('/wholesale/') ||
    pathname.startsWith('/shop/wholesale-collections')
  );
}

export function isCollectionsRoute(pathname) {
  if (pathname.startsWith('/shop/wholesale-collections')) return false;
  return pathname === '/shop' || pathname.startsWith('/shop/');
}

export function isNavLinkActive(pathname, link) {
  if (link.menu === 'retail') return isRetailRoute(pathname);
  if (link.menu === 'wholesale') return isWholesaleRoute(pathname);
  if (link.menu === 'collections') return isCollectionsRoute(pathname);
  if (link.path === '/') return pathname === '/';
  return pathname === link.path || pathname.startsWith(`${link.path}/`);
}

export const manufacturingSteps = [
  { step: '01', title: 'Design', desc: 'Concept development and jewelry design.' },
  { step: '02', title: 'Development', desc: 'CAD refinement and production preparation.' },
  { step: '03', title: 'Casting', desc: 'Precision jewelry manufacturing.' },
  { step: '04', title: 'Finishing', desc: 'Polishing, detailing and surface finishing.' },
  { step: '05', title: 'Quality Control', desc: 'Detailed inspection and quality verification.' },
  { step: '06', title: 'International Delivery', desc: 'Prepared for international customers and business partners.' },
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
  'International jewellers',
  'Gold traders',
  'Jewelry wholesalers',
  'Retailers',
  'Jewelry brands',
  'Distributors',
  'International buyers',
  'Private-label businesses',
];

export const oppositeModelCopy =
  'Most jewellers sell to local customers. Modern Gold works the opposite way — local people sell gold to us, and international traders and jewellers buy manufactured jewellery from us.';

export const goldBuyingSteps = [
  'Submit your request',
  'Visit or contact Modern Gold',
  'Gold inspection',
  'Weight and purity assessment',
  'Valuation',
  'Receive quotation',
];

export const buyerJourneySteps = [
  'Explore collections',
  'Register your business',
  'Verification',
  'Request a quotation',
  'Place order',
];

export const credibilityPoints = [
  { title: 'Legal Entity', desc: 'Modern Gold Jewelry Manufacturing FE LLC — registered in Uzbekistan.' },
  { title: 'Central Asia HQ', desc: 'Headquartered in Namangan, Uzbekistan.' },
  { title: 'Manufacturing', desc: 'Professional jewellery production for international partners.' },
  { title: 'International Trade', desc: 'Serving gold traders, jewellers and wholesalers worldwide.' },
];

export const countries = [
  'Uzbekistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan',
  'Russia', 'United Kingdom', 'United States', 'United Arab Emirates',
  'Singapore', 'Malaysia', 'Hong Kong', 'India', 'Turkey', 'Germany',
  'France', 'Italy', 'China', 'Other',
];

export const businessTypes = [
  'Jeweller',
  'Gold Trader',
  'Wholesaler',
  'Distributor',
  'Manufacturer',
  'Retailer',
  'Other',
];

export const IMAGE_PLACEHOLDER_LABEL = 'Real Image Coming Soon';

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
  'jewelry supplier',
  'Central Asia jewelry',
  'international jewelry manufacturer',
  'gold jewelry wholesale',
  'private label jewelry',
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
  { name: 'Rings', slug: 'rings' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Bangles', slug: 'bangles' },
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'Pendants', slug: 'pendants' },
  { name: 'Diamond Jewelry', slug: 'diamond-jewelry' },
  { name: 'Gold Jewelry', slug: 'gold-jewelry' },
  { name: 'Bridal Jewelry', slug: 'bridal-jewelry' },
  { name: 'Custom Jewelry', slug: 'custom-jewelry' },
  { name: 'Wholesale Collections', slug: 'wholesale-collections' },
];

export const footerColumns = {
  shop: [
    { label: 'Home', path: '/' },
    { label: 'All Collections', path: '/shop' },
    { label: 'Rings', path: '/shop/rings' },
    { label: 'Necklaces', path: '/shop/necklaces' },
    { label: 'New Arrivals', path: '/shop?sort=newest' },
    { label: 'Best Sellers', path: '/shop?sort=best_selling' },
  ],
  about: [
    { label: 'About', path: '/about' },
    { label: 'Collections', path: '/shop' },
    { label: 'Custom Jewelry', path: '/custom-jewelry' },
    { label: 'Contact', path: '/contact' },
    { label: 'Sell Gold', path: '/gold-buying' },
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

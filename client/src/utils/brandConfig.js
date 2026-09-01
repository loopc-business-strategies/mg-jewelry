export const brand = {
  name: 'Modern Gold',
  legalName: 'Modern Gold Jewelry Manufacturing FE LLC',
  tagline: 'From Gold Supply to Global Markets',
  heroHeadline: 'Connecting Central Asian Gold to Global Markets',
  heroSubtitle:
    'Modern Gold operates across gold sourcing, jewellery manufacturing and international business — connecting regional gold supply with global markets.',
  address: '242 Girvonbulok Street, Namangan Davlatabad, Namangan – Uzbekistan',
  addressLines: [
    '242 Girvonbulok Street',
    'Namangan Davlatabad',
    'Namangan – Uzbekistan',
  ],
  siteUrl: 'https://mg-jewelry.vercel.app',
  location: 'Namangan, Uzbekistan',
  region: 'Central Asia',
  logo: '/images/logo-modern-gold.png',
};

export const socialLinks = [
  { label: 'Instagram', icon: 'instagram', href: '/contact' },
  { label: 'Facebook', icon: 'facebook', href: '/contact' },
  { label: 'LinkedIn', icon: 'linkedin', href: '/contact' },
];

export const productCategories = [
  { slug: 'chains', label: 'Chains' },
  { slug: 'bangles', label: 'Bangles' },
];

export const purityOptions = ['14K', '18K', '22K'];

export const businessTypes = [
  'Jeweller',
  'Wholesaler',
  'Gold Trader',
  'Distributor',
  'Manufacturer',
  'Retailer',
  'Other',
];

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Gold Buying', path: '/gold-buying' },
  { label: 'Manufacturing', path: '/manufacturing' },
  { label: 'Products', path: '/products' },
  { label: 'International Buyers', path: '/buyers' },
  { label: 'Markets', path: '/markets' },
  { label: 'News', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const headerCTAs = [
  { label: 'Sell Gold', path: '/gold-buying', variant: 'primary' },
  { label: 'Become a Buyer', path: '/buyers/register', variant: 'outline' },
];

export function isNavLinkActive(pathname, link) {
  if (link.path === '/') return pathname === '/';
  return pathname === link.path || pathname.startsWith(`${link.path}/`);
}

export function isProductsRoute(pathname) {
  return (
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname === '/shop' ||
    pathname.startsWith('/shop/') ||
    pathname.startsWith('/product/')
  );
}

// Legacy aliases — kept for backward compatibility
export const collectionCategories = ['chains', 'bangles'];
export const retailNavLinks = [];
export const wholesaleNavLinks = [
  { label: 'Buyer Dashboard', path: '/buyers/dashboard' },
  { label: 'Product Catalogue', path: '/products' },
  { label: 'Request Quote', path: '/rfq' },
  { label: 'Become a Buyer', path: '/buyers/register' },
];

export const manufacturingSteps = [
  { step: '01', title: 'Design & Specification', desc: 'Product development aligned with international standards.' },
  { step: '02', title: 'Gold Preparation', desc: 'Precision gold handling and alloy preparation.' },
  { step: '03', title: 'Production', desc: 'Chain and bangle manufacturing at scale.' },
  { step: '04', title: 'Finishing', desc: 'Polishing, detailing and surface finishing.' },
  { step: '05', title: 'Quality Control', desc: 'Weight, purity and craftsmanship verification.' },
  { step: '06', title: 'Packaging & Export', desc: 'Prepared for international business partners.' },
];

export const goldBuyingSteps = [
  'Submit your request',
  'Visit or contact Modern Gold',
  'Gold inspection',
  'Weight and purity assessment',
  'Valuation',
  'Receive quotation',
  'Accept or decline',
  'Complete transaction',
];

export const buyerJourneySteps = [
  'Explore products',
  'Register business',
  'Verification',
  'Request quotation',
  'Order',
];

export const trustIndicators = [
  { title: 'Regional Gold Expertise', desc: 'Deep knowledge of Central Asian gold markets and production.' },
  { title: 'Manufacturing Capability', desc: 'Professional chain and bangle production facilities.' },
  { title: 'International Business Focus', desc: 'Built to serve global jewellery traders and wholesalers.' },
  { title: 'Quality Standards', desc: 'Rigorous quality control at every production stage.' },
  { title: 'Gold Industry Growth', desc: 'Expanding from jewellery into broader gold industry operations.' },
  { title: 'Trusted Partnerships', desc: 'Dedicated support for international business relationships.' },
];

export const b2bAudience = [
  'International jewellers',
  'Gold traders',
  'Wholesalers',
  'Jewellery manufacturers',
  'Retail businesses',
  'Distributors',
];

export const categoryIcons = [
  { name: 'Chains', slug: 'chains', icon: '⛓' },
  { name: 'Bangles', slug: 'bangles', icon: '⭕' },
];

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'best_selling', label: 'Most Requested' },
];

export const seoKeywords = [
  'Modern Gold',
  'gold company Central Asia',
  'gold jewellery manufacturer',
  'gold chains manufacturer',
  'gold bangles manufacturer',
  '14K gold',
  '18K gold',
  '22K gold',
  'gold supplier',
  'gold wholesaler',
  'sell gold',
  'international gold jewellery supplier',
  'gold manufacturer Uzbekistan',
];

export const heroTrustBadges = [
  { title: 'Gold Industry Focus', desc: 'Sourcing, manufacturing and international trade.' },
  { title: 'Central Asia HQ', desc: 'Based in Namangan, Uzbekistan.' },
  { title: 'Global Markets', desc: 'Serving international business partners.' },
];

export const footerColumns = {
  company: [
    { label: 'About', path: '/about' },
    { label: 'Manufacturing', path: '/manufacturing' },
    { label: 'Markets', path: '/markets' },
    { label: 'News', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ],
  business: [
    { label: 'Sell Gold', path: '/gold-buying' },
    { label: 'International Buyers', path: '/buyers' },
    { label: 'Products', path: '/products' },
    { label: 'Chains', path: '/products/chains' },
    { label: 'Bangles', path: '/products/bangles' },
    { label: 'Request Quote', path: '/rfq' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Shipping', path: '/shipping' },
    { label: 'FAQ', path: '/faq' },
  ],
};

export const credibilityPoints = [
  { title: 'Regional Presence', desc: 'Headquartered in Namangan, Central Asia.' },
  { title: 'Manufacturing', desc: 'Professional gold chain and bangle production.' },
  { title: 'Gold Expertise', desc: '14K, 18K and 22K gold product capabilities.' },
  { title: 'International Business', desc: 'Built for global trade partnerships.' },
  { title: 'Industry Growth', desc: 'Expanding across the gold industry value chain.' },
];

export const companyStory = {
  phases: [
    { title: 'Jewellery Production', desc: 'Established manufacturing of gold chains and bangles for business buyers.' },
    { title: 'Gold Industry Expansion', desc: 'Growing beyond jewellery into broader gold industry operations.' },
    { title: 'Regional Growth', desc: 'Strengthening presence across Central Asia.' },
    { title: 'Exploration Direction', desc: 'Future focus on exploration and mining in the region. [Client to provide details]' },
    { title: 'International Markets', desc: 'Export markets — coming soon. [Client to provide]' },
  ],
};

export const manufacturingCapabilities = [
  'Factory',
  'Production',
  'Gold Handling',
  'Chain Production',
  'Bangle Production',
  'Quality Control',
  'Packaging',
  'Team',
];

export const IMAGE_PLACEHOLDER_LABEL = 'Real Image Coming Soon';

// Legacy exports for unused retail components
export const categoryShowcase = productCategories.map((c) => ({ name: c.label, slug: c.slug }));
export const servicePromises = [];
export const ecommerceMenu = { retail: { title: 'Retail', links: [] }, wholesale: { title: 'Wholesale', links: wholesaleNavLinks } };
export const isEcommerceRoute = isProductsRoute;
export const isCollectionsRoute = isProductsRoute;
export const whyChooseUs = trustIndicators;
export const categoryIcons_legacy = categoryIcons;

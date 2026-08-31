const { getProductImages, getCategoryImage } = require('../config/productImages');
const { adminEmail, adminPassword } = require('../config/env');
const { DEFAULT_TIERS } = require('./bulkPricing');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');

const path = require('path');
if (!process.env.RAILWAY_ENVIRONMENT && !process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const categoriesData = [
  { name: 'Rings', slug: 'rings', subcategories: [{ name: 'Diamond Rings', slug: 'diamond-rings' }, { name: 'Gold Rings', slug: 'gold-rings' }, { name: 'Solitaire Rings', slug: 'solitaire-rings' }, { name: 'Engagement Rings', slug: 'engagement-rings' }, { name: 'Wedding Rings', slug: 'wedding-rings' }], seoContent: 'Premium rings manufactured by Modern Gold Jewelry for international markets.' },
  { name: 'Earrings', slug: 'earrings', subcategories: [{ name: 'Stud Earrings', slug: 'stud-earrings' }, { name: 'Hoop Earrings', slug: 'hoop-earrings' }, { name: 'Drop Earrings', slug: 'drop-earrings' }], seoContent: 'Elegant earrings crafted with precision in Uzbekistan.' },
  { name: 'Necklaces', slug: 'necklaces', subcategories: [{ name: 'Gold Necklaces', slug: 'gold-necklaces' }, { name: 'Layered Necklaces', slug: 'layered-necklaces' }], seoContent: 'Refined necklaces for global jewelry partners.' },
  { name: 'Bracelets', slug: 'bracelets', subcategories: [{ name: 'Gold Bracelets', slug: 'gold-bracelets' }, { name: 'Diamond Bracelets', slug: 'diamond-bracelets' }, { name: 'Tennis Bracelets', slug: 'tennis-bracelets' }], seoContent: 'Premium bracelets in gold and diamond.' },
  { name: 'Pendants', slug: 'pendants', subcategories: [{ name: 'Gold Pendants', slug: 'gold-pendants' }, { name: 'Diamond Pendants', slug: 'diamond-pendants' }], seoContent: 'Beautiful pendants for international collections.' },
  { name: 'Gold Jewelry', slug: 'gold-jewelry', subcategories: [{ name: 'Gold Chains', slug: 'gold-chains' }, { name: 'Gold Sets', slug: 'gold-sets' }], seoContent: 'Fine gold jewelry manufacturing from Uzbekistan.' },
  { name: 'Diamond Jewelry', slug: 'diamond-jewelry', subcategories: [{ name: 'Diamond Rings', slug: 'diamond-rings' }, { name: 'Diamond Sets', slug: 'diamond-sets' }], seoContent: 'Diamond jewelry crafted to international standards.' },
  { name: 'Custom Jewelry', slug: 'custom-jewelry', subcategories: [{ name: 'Private Label', slug: 'private-label' }, { name: 'Bespoke Designs', slug: 'bespoke-designs' }], seoContent: 'Custom and private-label jewelry manufacturing.' },
  { name: 'Bridal Jewelry', slug: 'bridal-jewelry', subcategories: [{ name: 'Bridal Sets', slug: 'bridal-sets' }, { name: 'Wedding Bands', slug: 'wedding-bands' }], seoContent: 'Bridal jewelry collections for international markets.' },
  { name: 'Fashion Jewelry', slug: 'fashion-jewelry', subcategories: [{ name: 'Contemporary', slug: 'contemporary' }, { name: 'Statement Pieces', slug: 'statement-pieces' }], seoContent: 'Fashion-forward jewelry for modern retailers.' },
  { name: 'Wholesale Collections', slug: 'wholesale-collections', subcategories: [{ name: 'Bulk Orders', slug: 'bulk-orders' }, { name: 'Partner Collections', slug: 'partner-collections' }], seoContent: 'Wholesale jewelry collections for business partners.' },
];

const productNames = [
  ['Eternal Solitaire Ring', 'rings', 'solitaire-rings', 45999, 52999, 'Gold', '18K', 'women', true, false, true],
  ['Royal Diamond Studs', 'earrings', 'stud-earrings', 28999, 34999, 'Gold', '18K', 'women', false, true, false],
  ['Heritage Gold Necklace', 'necklaces', 'gold-necklaces', 89999, 99999, 'Gold', '22K', 'women', true, false, false],
  ['Grace Tennis Bracelet', 'bracelets', 'tennis-bracelets', 65999, 74999, 'Gold', '18K', 'women', false, false, true],
  ['Diamond Pendant Necklace', 'pendants', 'diamond-pendants', 38999, 44999, 'Gold', '18K', 'women', true, false, false],
  ['Classic Gold Chain', 'gold-jewelry', 'gold-chains', 79999, 89999, 'Gold', '22K', 'men', false, false, true],
  ['Diamond Line Bracelet', 'diamond-jewelry', 'diamond-sets', 94999, 109999, 'Gold', '18K', 'women', true, false, false],
  ['Private Label Ring Set', 'custom-jewelry', 'private-label', 34999, 39999, 'Gold', '18K', 'unisex', false, true, false],
  ['Bridal Full Set', 'bridal-jewelry', 'bridal-sets', 299999, 349999, 'Gold', '22K', 'women', true, false, true],
  ['Contemporary Hoop Earrings', 'fashion-jewelry', 'contemporary', 15999, 18999, 'Gold', '18K', 'women', false, false, true],
  ['Wholesale Partner Collection', 'wholesale-collections', 'partner-collections', 125999, 139999, 'Gold', '22K', 'unisex', true, false, false],
  ['Classic Engagement Ring', 'rings', 'engagement-rings', 55999, 64999, 'Gold', '18K', 'women', true, true, false],
  ['Pearl Drop Earrings', 'earrings', 'drop-earrings', 18999, 22999, 'Gold', '18K', 'women', false, false, false],
  ['Layered Gold Chain', 'necklaces', 'layered-necklaces', 42999, 49999, 'Gold', '18K', 'women', false, false, true],
  ['Minimal Gold Bracelet', 'bracelets', 'gold-bracelets', 24999, 28999, 'Gold', '18K', 'women', false, false, false],
  ['Gold Heart Pendant', 'pendants', 'gold-pendants', 12999, 15999, 'Gold', '18K', 'women', false, false, false],
  ['22K Gold Bangle Set', 'gold-jewelry', 'gold-sets', 189999, 209999, 'Gold', '22K', 'women', true, false, false],
  ['Diamond Solitaire Pendant', 'diamond-jewelry', 'diamond-sets', 35999, 42999, 'Gold', '18K', 'women', false, false, true],
  ['Bespoke Name Pendant', 'custom-jewelry', 'bespoke-designs', 14999, 17999, 'Gold', '18K', 'unisex', false, false, false],
  ['Platinum Wedding Band', 'bridal-jewelry', 'wedding-bands', 75999, 84999, 'Platinum', '950', 'unisex', false, false, true],
  ['Statement Choker', 'fashion-jewelry', 'statement-pieces', 31999, 36999, 'Gold', '18K', 'women', false, false, false],
  ['Bulk Order Gold Rings', 'wholesale-collections', 'bulk-orders', 89999, 99999, 'Gold', '18K', 'unisex', false, true, false],
  ['Couple Ring Set', 'rings', 'engagement-rings', 32999, 37999, 'Gold', '18K', 'unisex', false, false, false],
  ['Gold Hoop Earrings', 'earrings', 'hoop-earrings', 15999, 18999, 'Gold', '18K', 'women', false, false, true],
  ['Heritage Choker Necklace', 'necklaces', 'gold-necklaces', 54999, 62999, 'Gold', '22K', 'women', false, false, false],
  ['Men Gold Bracelet', 'bracelets', 'gold-bracelets', 54999, 62999, 'Gold', '22K', 'men', false, false, false],
  ['Cross Gold Pendant', 'pendants', 'gold-pendants', 9999, 12999, 'Gold', '18K', 'unisex', false, false, false],
  ['Premium Gold Chain Set', 'gold-jewelry', 'gold-sets', 99999, 114999, 'Gold', '22K', 'men', true, false, false],
  ['Diamond Cluster Ring', 'diamond-jewelry', 'diamond-rings', 65999, 74999, 'Gold', '18K', 'women', true, false, true],
  ['Custom Brand Collection', 'custom-jewelry', 'private-label', 199999, 229999, 'Gold', '22K', 'unisex', true, false, false],
  ['Bridal Diamond Set', 'bridal-jewelry', 'bridal-sets', 249999, 279999, 'Gold', '22K', 'women', true, false, true],
  ['Designer Fashion Ring', 'fashion-jewelry', 'contemporary', 22999, 26999, 'Gold', '18K', 'women', false, true, false],
];

async function seedRunner() {
  await User.create({ name: 'Admin', email: adminEmail, phone: '0000000000', password: adminPassword, role: 'admin' });
  await Category.insertMany(categoriesData.map((c, i) => ({
    ...c,
    image: getCategoryImage(c.slug),
    order: i,
    seoTitle: `${c.name} | Modern Gold Jewelry Manufacturer`,
    seoDescription: c.seoContent,
  })));

  const products = productNames.map(([name, category, subcategory, price, mrp, metal, purity, gender, featured, newArrival, bestSeller], i) => {
    const sku = `MGJ-${String(i + 1).padStart(4, '0')}`;
    const images = getProductImages(category, subcategory, sku);
    return {
      name, category, subcategory, price, mrp,
      sku,
      discount: Math.round(((mrp - price) / mrp) * 100),
      wholesalePrice: Math.round(price * 0.65),
      moq: 10, stock: 50 + Math.floor(Math.random() * 100),
      metal, purity, gender, featured, newArrival, bestSeller,
      shortDescription: `Premium ${metal} ${category.replace(/-/g, ' ')} — manufactured by Modern Gold Jewelry.`,
      description: `The ${name} is precision-crafted at our Namangan facility for international jewelry partners and discerning customers worldwide.`,
      images,
      sizes: category === 'rings' ? ['6', '7', '8', '9'] : ['Standard'],
      diamondDetails: name.toLowerCase().includes('diamond') ? { hasDiamond: true, carat: 0.25, clarity: 'VS', color: 'FG', cut: 'Excellent' } : { hasDiamond: false },
      rating: 4 + Math.random(), reviewCount: Math.floor(Math.random() * 50) + 5,
      occasion: ['wedding', 'daily wear'], tags: [category, metal],
      seoTitle: `${name} | Modern Gold Jewelry`,
      seoDescription: `Shop ${name} — premium ${metal} jewelry from Modern Gold Jewelry Manufacturing, Uzbekistan.`,
    };
  });

  await Product.insertMany(products);
  await Settings.create({ key: 'global', bulkPricingTiers: DEFAULT_TIERS });
  await Blog.insertMany([
    { title: 'How to Choose the Perfect Engagement Ring', slug: 'choose-perfect-engagement-ring', excerpt: 'A guide to selecting an engagement ring for your collection.', content: 'Choosing an engagement ring is one of the most meaningful decisions for jewelry retailers and partners. Modern Gold Jewelry offers precision-crafted solitaire and diamond rings manufactured in Uzbekistan for international markets.', category: 'Buying Guide', author: 'Modern Gold Jewelry', image: getCategoryImage('rings') },
    { title: 'Gold Jewelry Care Tips', slug: 'gold-jewellery-care-tips', excerpt: 'Keep your gold jewelry shining for years.', content: 'Proper care ensures gold jewelry retains its lustre. Share these tips with your customers to maintain the premium quality of Modern Gold Jewelry pieces.', category: 'Jewellery Care', author: 'Modern Gold Jewelry', image: getCategoryImage('gold-jewelry') },
    { title: 'International Jewelry Manufacturing Trends', slug: 'international-jewelry-trends', excerpt: 'Trends shaping global jewelry manufacturing.', content: 'From minimalist designs to statement bridal collections, international jewelry markets continue to evolve. Modern Gold Jewelry stays at the forefront of manufacturing excellence.', category: 'Fashion Trends', author: 'Modern Gold Jewelry', image: getCategoryImage('bridal-jewelry') },
  ]);
  console.log('Auto-seed completed');
}

module.exports = seedRunner;

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
  { name: 'Chains', slug: 'chains', subcategories: [{ name: 'Gold Chains', slug: 'gold-chains' }, { name: 'Cuban Chains', slug: 'cuban-chains' }, { name: 'Rope Chains', slug: 'rope-chains' }], seoContent: 'Professional gold chain manufacturing from Modern Gold, Uzbekistan.' },
  { name: 'Bangles', slug: 'bangles', subcategories: [{ name: 'Gold Bangles', slug: 'gold-bangles' }, { name: 'Kada Bangles', slug: 'kada-bangles' }], seoContent: 'Gold bangle manufacturing for international business buyers.' },
];

const productNames = [
  ['Classic Cuban Link Chain', 'chains', 'cuban-chains', 79999, 89999, 'Gold', '22K', 'unisex', true, false, true],
  ['Rope Chain 22K', 'chains', 'rope-chains', 65999, 74999, 'Gold', '22K', 'unisex', true, false, true],
  ['Figaro Chain 18K', 'chains', 'gold-chains', 45999, 52999, 'Gold', '18K', 'unisex', false, true, false],
  ['Box Chain 14K', 'chains', 'gold-chains', 32999, 38999, 'Gold', '14K', 'unisex', false, false, true],
  ['Singapore Chain 18K', 'chains', 'gold-chains', 38999, 44999, 'Gold', '18K', 'unisex', true, false, false],
  ['Curb Chain 22K', 'chains', 'cuban-chains', 89999, 99999, 'Gold', '22K', 'men', false, false, true],
  ['Snake Chain 18K', 'chains', 'gold-chains', 42999, 49999, 'Gold', '18K', 'women', false, false, false],
  ['Mariner Chain 14K', 'chains', 'gold-chains', 35999, 41999, 'Gold', '14K', 'men', false, true, false],
  ['Traditional Gold Bangle', 'bangles', 'gold-bangles', 54999, 62999, 'Gold', '22K', 'women', true, false, true],
  ['Plain Gold Kada', 'bangles', 'kada-bangles', 48999, 55999, 'Gold', '22K', 'men', true, false, false],
  ['Designer Bangle Set', 'bangles', 'gold-bangles', 189999, 209999, 'Gold', '22K', 'women', false, false, true],
  ['18K Gold Bangle Pair', 'bangles', 'gold-bangles', 89999, 99999, 'Gold', '18K', 'women', false, true, false],
  ['14K Lightweight Bangle', 'bangles', 'gold-bangles', 29999, 34999, 'Gold', '14K', 'women', false, false, false],
  ['Heavy Kada 22K', 'bangles', 'kada-bangles', 129999, 144999, 'Gold', '22K', 'men', true, false, true],
  ['Machine Cut Bangle', 'bangles', 'gold-bangles', 74999, 84999, 'Gold', '18K', 'women', false, false, true],
  ['Wholesale Chain Bundle', 'chains', 'gold-chains', 99999, 114999, 'Gold', '22K', 'unisex', true, false, false],
];

async function seedRunner() {
  await User.create({ name: 'Admin', email: adminEmail, phone: '0000000000', password: adminPassword, role: 'admin' });
  await Category.insertMany(categoriesData.map((c, i) => ({
    ...c,
    image: getCategoryImage(c.slug),
    order: i,
    seoTitle: `${c.name} | Modern Gold`,
    seoDescription: c.seoContent,
  })));

  const products = productNames.map(([name, category, subcategory, price, mrp, metal, purity, gender, featured, newArrival, bestSeller], i) => {
    const sku = `MG-${String(i + 1).padStart(4, '0')}`;
    const images = getProductImages(category, subcategory, sku);
    const isChain = category === 'chains';
    return {
      name, category, subcategory, price, mrp,
      sku,
      discount: Math.round(((mrp - price) / mrp) * 100),
      wholesalePrice: Math.round(price * 0.65),
      moq: isChain ? 20 : 10,
      stock: 50 + Math.floor(Math.random() * 100),
      metal, purity, gender, featured, newArrival, bestSeller,
      weight: isChain ? `${(15 + i * 2)}g` : `${(20 + i * 3)}g`,
      weightRange: isChain ? '10g–50g' : '15g–80g',
      length: isChain ? `${18 + (i % 4) * 2}"` : undefined,
      width: isChain ? `${3 + (i % 3)}mm` : undefined,
      diameter: !isChain ? `${2.2 + (i % 3) * 0.2}"` : undefined,
      design: isChain ? ['Cuban', 'Rope', 'Figaro', 'Box'][i % 4] : ['Plain', 'Machine Cut', 'Kada', 'Designer'][i % 4],
      finish: 'Polished',
      goldColour: 'Yellow',
      productionLeadTime: '2–4 weeks',
      availability: 'made_to_order',
      pricingModel: 'quote',
      shortDescription: `Professional ${purity} gold ${category.slice(0, -1)} — manufactured by Modern Gold for international buyers.`,
      description: `The ${name} is manufactured at our Namangan facility for international gold and jewellery business partners.`,
      images,
      sizes: ['Standard'],
      diamondDetails: { hasDiamond: false },
      rating: 4 + Math.random(), reviewCount: Math.floor(Math.random() * 20) + 2,
      occasion: ['wholesale'], tags: [category, metal, purity],
      seoTitle: `${name} | Modern Gold`,
      seoDescription: `${name} — ${purity} gold ${category} from Modern Gold, Central Asia.`,
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

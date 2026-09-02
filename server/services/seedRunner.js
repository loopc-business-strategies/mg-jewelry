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

function getCategoriesData() {
  return [
    {
      name: 'Chains',
      slug: 'chains',
      subcategories: [
        { name: 'Rope Chain', slug: 'rope-chain' },
        { name: 'Cuban Link', slug: 'cuban-chain' },
        { name: 'Figaro Chain', slug: 'figaro-chain' },
        { name: 'Box Chain', slug: 'box-chain' },
      ],
      seoContent: 'Premium gold chains manufactured by Modern Gold Jewelry in Namangan, Uzbekistan.',
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      subcategories: [
        { name: 'Classic Bangle', slug: 'classic-bangle' },
        { name: 'Kada Bangle', slug: 'kada-bangle' },
        { name: 'Hinged Bangle', slug: 'hinged-bangle' },
        { name: 'Stackable Bangle', slug: 'stackable-bangle' },
      ],
      seoContent: 'Handcrafted gold bangles for retail and wholesale partners worldwide.',
    },
  ];
}

const productNames = [
  ['Heritage Rope Chain', 'chains', 'rope-chain', 89999, 99999, 'Gold', '22K', 'unisex', true, false, true],
  ['Classic Cuban Link Chain', 'chains', 'cuban-chain', 124999, 139999, 'Gold', '22K', 'men', true, true, false],
  ['Figaro Chain Necklace', 'chains', 'figaro-chain', 54999, 62999, 'Gold', '18K', 'women', false, true, true],
  ['Box Chain — Slim', 'chains', 'box-chain', 42999, 49999, 'Gold', '18K', 'women', false, false, false],
  ['22K Gold Rope Chain', 'chains', 'rope-chain', 149999, 169999, 'Gold', '22K', 'men', true, false, true],
  ['Cuban Link — Medium', 'chains', 'cuban-chain', 99999, 114999, 'Gold', '22K', 'men', false, false, true],
  ['Layered Figaro Chain', 'chains', 'figaro-chain', 65999, 74999, 'Gold', '18K', 'women', false, false, false],
  ['Bold Box Chain', 'chains', 'box-chain', 78999, 89999, 'Gold', '22K', 'men', false, true, false],
  ['Delicate Rope Chain', 'chains', 'rope-chain', 35999, 41999, 'Gold', '18K', 'women', false, false, true],
  ['Statement Cuban Link', 'chains', 'cuban-chain', 189999, 209999, 'Gold', '22K', 'men', true, false, false],
  ['Men\'s Figaro Chain', 'chains', 'figaro-chain', 74999, 84999, 'Gold', '22K', 'men', false, false, false],
  ['Women\'s Box Chain', 'chains', 'box-chain', 48999, 55999, 'Gold', '18K', 'women', false, false, true],
  ['Classic Plain Bangle', 'bangles', 'classic-bangle', 45999, 52999, 'Gold', '22K', 'women', true, false, true],
  ['Traditional Kada Bangle', 'bangles', 'kada-bangle', 89999, 99999, 'Gold', '22K', 'men', true, true, false],
  ['Hinged Bangle — Polished', 'bangles', 'hinged-bangle', 65999, 74999, 'Gold', '18K', 'women', false, true, true],
  ['Stackable Bangle Set', 'bangles', 'stackable-bangle', 54999, 62999, 'Gold', '18K', 'women', false, false, true],
  ['22K Classic Bangle Pair', 'bangles', 'classic-bangle', 129999, 144999, 'Gold', '22K', 'women', true, false, false],
  ['Engraved Kada Bangle', 'bangles', 'kada-bangle', 109999, 124999, 'Gold', '22K', 'men', false, false, true],
  ['Slim Hinged Bangle', 'bangles', 'hinged-bangle', 38999, 44999, 'Gold', '18K', 'women', false, false, false],
  ['Minimal Stackable Bangle', 'bangles', 'stackable-bangle', 24999, 28999, 'Gold', '18K', 'women', false, false, false],
  ['Bridal Classic Bangle Set', 'bangles', 'classic-bangle', 199999, 219999, 'Gold', '22K', 'women', true, false, true],
  ['Men\'s Kada Bangle', 'bangles', 'kada-bangle', 94999, 109999, 'Gold', '22K', 'men', false, false, false],
  ['Diamond-Cut Hinged Bangle', 'bangles', 'hinged-bangle', 79999, 89999, 'Gold', '22K', 'women', false, true, false],
  ['Gold Stackable Trio', 'bangles', 'stackable-bangle', 69999, 79999, 'Gold', '18K', 'women', false, false, true],
];

function buildProducts() {
  return productNames.map(([name, category, subcategory, price, mrp, metal, purity, gender, featured, newArrival, bestSeller], i) => {
    const sku = `MGJ-${String(i + 1).padStart(4, '0')}`;
    const images = getProductImages(category, subcategory, sku);
    return {
      name,
      category,
      subcategory,
      price,
      mrp,
      sku,
      discount: Math.round(((mrp - price) / mrp) * 100),
      wholesalePrice: Math.round(price * 0.65),
      moq: 10,
      stock: 50 + Math.floor(Math.random() * 100),
      metal,
      purity,
      gender,
      featured,
      newArrival,
      bestSeller,
      shortDescription: `Premium ${metal} ${category.replace(/-/g, ' ')} — manufactured by Modern Gold Jewelry.`,
      description: `The ${name} is precision-crafted at our Namangan facility for international jewelry partners and discerning customers worldwide.`,
      images,
      sizes: ['Standard'],
      diamondDetails: { hasDiamond: false },
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 50) + 5,
      occasion: ['daily wear', 'festive'],
      tags: [category, metal],
      seoTitle: `${name} | Modern Gold Jewelry`,
      seoDescription: `Shop ${name} — premium ${metal} ${category} from Modern Gold Jewelry Manufacturing, Uzbekistan.`,
      translations: {
        en: {
          name,
          description: `The ${name} is precision-crafted at our Namangan facility for international jewelry partners and discerning customers worldwide.`,
          shortDescription: `Premium ${metal} ${category.replace(/-/g, ' ')} — manufactured by Modern Gold Jewelry.`,
          seoTitle: `${name} | Modern Gold Jewelry`,
          seoDescription: `Shop ${name} — premium ${metal} ${category} from Modern Gold Jewelry Manufacturing, Uzbekistan.`,
        },
      },
      isDemo: true,
    };
  });
}

function getBlogPosts() {
  return [
    {
      title: 'How to Choose the Perfect Gold Chain',
      slug: 'choose-perfect-gold-chain',
      excerpt: 'A guide to selecting gold chains for your collection.',
      content: 'Choosing a gold chain depends on length, link style, and karat. Modern Gold Jewelry manufactures rope, cuban, figaro and box chains in Namangan for international markets.',
      category: 'Buying Guide',
      author: 'Modern Gold Jewelry',
      image: getCategoryImage('chains'),
    },
    {
      title: 'Gold Chain & Bangle Care Tips',
      slug: 'gold-chain-bangle-care-tips',
      excerpt: 'Keep your gold chains and bangles shining for years.',
      content: 'Proper care ensures gold chains and bangles retain their lustre. Share these tips with your customers to maintain the premium quality of Modern Gold Jewelry pieces.',
      category: 'Jewellery Care',
      author: 'Modern Gold Jewelry',
      image: getCategoryImage('bangles'),
    },
    {
      title: 'International Chain & Bangle Trends',
      slug: 'international-chain-bangle-trends',
      excerpt: 'Trends shaping global gold chain and bangle manufacturing.',
      content: 'From cuban links to stackable bangles, international jewelry markets continue to evolve. Modern Gold Jewelry specializes in chains and bangles crafted in Uzbekistan.',
      category: 'Fashion Trends',
      author: 'Modern Gold Jewelry',
      image: getCategoryImage('chains'),
    },
  ];
}

async function seedRunner() {
  await User.create({ name: 'Admin', email: adminEmail, phone: '0000000000', password: adminPassword, role: 'admin' });

  const categoriesData = getCategoriesData();
  await Category.insertMany(categoriesData.map((c, i) => ({
    ...c,
    image: getCategoryImage(c.slug),
    order: i,
    seoTitle: `${c.name} | Modern Gold Jewelry Manufacturer`,
    seoDescription: c.seoContent,
  })));

  await Product.insertMany(buildProducts());
  await Settings.create({ key: 'global', bulkPricingTiers: DEFAULT_TIERS });
  await Blog.insertMany(getBlogPosts());
  console.log('Auto-seed completed');
}

module.exports = seedRunner;
module.exports.getCategoriesData = getCategoriesData;
module.exports.buildProducts = buildProducts;
module.exports.getBlogPosts = getBlogPosts;

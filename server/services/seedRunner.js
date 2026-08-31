const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Blog = require('../models/Blog');
const { adminEmail, adminPassword } = require('../config/env');
const { DEFAULT_TIERS } = require('./bulkPricing');

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const categoriesData = [
  { name: 'Rings', slug: 'rings', image: img('1515562141207-7a88fb7071ee'), subcategories: [{ name: 'Diamond Rings', slug: 'diamond-rings' }, { name: 'Gold Rings', slug: 'gold-rings' }, { name: 'Solitaire Rings', slug: 'solitaire-rings' }, { name: 'Engagement Rings', slug: 'engagement-rings' }, { name: 'Wedding Rings', slug: 'wedding-rings' }], seoContent: 'Discover exquisite rings crafted in gold and diamond.' },
  { name: 'Earrings', slug: 'earrings', image: img('1535632066922-ab7c3ab60908'), subcategories: [{ name: 'Stud Earrings', slug: 'stud-earrings' }, { name: 'Hoop Earrings', slug: 'hoop-earrings' }, { name: 'Jhumkas', slug: 'jhumkas' }], seoContent: 'Shop premium earrings from studs to jhumkas.' },
  { name: 'Necklaces', slug: 'necklaces', image: img('1599643478518-a784e069c662'), subcategories: [{ name: 'Gold Necklaces', slug: 'gold-necklaces' }, { name: 'Pendant Necklaces', slug: 'pendant-necklaces' }], seoContent: 'Elegant necklaces for every occasion.' },
  { name: 'Bracelets', slug: 'bracelets', image: img('1611591431799-11f2980a0c7f'), subcategories: [{ name: 'Gold Bracelets', slug: 'gold-bracelets' }, { name: 'Tennis Bracelets', slug: 'tennis-bracelets' }], seoContent: 'Refined bracelets in gold and diamond.' },
  { name: 'Bangles', slug: 'bangles', image: img('1605100804763-247f67b3557e'), subcategories: [{ name: 'Gold Bangles', slug: 'gold-bangles' }, { name: 'Bridal Bangles', slug: 'bridal-bangles' }], seoContent: 'Traditional and contemporary bangles.' },
  { name: 'Mangalsutra', slug: 'mangalsutra', image: img('1602751584552-8ba73aad10e2'), subcategories: [{ name: 'Diamond Mangalsutra', slug: 'diamond-mangalsutra' }], seoContent: 'Sacred mangalsutras blending tradition with modern design.' },
  { name: "Men's Jewellery", slug: 'men-jewellery', image: img('1617032210318-096e6c314904'), subcategories: [{ name: "Men's Rings", slug: 'mens-rings' }, { name: "Men's Chains", slug: 'mens-chains' }], seoContent: 'Bold jewellery for the modern gentleman.' },
  { name: "Women's Jewellery", slug: 'women-jewellery', image: img('1515562141207-7a88fb7071ee'), subcategories: [{ name: "Women's Rings", slug: 'womens-rings' }], seoContent: 'Curated jewellery for the discerning woman.' },
  { name: 'Kids Jewellery', slug: 'kids-jewellery', image: img('1601121143461-0f9fa3697495'), subcategories: [{ name: 'Kids Earrings', slug: 'kids-earrings' }], seoContent: 'Adorable jewellery for little ones.' },
  { name: 'Gifting', slug: 'gifting', image: img('1543294001-f994f0f7d0e1'), subcategories: [{ name: 'Anniversary Gifts', slug: 'anniversary-gifts' }], seoContent: 'Thoughtful jewellery gifts.' },
  { name: 'More Jewellery', slug: 'more-jewellery', image: img('1601121143461-0f9fa3697495'), subcategories: [{ name: 'Nose Pins', slug: 'nose-pins' }, { name: 'Anklets', slug: 'anklets' }], seoContent: 'Nose pins, anklets, pendants, and more.' },
];

const productNames = [
  ['Eternal Solitaire Ring', 'rings', 'solitaire-rings', 45999, 52999, 'Gold', '18K', 'women', true, false, true],
  ['Royal Diamond Studs', 'earrings', 'stud-earrings', 28999, 34999, 'Gold', '18K', 'women', false, true, false],
  ['Heritage Gold Necklace', 'necklaces', 'gold-necklaces', 89999, 99999, 'Gold', '22K', 'women', true, false, false],
  ['Grace Tennis Bracelet', 'bracelets', 'tennis-bracelets', 65999, 74999, 'Gold', '18K', 'women', false, false, true],
  ['Traditional Gold Bangles Set', 'bangles', 'gold-bangles', 125999, 139999, 'Gold', '22K', 'women', true, false, true],
  ['Sacred Diamond Mangalsutra', 'mangalsutra', 'diamond-mangalsutra', 35999, 42999, 'Gold', '18K', 'women', false, false, true],
  ['Bold Men Chain', 'men-jewellery', 'mens-chains', 79999, 89999, 'Gold', '22K', 'men', false, false, false],
  ['Delicate Kids Earrings', 'kids-jewellery', 'kids-earrings', 8999, 10999, 'Gold', '18K', 'kids', false, true, false],
  ['Anniversary Gift Set', 'gifting', 'anniversary-gifts', 24999, 29999, 'Gold', '18K', 'unisex', true, false, false],
  ['Bridal Nose Pin', 'more-jewellery', 'nose-pins', 12999, 15999, 'Gold', '18K', 'women', false, false, false],
  ['Classic Engagement Ring', 'rings', 'engagement-rings', 55999, 64999, 'Gold', '18K', 'women', true, true, false],
  ['Pearl Drop Earrings', 'earrings', 'drop-earrings', 18999, 22999, 'Gold', '18K', 'women', false, false, false],
  ['Layered Gold Chain', 'necklaces', 'layered-necklaces', 42999, 49999, 'Gold', '18K', 'women', false, false, true],
  ['Minimal Gold Bracelet', 'bracelets', 'gold-bracelets', 24999, 28999, 'Gold', '18K', 'women', false, false, false],
  ['Bridal Bangle Collection', 'bangles', 'bridal-bangles', 189999, 209999, 'Gold', '22K', 'women', true, false, false],
  ['Modern Mangalsutra', 'mangalsutra', 'modern-mangalsutra', 27999, 32999, 'Gold', '18K', 'women', false, false, false],
  ['Men Signet Ring', 'men-jewellery', 'mens-rings', 34999, 39999, 'Gold', '18K', 'men', false, false, true],
  ['Floral Jhumka Earrings', 'earrings', 'jhumkas', 22999, 26999, 'Gold', '22K', 'women', true, false, false],
  ['Diamond Pendant Set', 'necklaces', 'pendant-necklaces', 38999, 44999, 'Gold', '18K', 'women', false, true, false],
  ['Couple Ring Set', 'rings', 'couple-rings', 32999, 37999, 'Gold', '18K', 'unisex', false, false, false],
  ['Gold Hoop Earrings', 'earrings', 'hoop-earrings', 15999, 18999, 'Gold', '18K', 'women', false, false, true],
  ['Choker Necklace', 'necklaces', 'chokers', 31999, 36999, 'Gold', '18K', 'women', false, false, false],
  ['Kids Gold Bracelet', 'kids-jewellery', 'kids-bracelets', 11999, 13999, 'Gold', '18K', 'kids', false, false, false],
  ['Festive Gift Hamper', 'gifting', 'festive-gifts', 19999, 24999, 'Gold', '18K', 'unisex', true, false, false],
  ['Silver Anklet Pair', 'more-jewellery', 'anklets', 9999, 12999, 'Silver', '925', 'women', false, false, false],
  ['Platinum Wedding Band', 'rings', 'wedding-rings', 75999, 84999, 'Platinum', '950', 'unisex', false, false, true],
  ['Diamond Line Bracelet', 'bracelets', 'diamond-bracelets', 94999, 109999, 'Gold', '18K', 'women', true, false, false],
  ['Traditional Toe Rings', 'more-jewellery', 'toe-rings', 7999, 9999, 'Silver', '925', 'women', false, false, false],
  ['Men Gold Bracelet', 'men-jewellery', 'mens-bracelets', 54999, 62999, 'Gold', '22K', 'men', false, false, false],
  ['Women Gold Ring Stack', 'women-jewellery', 'womens-rings', 19999, 23999, 'Gold', '18K', 'women', false, true, false],
  ['Bridal Full Set', 'more-jewellery', 'bridal-jewellery', 299999, 349999, 'Gold', '22K', 'women', true, false, true],
  ['Personalized Name Pendant', 'more-jewellery', 'personalized-jewellery', 14999, 17999, 'Gold', '18K', 'unisex', false, false, false],
];

const imageIds = ['1515562141207-7a88fb7071ee', '1535632066922-ab7c3ab60908', '1599643478518-a784e069c662', '1611591431799-11f2980a0c7f', '1605100804763-247f67b3557e'];

async function seedRunner() {
  await User.create({ name: 'Admin', email: adminEmail, phone: '9999999999', password: adminPassword, role: 'admin' });
  await Category.insertMany(categoriesData.map((c, i) => ({ ...c, order: i })));

  const products = productNames.map(([name, category, subcategory, price, mrp, metal, purity, gender, featured, newArrival, bestSeller], i) => {
    const imgId = imageIds[i % imageIds.length];
    return {
      name, category, subcategory, price, mrp,
      sku: `AG-${String(i + 1).padStart(4, '0')}`,
      discount: Math.round(((mrp - price) / mrp) * 100),
      wholesalePrice: Math.round(price * 0.65),
      moq: 10, stock: 50 + Math.floor(Math.random() * 100),
      metal, purity, gender, featured, newArrival, bestSeller,
      shortDescription: `Premium ${metal} ${category} with exquisite craftsmanship.`,
      description: `Crafted with precision, the ${name} embodies timeless elegance.`,
      images: [img(imgId), img(imageIds[(i + 1) % imageIds.length])],
      sizes: category === 'rings' ? ['6', '7', '8', '9'] : ['Standard'],
      diamondDetails: name.toLowerCase().includes('diamond') ? { hasDiamond: true, carat: 0.25, clarity: 'VS', color: 'FG', cut: 'Excellent' } : { hasDiamond: false },
      rating: 4 + Math.random(), reviewCount: Math.floor(Math.random() * 50) + 5,
      occasion: ['wedding', 'daily wear'], tags: [category, metal],
    };
  });

  await Product.insertMany(products);
  await Settings.create({ key: 'global', bulkPricingTiers: DEFAULT_TIERS });
  await Blog.insertMany([
    { title: 'How to Choose the Perfect Engagement Ring', slug: 'choose-perfect-engagement-ring', excerpt: 'A guide to selecting an engagement ring.', content: 'Choosing an engagement ring is one of the most meaningful decisions...', category: 'Buying Guide', author: 'Aurum Grove', image: img('1515562141207-7a88fb7071ee') },
    { title: 'Gold Jewellery Care Tips', slug: 'gold-jewellery-care-tips', excerpt: 'Keep your gold jewellery shining.', content: 'Proper care ensures your gold jewellery retains its lustre...', category: 'Jewellery Care', author: 'Aurum Grove', image: img('1605100804763-247f67b3557e') },
    { title: 'Wedding Jewellery Trends 2026', slug: 'wedding-jewellery-trends-2026', excerpt: 'Latest wedding jewellery trends.', content: 'From minimalist mangalsutras to statement bridal sets...', category: 'Wedding Jewellery', author: 'Aurum Grove', image: img('1602751584552-8ba73aad10e2') },
  ]);
  console.log('Auto-seed completed');
}

module.exports = seedRunner;

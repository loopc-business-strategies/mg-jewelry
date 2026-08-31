const Settings = require('../models/Settings');

const DEFAULT_TIERS = [
  { minQty: 10, maxQty: 24, discountPercent: 5, label: 'Level 1' },
  { minQty: 25, maxQty: 49, discountPercent: 10, label: 'Level 2' },
  { minQty: 50, maxQty: 99, discountPercent: 15, label: 'Level 3' },
  { minQty: 100, maxQty: null, discountPercent: 20, label: 'Special Pricing' },
];

const getBulkPricingTiers = async () => {
  const settings = await Settings.findOne({ key: 'global' });
  return settings?.bulkPricingTiers?.length ? settings.bulkPricingTiers : DEFAULT_TIERS;
};

const calculateTierPrice = (basePrice, quantity, tiers) => {
  const tier = tiers.find((t) => {
    if (t.maxQty === null) return quantity >= t.minQty;
    return quantity >= t.minQty && quantity <= t.maxQty;
  });
  if (!tier) return { price: basePrice, tierLabel: 'Standard', discountPercent: 0 };
  const discountedPrice = basePrice * (1 - tier.discountPercent / 100);
  return {
    price: Math.round(discountedPrice),
    tierLabel: tier.label,
    discountPercent: tier.discountPercent,
  };
};

const calculateCartTotals = (items, tiers) => {
  let subtotal = 0;
  const updatedItems = items.map((item) => {
    const basePrice = item.wholesalePrice || item.productId?.wholesalePrice || 0;
    const { price, tierLabel, discountPercent } = calculateTierPrice(basePrice, item.quantity, tiers);
    const total = price * item.quantity;
    subtotal += total;
    return {
      ...item.toObject?.() || item,
      appliedTierPrice: price,
      tierLabel,
      discountPercent,
      total,
    };
  });
  return { items: updatedItems, subtotal, total: subtotal };
};

module.exports = { getBulkPricingTiers, calculateTierPrice, calculateCartTotals, DEFAULT_TIERS };

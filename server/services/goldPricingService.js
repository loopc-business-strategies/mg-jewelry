const GoldRate = require('../models/GoldRate');

const PURITY_RATE_MAP = {
  '24K': 'rate24k',
  '22K': 'rate22k',
  '21K': 'rate21k',
  '18K': 'rate18k',
};

const getGoldRates = async () => {
  let rates = await GoldRate.findOne({ key: 'gold_rates' });
  if (!rates) {
    rates = await GoldRate.create({});
  }
  return rates;
};

const calculateGoldPrice = async (product) => {
  if (product.pricingMode !== 'dynamic') {
    return { price: product.price, mrp: product.mrp, breakdown: null };
  }

  const rates = await getGoldRates();
  const purityKey = PURITY_RATE_MAP[product.purity] || 'rate22k';
  const goldRate = rates[purityKey] || rates.rate22k;
  const weight = product.goldWeight || parseFloat(product.weight) || 0;
  const goldValue = weight * goldRate;
  const making = product.makingCharge ?? rates.defaultMakingCharge;
  const wastage = goldValue * ((product.wastagePercent ?? rates.defaultWastagePercent) / 100);
  const stone = product.stoneCharge || 0;
  const subtotal = goldValue + making + wastage + stone;
  const tax = subtotal * ((rates.defaultTaxPercent || 3) / 100);
  const price = Math.round(subtotal + tax);
  const mrp = Math.round(price * 1.15);

  return {
    price,
    mrp,
    breakdown: { goldValue, making, wastage, stone, tax, goldRate, weight },
  };
};

module.exports = { getGoldRates, calculateGoldPrice, PURITY_RATE_MAP };

const Stripe = require('stripe');
const { stripeSecretKey } = require('../config/env');

let stripe = null;

const getStripe = () => {
  if (!stripeSecretKey) return null;
  if (!stripe) stripe = new Stripe(stripeSecretKey);
  return stripe;
};

const createPaymentIntent = async ({ amount, currency = 'inr', metadata = {} }) => {
  const s = getStripe();
  if (!s) throw new Error('Stripe is not configured');
  return s.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

const constructWebhookEvent = (payload, signature) => {
  const s = getStripe();
  if (!s) throw new Error('Stripe is not configured');
  const { stripeWebhookSecret } = require('../config/env');
  return s.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
};

module.exports = { getStripe, createPaymentIntent, constructWebhookEvent };

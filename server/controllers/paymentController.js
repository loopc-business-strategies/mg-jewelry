const Order = require('../models/Order');
const { confirmStock, releaseStock } = require('../services/inventoryService');
const { constructWebhookEvent } = require('../services/stripeService');
const { sendOrderConfirmation } = require('../services/emailService');

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (order && order.paymentStatus !== 'paid') {
      const prevStatus = order.status;
      order.paymentStatus = 'paid';
      order.status = 'paid';
      order.paymentAmount = paymentIntent.amount / 100;
      order.statusHistory.push({ from: prevStatus, to: 'paid', note: 'Stripe webhook', at: new Date() });
      await confirmStock(order.items, order._id);
      await order.save();
      const email = order.shippingAddress?.email || order.guestEmail;
      if (email) await sendOrderConfirmation(email, order);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (order && order.paymentStatus !== 'paid') {
      await releaseStock(order.items, order._id);
      order.paymentStatus = 'failed';
      order.status = 'payment_failed';
      order.statusHistory.push({ from: order.status, to: 'payment_failed', note: 'Stripe payment failed', at: new Date() });
      await order.save();
    }
  }

  res.json({ received: true });
};

module.exports = { stripeWebhook };

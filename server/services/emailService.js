const nodemailer = require('nodemailer');
const { clientUrl } = require('../config/env');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mail = {
    from: process.env.EMAIL_FROM || 'noreply@moderngoldjewelry.com',
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]+>/g, ''),
  };

  const transport = getTransporter();
  if (!transport) {
    console.log('[email:dev]', { to, subject });
    return { dev: true };
  }
  return transport.sendMail(mail);
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Reset your Modern Gold Jewelry password',
    html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};

const sendOrderConfirmation = async (email, order) => {
  return sendEmail({
    to: email,
    subject: `Order confirmed — ${order.orderNumber}`,
    html: `<p>Thank you for your order <strong>${order.orderNumber}</strong>.</p><p>Total: ₹${order.total?.toLocaleString()}</p>`,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendOrderConfirmation };

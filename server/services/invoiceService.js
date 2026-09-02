const PDFDocument = require('pdfkit');

const generateInvoicePdf = (order, company = {}) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const name = company.name || 'Modern Gold Jewelry Manufacturing FE LLC';
    doc.fontSize(18).text(name, { align: 'center' });
    doc.fontSize(10).text(company.address || '242 Girvonbulok Street, Namangan, Uzbekistan', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice — ${order.orderNumber}`);
    doc.fontSize(10).text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Payment: ${order.paymentStatus} | Status: ${order.status}`);
    doc.moveDown();

    if (order.shippingAddress) {
      doc.text(`Ship to: ${order.shippingAddress.name}`);
      doc.text(`${order.shippingAddress.line1}, ${order.shippingAddress.city}`);
      doc.moveDown();
    }

    order.items?.forEach((item) => {
      doc.text(`${item.name} (${item.sku}) x${item.quantity} — ₹${(item.price * item.quantity).toLocaleString()}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${order.subtotal?.toLocaleString()}`);
    if (order.discount) doc.text(`Discount: -₹${order.discount?.toLocaleString()}`);
    doc.text(`Shipping: ₹${order.shipping?.toLocaleString()}`);
    doc.text(`Tax: ₹${order.tax?.toLocaleString()}`);
    doc.fontSize(12).text(`Total: ₹${order.total?.toLocaleString()}`, { underline: true });
    doc.end();
  });

module.exports = { generateInvoicePdf };

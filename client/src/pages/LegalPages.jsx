import SEOHead from '../components/SEOHead';
import { useState } from 'react';
import api from '../services/api';

export default function LegalPage({ title, content }) {
  return (
    <>
      <SEOHead title={title} path={`/${title.toLowerCase().replace(/\s+/g, '-')}`} />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-semibold text-charcoal text-4xl mb-8">{title}</h1>
        <div className="text-muted leading-relaxed space-y-4 text-sm">{content}</div>
      </div>
    </>
  );
}

export function PrivacyPage() {
  return <LegalPage title="Privacy Policy" content={<>
    <p>At Modern Gold Jewelry, we respect your privacy and are committed to protecting your personal data.</p>
    <p>We collect information you provide when creating an account, placing orders, or contacting us. This includes name, email, phone, and shipping address.</p>
    <p>We use this information to process orders, provide customer support, and improve our services. We do not sell your personal data to third parties.</p>
    <p>Payment card details are never stored on our servers. All transactions are processed through secure payment gateways.</p>
  </>} />;
}

export function TermsPage() {
  return <LegalPage title="Terms & Conditions" content={<>
    <p>By using the Modern Gold Jewelry website, you agree to these terms and conditions.</p>
    <p>All products are subject to availability. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</p>
    <p>We reserve the right to modify product prices and availability without prior notice.</p>
  </>} />;
}

export function RefundPage() {
  return <LegalPage title="Refund Policy" content={<>
    <p>We offer a 15-day return policy on eligible items. Products must be unused and in original packaging with certification tags intact.</p>
    <p>Customized or personalized jewellery cannot be returned. Refunds are processed within 7-10 business days after inspection.</p>
  </>} />;
}

export function ShippingPolicyPage() {
  return <LegalPage title="Shipping Policy" content={<>
    <p>Free shipping on orders above ₹5,000. Standard delivery takes 3-5 business days pan-India.</p>
    <p>Express delivery available in select cities. All shipments are fully insured.</p>
  </>} />;
}

export function FAQPage() {
  return <LegalPage title="FAQ" content={<>
    <p><strong>Is your gold BIS hallmarked?</strong> Yes, all our gold jewellery carries BIS hallmark certification.</p>
    <p><strong>Do you offer EMI?</strong> Yes, no-cost EMI is available on orders above ₹5,000.</p>
    <p><strong>How do I track my order?</strong> You will receive tracking details via email once your order is shipped.</p>
  </>} />;
}

export function ShippingPage() {
  return <ShippingPolicyPage />;
}

export function ReturnsPage() {
  return <RefundPage />;
}

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const { data } = await api.get('/orders/track', { params: { orderNumber, email } });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Track Order" path="/track-order" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-semibold text-charcoal text-4xl mb-8">Track Order</h1>
        <form onSubmit={handleTrack} className="space-y-4 mb-8">
          <input type="text" placeholder="Order number" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="input-elegant w-full" />
          <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-elegant w-full" />
          <button type="submit" disabled={loading} className="btn-primary-gold text-xs">{loading ? 'Searching...' : 'Track Order'}</button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {order && (
          <div className="card-elegant p-6 space-y-3 text-sm">
            <p><strong>Order:</strong> {order.orderNumber}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Total:</strong> ₹{order.total?.toLocaleString()}</p>
            {order.trackingUrl && <p><a href={order.trackingUrl} className="text-gold-dark hover:underline" target="_blank" rel="noreferrer">Track shipment</a></p>}
            {order.awbNumber && <p><strong>AWB:</strong> {order.awbNumber}</p>}
            {order.statusHistory?.length > 0 && (
              <div className="mt-4">
                <strong>Timeline</strong>
                <ul className="mt-2 space-y-1 text-muted">
                  {order.statusHistory.map((h, i) => (
                    <li key={i}>{new Date(h.at).toLocaleString()} — {h.to || h.note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

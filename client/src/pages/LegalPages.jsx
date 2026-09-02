import SEOHead from '../components/SEOHead';
import { useState } from 'react';
import api from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

export default function LegalPage({ title, content }) {
  return (
    <>
      <SEOHead title={title} path={`/${title.toLowerCase().replace(/\s+/g, '-')}`} />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="mb-8">{title}</h1>
        <div className="text-muted leading-relaxed space-y-4 text-sm">{content}</div>
      </div>
    </>
  );
}

export function PrivacyPage() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.privacy.title')} content={<>
    <p>{t('legal.privacy.p1')}</p>
    <p>{t('legal.privacy.p2')}</p>
    <p>{t('legal.privacy.p3')}</p>
    <p>{t('legal.privacy.p4')}</p>
  </>} />;
}

export function TermsPage() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.terms.title')} content={<>
    <p>{t('legal.terms.p1')}</p>
    <p>{t('legal.terms.p2')}</p>
    <p>{t('legal.terms.p3')}</p>
  </>} />;
}

export function RefundPage() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.refund.title')} content={<>
    <p>{t('legal.refund.p1')}</p>
    <p>{t('legal.refund.p2')}</p>
  </>} />;
}

export function ShippingPolicyPage() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.shipping.title')} content={<>
    <p>{t('legal.shipping.p1')}</p>
    <p>{t('legal.shipping.p2')}</p>
  </>} />;
}

export function FAQPage() {
  const { t } = useTranslation();
  return <LegalPage title={t('legal.faq.title')} content={<>
    <p><strong>{t('legal.faq.q1')}</strong> {t('legal.faq.a1')}</p>
    <p><strong>{t('legal.faq.q2')}</strong> {t('legal.faq.a2')}</p>
    <p><strong>{t('legal.faq.q3')}</strong> {t('legal.faq.a3')}</p>
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
  const { t } = useTranslation();

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const { data } = await api.get('/orders/track', { params: { orderNumber, email } });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || t('legal.track.notFound'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title={t('legal.track.title')} path="/track-order" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-semibold text-charcoal text-4xl mb-8">{t('legal.track.title')}</h1>
        <form onSubmit={handleTrack} className="space-y-4 mb-8">
          <input type="text" placeholder={t('legal.track.orderNumber')} required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="input-elegant w-full" />
          <input type="email" placeholder={t('legal.track.email')} required value={email} onChange={(e) => setEmail(e.target.value)} className="input-elegant w-full" />
          <button type="submit" disabled={loading} className="btn-primary-gold text-xs">{loading ? t('legal.track.searching') : t('legal.track.track')}</button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {order && (
          <div className="card-elegant p-6 space-y-3 text-sm">
            <p><strong>{t('legal.track.order')}:</strong> {order.orderNumber}</p>
            <p><strong>{t('legal.track.status')}:</strong> {order.status}</p>
            <p><strong>{t('legal.track.payment')}:</strong> {order.paymentStatus}</p>
            <p><strong>{t('legal.track.total')}:</strong> ₹{order.total?.toLocaleString()}</p>
            {order.trackingUrl && <p><a href={order.trackingUrl} className="text-gold-dark hover:underline" target="_blank" rel="noreferrer">{t('legal.track.trackShipment')}</a></p>}
            {order.awbNumber && <p><strong>{t('legal.track.awb')}:</strong> {order.awbNumber}</p>}
            {order.statusHistory?.length > 0 && (
              <div className="mt-4">
                <strong>{t('legal.track.timeline')}</strong>
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

import { useRef, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { brand, seoKeywords, sellGoldCta } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

const EMPTY_FORM = { fullName: '', phone: '' };

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

function newIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`;
}

function VisitContactCard({ t }) {
  return (
    <div className="p-6 bg-white border border-border rounded-xl shadow-sm space-y-4">
      <h2 className="type-card-title">{t('goldBuying.visitTitle')}</h2>
      <p className="type-body-sm text-charcoal">{t('goldBuying.visitCta')}</p>
      <div className="flex gap-3">
        <MapPin size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
        <address className="not-italic type-body-sm text-charcoal">
          <span className="sr-only">{t('goldBuying.locationLabel')}: </span>
          <span className="block font-medium text-charcoal">{brand.legalName}</span>
          {brand.addressLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </address>
      </div>
      {sellGoldCta.contactPhone && (
        <div className="flex gap-3 items-center">
          <Phone size={18} className="text-gold shrink-0" aria-hidden="true" />
          <p className="type-body-sm text-charcoal">
            <span className="sr-only">{t('goldBuying.phoneLabel')}: </span>
            <a href={telHref(sellGoldCta.contactPhone)} className="text-gold font-medium hover:underline">
              {sellGoldCta.contactPhone}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default function GoldBuyingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const idempotencyKeyRef = useRef('');
  const submittingRef = useRef(false);

  const update = (field) => (e) => {
    idempotencyKeyRef.current = '';
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = newIdempotencyKey();
    setLoading(true);
    setError('');
    try {
      await api.post(
        '/enquiries',
        { name: form.fullName, phone: form.phone, enquiryType: 'sell_gold' },
        { headers: { 'Idempotency-Key': idempotencyKeyRef.current } },
      );
      idempotencyKeyRef.current = '';
      setForm(EMPTY_FORM);
      setShowSuccess(true);
    } catch {
      setError(t('goldBuying.errorDesc'));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Sell Your Designs"
        description="Share your designs with Modern Gold in Namangan, Uzbekistan. We could export worldwide. Leave your name and phone number and our Relationship Manager will contact you."
        path="/gold-buying"
        keywords={[...seoKeywords, 'sell gold', 'sell jewellery designs', 'gold buyer Central Asia', 'sell gold Namangan']}
      />

      <div className="bg-white border-b border-border py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="section-eyebrow">{t('goldBuying.eyebrow')}</p>
          <h1 className="mb-4">{t('goldBuying.title')}</h1>
          <p className="type-section-desc prose-section">{t('goldBuying.intro')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-16">
        <div>
          <VisitContactCard t={t} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border p-6 md:p-8 rounded-xl space-y-4 shadow-sm self-start">
          <h2 className="type-card-title">{t('goldBuying.formTitle')}</h2>
          <p className="type-body-sm text-charcoal">{t('goldBuying.formLead')}</p>
          <div>
            <label htmlFor="sell-full-name" className="type-form-label">{t('goldBuying.fullName')} *</label>
            <input
              id="sell-full-name"
              required
              maxLength={120}
              autoComplete="name"
              value={form.fullName}
              onChange={update('fullName')}
              className="input-elegant"
            />
          </div>
          <div>
            <label htmlFor="sell-phone" className="type-form-label">{t('goldBuying.phone')} *</label>
            <input
              id="sell-phone"
              required
              type="tel"
              maxLength={40}
              autoComplete="tel"
              minLength={5}
              value={form.phone}
              onChange={update('phone')}
              className="input-elegant"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-gold w-full justify-center disabled:opacity-50">
            {loading ? t('common.submitting') : t('goldBuying.submit')}
          </button>
          {error && (
            <p role="alert" className="text-red-600 text-sm">
              {error}
            </p>
          )}
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={() => setShowSuccess(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="type-card-title">{t('goldBuying.successTitle')}</h2>
            <p className="type-body text-charcoal">{t('goldBuying.successDesc')}</p>
            <button type="button" onClick={() => setShowSuccess(false)} className="btn-primary-gold w-full justify-center">
              {t('goldBuying.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

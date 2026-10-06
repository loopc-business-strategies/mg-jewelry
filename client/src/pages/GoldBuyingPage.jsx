import { useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { goldBuyingSteps, seoKeywords, sellGoldCta } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

const EMPTY_FORM = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  enquiryType: '',
  requirement: '',
  message: '',
};

const ENQUIRY_TYPES = [
  { value: 'Sell Gold', key: 'sellGold' },
  { value: 'Buy Gold / Jewellery', key: 'buyGold' },
  { value: 'Wholesale / Bulk Order', key: 'wholesale' },
  { value: 'Custom Jewellery', key: 'custom' },
  { value: 'Partnership', key: 'partnership' },
  { value: 'Other', key: 'other' },
];

function CallUsLine({ label }) {
  if (!sellGoldCta.contactPhone) return null;
  return (
    <p className="type-body-sm text-charcoal">
      {label}{' '}
      <a href={`tel:${sellGoldCta.contactPhone.replace(/\s+/g, '')}`} className="text-gold font-medium hover:underline">
        {sellGoldCta.contactPhone}
      </a>
    </p>
  );
}

export default function GoldBuyingPage() {
  const { t } = useTranslation();
  const steps = t('steps.goldBuying');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { fullName, ...rest } = form;
    try {
      await api.post('/enquiries', { name: fullName, ...rest });
      setShowSuccess(true);
    } catch {
      setError(t('goldBuying.errorDesc'));
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setForm(EMPTY_FORM);
  };

  return (
    <>
      <SEOHead
        title="Sell Your Gold to Modern Gold"
        description="Sell your gold to Modern Gold in Namangan, Uzbekistan. Leave your details and our relationship manager will contact you."
        path="/gold-buying"
        keywords={[...seoKeywords, 'sell gold', 'gold buyer Central Asia', 'sell gold Namangan']}
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
          <h2 className="type-card-title mb-6">How It Works</h2>
          <ol className="space-y-3">
            {(Array.isArray(steps) ? steps : goldBuyingSteps).map((step, i) => (
              <li key={step} className="flex gap-3 type-body-sm text-charcoal">
                <span className="text-gold font-semibold shrink-0 type-micro normal-case">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="type-form-help mt-8 p-4 bg-white border border-border rounded-lg">
            Gold prices are determined after physical inspection and purity assessment. No guaranteed online pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border p-6 md:p-8 rounded-xl space-y-4 shadow-sm self-start">
          <h2 className="type-card-title mb-2">{t('goldBuying.formTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="type-form-label">{t('goldBuying.fullName')} *</label>
              <input required maxLength={120} value={form.fullName} onChange={update('fullName')} className="input-elegant" />
            </div>
            <div>
              <label className="type-form-label">{t('goldBuying.company')}</label>
              <input maxLength={160} value={form.company} onChange={update('company')} className="input-elegant" />
            </div>
            <div>
              <label className="type-form-label">{t('goldBuying.email')} *</label>
              <input required type="email" maxLength={200} value={form.email} onChange={update('email')} className="input-elegant" />
            </div>
            <div>
              <label className="type-form-label">{t('goldBuying.phone')} *</label>
              <input required type="tel" maxLength={40} value={form.phone} onChange={update('phone')} className="input-elegant" />
            </div>
          </div>
          <div>
            <label className="type-form-label">{t('goldBuying.enquiryType')} *</label>
            <select required value={form.enquiryType} onChange={update('enquiryType')} className="input-elegant">
              <option value="">{t('goldBuying.selectEnquiryType')}</option>
              {ENQUIRY_TYPES.map(({ value, key }) => (
                <option key={value} value={value}>{t(`goldBuying.enquiryTypes.${key}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="type-form-label">{t('goldBuying.requirement')} *</label>
            <input
              required
              maxLength={1000}
              value={form.requirement}
              onChange={update('requirement')}
              placeholder={t('goldBuying.requirementPlaceholder')}
              className="input-elegant"
            />
          </div>
          <div>
            <label className="type-form-label">{t('goldBuying.message')}</label>
            <textarea rows={4} maxLength={3000} value={form.message} onChange={update('message')} className="input-elegant" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-gold w-full justify-center disabled:opacity-50">
            {loading ? t('common.submitting') : t('goldBuying.submit')}
          </button>
          {error && (
            <p role="alert" className="type-body-sm text-red-600">
              {error}
            </p>
          )}
          <CallUsLine label={t('goldBuying.callUs')} />
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={closeSuccess}>
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="type-card-title">{t('goldBuying.successTitle')}</h2>
            <p className="type-body text-charcoal">{t('goldBuying.successDesc')}</p>
            <CallUsLine label={t('goldBuying.callUs')} />
            <button type="button" onClick={closeSuccess} className="btn-primary-gold w-full justify-center">
              {t('goldBuying.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

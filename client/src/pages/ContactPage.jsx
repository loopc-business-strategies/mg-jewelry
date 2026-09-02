import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { brand } from '../utils/brandConfig';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

const inquiryTypeIds = ['contact', 'quote', 'business'];

export default function ContactPage() {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get('type');
  const productQuery = params.get('product') || '';
  const activeType = typeParam === 'quote' ? 'quote' : typeParam === 'business' ? 'business' : 'contact';
  const { t, tf } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let subject = t(`contact.subjects.${activeType}`) || '';
    if (activeType === 'contact') subject = '';
    let message = '';
    if (productQuery) {
      subject = tf('contact.enquiry', { product: productQuery });
      message = tf('contact.quoteMessage', { product: productQuery });
    }
    setForm((f) => ({ ...f, subject, message: message || f.message }));
  }, [activeType, productQuery, t, tf]);

  const setInquiryType = (id) => {
    const newParams = new URLSearchParams();
    if (id === 'quote') newParams.set('type', 'quote');
    else if (id === 'business') newParams.set('type', 'business');
    setParams(newParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success(t('contact.success'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error(t('contact.failed'));
    } finally {
      setLoading(false);
    }
  };

  const activeLabel = t(`contact.types.${activeType}`);

  return (
    <>
      <SEOHead
        title={activeLabel}
        description={t('contact.seoDesc')}
        path="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <p className="section-eyebrow text-center">{t('contact.eyebrow')}</p>
        <h1 className="text-center mb-2">{activeLabel}</h1>
        <p className="text-center type-section-desc prose-section mx-auto mb-8">
          {t('contact.desc')}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {inquiryTypeIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setInquiryType(id)}
              className={`px-5 py-2.5 type-body-sm rounded-md border transition-colors ${
                activeType === id
                  ? 'bg-gold text-white border-border'
                  : 'bg-white border-border hover:border-border text-charcoal'
              }`}
            >
              {t(`contact.types.${id}`)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4 card-elegant p-8">
            {['name', 'email', 'phone', 'subject'].map((field) => (
              <div key={field}>
                <label className="type-form-label capitalize">{field === 'subject' ? t('contact.subject') : t(`form.${field === 'name' ? 'contactPerson' : field}`) || field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  required={field !== 'phone'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-elegant"
                />
              </div>
            ))}
            <div>
              <label className="type-form-label">{t('contact.message')}</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-elegant" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center disabled:opacity-50">
              {loading ? t('contact.sending') : activeType === 'quote' ? t('contact.submitQuote') : t('contact.sendMessage')}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-border">
              <h2 className="type-section-title mb-4">{brand.legalName}</h2>
              <div className="flex gap-4">
                <MapPin size={20} className="text-gold shrink-0 mt-1" />
                <address className="type-body-sm not-italic leading-relaxed">
                  {brand.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="type-card-title mb-3 text-gold">{t('contact.businessTitle')}</h3>
              <p className="type-body-sm mb-4">
                {t('contact.businessDesc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/wholesale" className="type-body-sm font-medium text-gold-dark hover:underline">{t('contact.wholesaleLink')}</Link>
                <Link to="/custom-jewelry" className="type-body-sm font-medium text-gold-dark hover:underline">{t('contact.customLink')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

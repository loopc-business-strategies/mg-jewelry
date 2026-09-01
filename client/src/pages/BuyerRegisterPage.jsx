import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { productCategories, purityOptions, countries } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const businessTypes = t('businessTypes');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', ownerName: '', email: '', phone: '', password: '',
    country: '', city: '', website: '', businessType: '', yearsInBusiness: '',
    expectedMonthlyPurchase: '', interestedProducts: [], preferredPurity: '', message: '',
    businessAddress: '', gstNumber: '', state: '', pincode: '',
  });

  const toggleProduct = (slug) => {
    setForm((prev) => ({
      ...prev,
      interestedProducts: prev.interestedProducts.includes(slug)
        ? prev.interestedProducts.filter((p) => p !== slug)
        : [...prev.interestedProducts, slug],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.interestedProducts.length) {
      toast.error('Please select at least one product category');
      return;
    }
    setLoading(true);
    try {
      await api.post('/wholesale/register', {
        ...form,
        categoriesInterested: form.interestedProducts,
      });
      toast.success('Application submitted! Pending approval.');
      navigate('/buyers/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'businessName', labelKey: 'form.companyName', required: true },
    { key: 'ownerName', labelKey: 'form.contactPerson', required: true },
    { key: 'email', labelKey: 'form.email', type: 'email', required: true },
    { key: 'phone', labelKey: 'form.phone', required: true },
    { key: 'password', labelKey: 'form.password', type: 'password', required: true },
    { key: 'country', labelKey: 'form.country', required: true, select: 'country' },
    { key: 'city', labelKey: 'form.city', required: true },
    { key: 'website', labelKey: 'form.website' },
    { key: 'yearsInBusiness', labelKey: 'form.yearsInBusiness' },
    { key: 'expectedMonthlyPurchase', labelKey: 'form.expectedMonthly' },
    { key: 'gstNumber', labelKey: 'form.taxId' },
    { key: 'state', labelKey: 'form.stateRegion' },
    { key: 'pincode', labelKey: 'form.postalCode' },
    { key: 'businessAddress', labelKey: 'form.businessAddress', full: true },
    { key: 'message', labelKey: 'form.message', full: true, textarea: true },
  ];

  return (
    <>
      <SEOHead title="Become an International Buyer" path="/buyers/register" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-2">{t('buyers.businessRegistration')}</p>
          <h1 className="headline-corporate headline-corporate-dark text-3xl mb-2">{t('buyers.registerTitle')}</h1>
          <p className="text-muted">{t('buyers.registerIntro')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gold/15 p-6 md:p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map(({ key, labelKey, type, required, full, textarea, select }) => (
              <div key={key} className={full ? 'md:col-span-2' : ''}>
                <label className="text-sm font-medium block mb-1">{t(labelKey)}{required ? ' *' : ''}</label>
                {textarea ? (
                  <textarea rows={3} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant resize-none" />
                ) : select === 'country' ? (
                  <select required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant">
                    <option value="">{t('form.country')}</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type={type || 'text'} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant" />
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">{t('form.businessType')} *</label>
            <select required value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="input-elegant">
              <option value="">{t('common.selectType')}</option>
              {(Array.isArray(businessTypes) ? businessTypes : []).map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">{t('form.interestedProducts')} *</label>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => toggleProduct(cat.slug)}
                  className={`px-4 py-2 text-sm border ${form.interestedProducts.includes(cat.slug) ? 'bg-gold text-dark border-gold' : 'border-gold/20'}`}
                >
                  {t(`common.${cat.slug}`) || cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">{t('form.preferredPurity')}</label>
            <select value={form.preferredPurity} onChange={(e) => setForm({ ...form, preferredPurity: e.target.value })} className="input-elegant">
              <option value="">{t('common.selectPurity')}</option>
              {purityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-gold-solid w-full justify-center disabled:opacity-50">
            {loading ? t('common.submitting') : t('cta.submitApplication')}
          </button>
        </form>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { businessTypes, countries } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';
import { apiErrorMessage } from '../utils/apiError';

export default function WholesaleRegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', ownerName: '', email: '', phone: '', password: '',
    country: '', gstNumber: '', businessType: '', businessAddress: '', city: '', state: '',
    pincode: '', website: '', expectedMonthlyPurchase: '', categoriesInterested: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/wholesale/register', form);
      toast.success(t('wholesaleRegister.submitted'));
      navigate('/wholesale/dashboard');
    } catch (err) {
      toast.error(apiErrorMessage(err, t, 'wholesaleRegister.failed'));
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
    { key: 'businessType', labelKey: 'form.businessType', required: true, select: 'businessType' },
    { key: 'gstNumber', labelKey: 'form.taxId' },
    { key: 'website', labelKey: 'form.website' },
    { key: 'expectedMonthlyPurchase', labelKey: 'wholesaleRegister.expectedMonthlyPurchase' },
    { key: 'businessAddress', labelKey: 'form.businessAddress', full: true },
    { key: 'state', labelKey: 'wholesaleRegister.state' },
    { key: 'pincode', labelKey: 'wholesaleRegister.postalCode' },
  ];

  return (
    <>
      <SEOHead title={t('wholesaleRegister.title')} path="/wholesale/register" />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-center mb-2">{t('wholesaleRegister.title')}</h1>
        <p className="text-center type-section-desc prose-section mx-auto mb-8">{t('wholesaleRegister.subtitle')}</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {fields.map(({ key, labelKey, type, required, full, select }) => (
            <div key={key} className={full ? 'md:col-span-2' : ''}>
              <label className="type-form-label">{t(labelKey)}{required ? ' *' : ''}</label>
              {select === 'country' ? (
                <select required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant">
                  <option value="">{t('common.selectCountry')}</option>
                  {countries.map((c) => <option key={c} value={c}>{t(`countries.${c}`, c)}</option>)}
                </select>
              ) : select === 'businessType' ? (
                <select required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant">
                  <option value="">{t('common.selectType')}</option>
                  {businessTypes.map((bt) => <option key={bt} value={bt}>{t(`businessTypes.${bt}`, bt)}</option>)}
                </select>
              ) : (
                <input
                  type={type || 'text'}
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-elegant"
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center text-xs disabled:opacity-50">
              {loading ? t('common.submitting') : t('cta.submitApplication')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

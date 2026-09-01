import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { businessTypes, countries } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

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
      toast.success('Application submitted! Pending approval.');
      navigate('/wholesale/dashboard');
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
    { key: 'businessType', labelKey: 'form.businessType', required: true, select: 'businessType' },
    { key: 'gstNumber', labelKey: 'form.taxId' },
    { key: 'website', labelKey: 'form.website' },
    { key: 'expectedMonthlyPurchase', label: 'Expected Monthly Purchase' },
    { key: 'businessAddress', labelKey: 'form.businessAddress', full: true },
    { key: 'state', label: 'State / Region' },
    { key: 'pincode', label: 'Postal Code' },
  ];

  return (
    <>
      <SEOHead title="Wholesale Registration" path="/wholesale/register" />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl text-center mb-2">Wholesale Registration</h1>
        <p className="text-center text-muted mb-8">International jewellers, gold traders and wholesalers — apply to partner with Modern Gold</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {fields.map(({ key, labelKey, label, type, required, full, select }) => (
            <div key={key} className={full ? 'md:col-span-2' : ''}>
              <label className="text-sm font-medium block mb-1">{labelKey ? t(labelKey) : label}{required ? ' *' : ''}</label>
              {select === 'country' ? (
                <select required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold">
                  <option value="">{t('common.selectCountry')}</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : select === 'businessType' ? (
                <select required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold">
                  <option value="">{t('common.selectType')}</option>
                  {businessTypes.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              ) : (
                <input
                  type={type || 'text'}
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium disabled:opacity-50">
              {loading ? t('common.submitting') : t('cta.submitApplication')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

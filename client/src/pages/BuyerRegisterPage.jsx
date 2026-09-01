import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { businessTypes, productCategories, purityOptions } from '../utils/brandConfig';
import toast from 'react-hot-toast';

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
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
    { key: 'businessName', label: 'Company Name', required: true },
    { key: 'ownerName', label: 'Contact Person', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', required: true },
    { key: 'password', label: 'Password', type: 'password', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'city', label: 'City', required: true },
    { key: 'website', label: 'Website' },
    { key: 'yearsInBusiness', label: 'Years in Business' },
    { key: 'expectedMonthlyPurchase', label: 'Expected Monthly Purchase' },
    { key: 'businessAddress', label: 'Business Address', full: true },
    { key: 'message', label: 'Message', full: true, textarea: true },
  ];

  return (
    <>
      <SEOHead title="Become an International Buyer" path="/buyers/register" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-2">Business Registration</p>
          <h1 className="headline-corporate headline-corporate-dark text-3xl mb-2">Become a Buyer</h1>
          <p className="text-muted">Register your business to access Modern Gold's B2B catalogue and quotation system.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gold/15 p-6 md:p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map(({ key, label, type, required, full, textarea }) => (
              <div key={key} className={full ? 'md:col-span-2' : ''}>
                <label className="text-sm font-medium block mb-1">{label}{required ? ' *' : ''}</label>
                {textarea ? (
                  <textarea rows={3} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant resize-none" />
                ) : (
                  <input type={type || 'text'} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-elegant" />
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Business Type *</label>
            <select required value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="input-elegant">
              <option value="">Select type</option>
              {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Interested Products</label>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => toggleProduct(cat.slug)}
                  className={`px-4 py-2 text-sm border ${form.interestedProducts.includes(cat.slug) ? 'bg-gold text-dark border-gold' : 'border-gold/20'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Preferred Purity</label>
            <select value={form.preferredPurity} onChange={(e) => setForm({ ...form, preferredPurity: e.target.value })} className="input-elegant">
              <option value="">Select purity</option>
              {purityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-gold-solid w-full justify-center disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';

export default function WholesaleRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', ownerName: '', email: '', phone: '', password: '',
    gstNumber: '', businessType: '', businessAddress: '', city: '', state: '',
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
    'businessName', 'ownerName', 'email', 'phone', 'password',
    'gstNumber', 'businessType', 'businessAddress', 'city', 'state',
    'pincode', 'website', 'expectedMonthlyPurchase',
  ];

  return (
    <>
      <SEOHead title="Wholesale Registration" path="/wholesale/register" />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl text-center mb-2">Wholesale Registration</h1>
        <p className="text-center text-muted mb-8">Apply to become an approved wholesale partner</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field} className={field === 'businessAddress' ? 'md:col-span-2' : ''}>
              <label className="text-sm font-medium capitalize block mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required={['businessName', 'ownerName', 'email', 'phone', 'password'].includes(field)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium disabled:opacity-50">
              {loading ? 'Submitting...' : 'SUBMIT APPLICATION'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

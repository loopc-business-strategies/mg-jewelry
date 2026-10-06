import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function WholesaleInquiryForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    businessName: '', contactPerson: '', email: '', phone: '',
    city: '', state: '', businessType: '', gstNumber: '',
    categoryInterested: '', expectedMonthlyQuantity: '', message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/wholesale/inquiry', form);
      toast.success(t('wholesaleInquiry.success'));
      setForm({ businessName: '', contactPerson: '', email: '', phone: '', city: '', state: '', businessType: '', gstNumber: '', categoryInterested: '', expectedMonthlyQuantity: '', message: '' });
    } catch {
      toast.error(t('wholesaleInquiry.failed'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'businessName', required: true },
    { name: 'contactPerson', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', required: true },
    { name: 'city' },
    { name: 'state' },
    { name: 'businessType' },
    { name: 'gstNumber' },
    { name: 'categoryInterested' },
    { name: 'expectedMonthlyQuantity' },
  ];

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      {fields.map(({ name, type, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{t(`wholesaleInquiry.${name}`)}</label>
          <input
            type={type || 'text'}
            required={required}
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>
      ))}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">{t('wholesaleInquiry.message')}</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={loading} className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors disabled:opacity-50">
          {loading ? t('common.submitting') : t('wholesaleInquiry.submit')}
        </button>
      </div>
    </form>
  );
}

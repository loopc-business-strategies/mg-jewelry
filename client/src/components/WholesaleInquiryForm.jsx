import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function WholesaleInquiryForm() {
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
      toast.success('Inquiry submitted! We will contact you soon.');
      setForm({ businessName: '', contactPerson: '', email: '', phone: '', city: '', state: '', businessType: '', gstNumber: '', categoryInterested: '', expectedMonthlyQuantity: '', message: '' });
    } catch {
      toast.error('Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'businessName', label: 'Business Name', required: true },
    { name: 'contactPerson', label: 'Contact Person', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'businessType', label: 'Business Type' },
    { name: 'gstNumber', label: 'GST Number' },
    { name: 'categoryInterested', label: 'Category Interested In' },
    { name: 'expectedMonthlyQuantity', label: 'Expected Monthly Quantity' },
  ];

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      {fields.map(({ name, label, type, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
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
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={loading} className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider transition-colors disabled:opacity-50">
          {loading ? 'Submitting...' : 'REQUEST WHOLESALE PRICING'}
        </button>
      </div>
    </form>
  );
}

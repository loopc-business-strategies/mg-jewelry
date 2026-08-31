import { useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { brand } from '../utils/brandConfig';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Contact Us" description={`Get in touch with ${brand.name}. We're here to help.`} path="/contact" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted mb-12">We'd love to hear from you</p>

        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'phone', 'subject'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize block mb-1">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  required={field !== 'phone'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium block mb-1">Message</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />
            </div>
            <button type="submit" disabled={loading} className="bg-gold text-white px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="space-y-6">
            {[
              { icon: MapPin, label: 'Office Address', value: brand.address },
              { icon: Phone, label: 'Phone', value: brand.phone },
              { icon: Mail, label: 'Email', value: brand.email },
              { icon: MessageCircle, label: 'WhatsApp', value: brand.whatsapp },
              { icon: Clock, label: 'Business Hours', value: brand.businessHours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <Icon size={20} className="text-gold shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-sm text-muted">{value}</p>
                </div>
              </div>
            ))}

            <div className="bg-cream rounded-xl h-64 flex items-center justify-center text-muted text-sm">
              Google Maps — Configure API key to enable
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

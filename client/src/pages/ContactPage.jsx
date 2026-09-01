import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { brand } from '../utils/brandConfig';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const inquiryTypes = [
  { id: 'contact', label: 'Contact', subject: '' },
  { id: 'quote', label: 'Request Quote', subject: 'Quote Request' },
  { id: 'business', label: 'Business Inquiry', subject: 'Business Inquiry' },
];

export default function ContactPage() {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get('type');
  const productQuery = params.get('product') || '';
  const activeType = typeParam === 'quote' ? 'quote' : typeParam === 'business' ? 'business' : 'contact';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = inquiryTypes.find((t) => t.id === activeType);
    let subject = type?.subject || '';
    let message = '';
    if (productQuery) {
      subject = `Enquiry: ${productQuery}`;
      message = `I would like to request a quote for: ${productQuery}`;
    }
    setForm((f) => ({ ...f, subject, message: message || f.message }));
  }, [activeType, productQuery]);

  const setInquiryType = (id) => {
    const params = new URLSearchParams();
    if (id === 'quote') params.set('type', 'quote');
    else if (id === 'business') params.set('type', 'business');
    setParams(params);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully! We will respond shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeLabel = inquiryTypes.find((t) => t.id === activeType)?.label || 'Contact';

  return (
    <>
      <SEOHead
        title={activeLabel}
        description={`Contact ${brand.legalName} for wholesale orders, custom manufacturing and international partnerships.`}
        path="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <p className="section-eyebrow text-center mb-2">Contact</p>
        <h1 className="font-semibold text-charcoal text-4xl text-center mb-2">{activeLabel}</h1>
        <p className="text-center text-muted mb-8 max-w-xl mx-auto">
          Reach out to discuss wholesale orders, custom jewelry manufacturing or international partnerships.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {inquiryTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setInquiryType(type.id)}
              className={`px-5 py-2.5 text-sm rounded-md border transition-colors ${
                activeType === type.id
                  ? 'bg-gold text-white border-border'
                  : 'bg-white border-border hover:border-border text-charcoal'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4 card-elegant p-8">
            {['name', 'email', 'phone', 'subject'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize block mb-1">{field === 'subject' ? 'Subject' : field}</label>
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
              <label className="text-sm font-medium block mb-1">Message</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-elegant" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center text-xs disabled:opacity-50">
              {loading ? 'Sending...' : activeType === 'quote' ? 'Submit Quote Request' : 'Send Message'}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-border">
              <h2 className="font-semibold text-charcoal text-2xl mb-4">{brand.legalName}</h2>
              <div className="flex gap-4">
                <MapPin size={20} className="text-gold shrink-0 mt-1" />
                <address className="text-sm text-muted not-italic leading-relaxed">
                  {brand.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-charcoal text-lg mb-3 text-gold">Business Enquiries</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                For wholesale partnerships, custom manufacturing and international orders, use the form or explore our business pages.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/wholesale" className="text-sm text-gold-dark font-medium hover:underline">Wholesale →</Link>
                <Link to="/custom-jewelry" className="text-sm text-gold-dark font-medium hover:underline">Custom Jewelry →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

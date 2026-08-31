import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import { brand, getProductServiceAction } from '../utils/brandConfig';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

function buildFormDefaults(type, productQuery) {
  const action = getProductServiceAction(type);
  if (action && productQuery) {
    return {
      subject: action.subject,
      message: action.messageTemplate(productQuery),
    };
  }
  if (action) {
    return { subject: action.subject, message: '' };
  }
  if (productQuery) {
    return {
      subject: `Enquiry: ${productQuery}`,
      message: `I would like to request a quote for: ${productQuery}`,
    };
  }
  return { subject: '', message: '' };
}

export default function ContactPage() {
  const [params] = useSearchParams();
  const type = params.get('type') || '';
  const productQuery = params.get('product') || '';
  const serviceAction = getProductServiceAction(type);

  const defaults = useMemo(
    () => buildFormDefaults(type, productQuery),
    [type, productQuery],
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaults.subject,
    message: defaults.message,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, ...defaults }));
  }, [defaults]);

  const pageTitle = serviceAction?.pageTitle || 'Contact Us';
  const submitLabel = serviceAction?.submitLabel || 'Send Message';

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

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={`Contact ${brand.legalName} for wholesale orders, custom manufacturing and international partnerships.`}
        path="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl text-center mb-2">
          {pageTitle}
        </h1>
        <p className="text-center text-muted mb-12 max-w-xl mx-auto">
          {serviceAction
            ? `Tell us about your interest${productQuery ? ` in ${productQuery}` : ''} and our team will get back to you shortly.`
            : 'Reach out to discuss wholesale orders, custom jewelry manufacturing or international partnerships.'}
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
            {['name', 'email', 'phone', 'subject'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize block mb-1">{field === 'subject' ? 'Subject' : field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  required={field !== 'phone'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gold/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-pearl/50"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium block mb-1">Message</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-gold/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-pearl/50" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gold text-white px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-gold-dark transition-colors">
              {loading ? 'Sending...' : submitLabel}
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-champagne/40 to-cream rounded-2xl p-8 border border-gold/10">
              <h2 className="font-display text-2xl text-charcoal mb-4">{brand.legalName}</h2>
              <div className="flex gap-4">
                <MapPin size={20} className="text-gold shrink-0 mt-1" />
                <address className="text-sm text-muted not-italic leading-relaxed">
                  {brand.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </div>
            </div>

            <div className="bg-ivory rounded-2xl p-6 border border-gold/10">
              <h3 className="font-display text-lg mb-3">Business Enquiries</h3>
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

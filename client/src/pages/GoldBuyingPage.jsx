import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import ScrollReveal from '../components/ScrollReveal';
import { goldBuyingSteps, seoKeywords } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

const GOLD_TYPES = ['Jewellery', 'Coins', 'Bars', 'Scrap Gold', 'Other'];
const PURITY_OPTIONS = ['24K', '22K', '18K', '14K', 'Unknown'];
const CONTACT_METHODS = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'visit', label: 'Visit in Person' },
];

export default function GoldBuyingPage() {
  const { t } = useTranslation();
  const steps = t('steps.goldBuying');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', city: '', goldType: '',
    approximateWeight: '', estimatedPurity: '', description: '',
    preferredContactMethod: 'phone', preferredAppointmentDate: '', message: '',
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
      images.forEach((file) => data.append('images', file));
      await api.post('/gold-buying/leads', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Valuation request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEOHead title="Sell Your Gold to Modern Gold" path="/gold-buying" keywords={seoKeywords} />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="headline-corporate headline-corporate-dark text-3xl mb-4">{t('goldBuying.received')}</h1>
          <p className="text-muted mb-8">
            {t('goldBuying.receivedDesc')}
          </p>
          <Link to="/" className="btn-gold-solid">{t('cta.returnHome')}</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Sell Your Gold to Modern Gold"
        description="Sell your gold to Modern Gold. Submit a valuation request — inspection, purity assessment and fair quotation."
        path="/gold-buying"
        keywords={[...seoKeywords, 'sell gold', 'gold buyer Central Asia']}
      />

      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <p className="section-eyebrow text-gold mb-3">{t('goldBuying.eyebrow')}</p>
            <h1 className="headline-corporate headline-corporate-light mb-4">
              {t('goldBuying.title')}
            </h1>
            <p className="text-off-white/70 max-w-2xl text-lg">
              {t('goldBuying.intro')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
          <ScrollReveal>
            <h2 className="headline-corporate headline-corporate-dark text-xl mb-8">How It Works</h2>
            <ol className="space-y-4">
              {(Array.isArray(steps) ? steps : goldBuyingSteps).map((step, i) => (
                <li key={step} className="process-step">
                  <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-charcoal pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted mt-8 p-4 bg-ivory border border-gold/10">
              Note: Gold prices are determined after physical inspection and purity assessment. No automatic guaranteed pricing is provided online.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <form onSubmit={handleSubmit} className="bg-white border border-gold/15 p-6 md:p-8 space-y-4">
              <h2 className="font-display font-semibold text-xl mb-2">Request Gold Valuation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium block mb-1">Full Name *</label>
                  <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-elegant" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-elegant" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-elegant" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">City *</label>
                  <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-elegant" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Gold Type</label>
                  <select value={form.goldType} onChange={(e) => setForm({ ...form, goldType: e.target.value })} className="input-elegant">
                    <option value="">Select type</option>
                    {GOLD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Approximate Weight</label>
                  <input placeholder="e.g. 50g" value={form.approximateWeight} onChange={(e) => setForm({ ...form, approximateWeight: e.target.value })} className="input-elegant" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Estimated Purity</label>
                  <select value={form.estimatedPurity} onChange={(e) => setForm({ ...form, estimatedPurity: e.target.value })} className="input-elegant">
                    <option value="">Select purity</option>
                    {PURITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Preferred Contact</label>
                  <select value={form.preferredContactMethod} onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })} className="input-elegant">
                    {CONTACT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Preferred Appointment Date</label>
                  <input type="date" value={form.preferredAppointmentDate} onChange={(e) => setForm({ ...form, preferredAppointmentDate: e.target.value })} className="input-elegant" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-elegant resize-none" placeholder="Describe your gold items..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium block mb-1">Message</label>
                  <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-elegant resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium block mb-1">Optional Image Upload</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setImages(Array.from(e.target.files))} className="text-sm" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold-solid w-full justify-center disabled:opacity-50">
                {loading ? t('common.submitting') : t('goldBuying.submit')}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

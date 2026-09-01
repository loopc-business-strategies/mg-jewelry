import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';

export default function RFQPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    targetDeliveryDate: '',
    destinationCountry: '',
    message: '',
  });

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('rfqDraft') || '[]');
    if (location.state?.product) {
      const { product, quantity, notes } = location.state;
      const existing = draft.find((i) => i.productId === product._id);
      if (!existing) {
        draft.push({
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          purity: product.purity,
          quantity: quantity || product.moq || 1,
          notes: notes || '',
        });
      }
      localStorage.setItem('rfqDraft', JSON.stringify(draft));
    }
    setItems(draft);
  }, [location.state]);

  const removeItem = (productId) => {
    const updated = items.filter((i) => i.productId !== productId);
    setItems(updated);
    localStorage.setItem('rfqDraft', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      toast.error('Add at least one product to your RFQ');
      return;
    }
    setLoading(true);
    try {
      await api.post('/rfqs', { items, ...form });
      localStorage.removeItem('rfqDraft');
      toast.success('RFQ submitted successfully!');
      navigate('/buyers/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit RFQ');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <SEOHead title="Request for Quotation" path="/rfq" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="section-eyebrow mb-2">RFQ</p>
        <h1 className="headline-corporate headline-corporate-dark text-3xl mb-8">Request for Quotation</h1>

        {items.length > 0 ? (
          <div className="bg-white border border-gold/15 p-6 mb-8">
            <h2 className="font-display font-semibold mb-4">Products ({items.length})</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gold/10 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted">{item.sku} · Qty: {item.quantity} · {item.purity}</p>
                  </div>
                  <button type="button" onClick={() => removeItem(item.productId)} className="text-xs text-ruby hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted mb-8">No products in RFQ. Browse the <a href="/products" className="text-gold-dark hover:underline">catalogue</a> and click "Add to RFQ".</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gold/15 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Target Delivery Date</label>
            <input type="date" value={form.targetDeliveryDate} onChange={(e) => setForm({ ...form, targetDeliveryDate: e.target.value })} className="input-elegant" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Destination Country *</label>
            <input required value={form.destinationCountry} onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })} className="input-elegant" placeholder="e.g. UAE, Turkey, India" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Message</label>
            <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-elegant resize-none" placeholder="Additional requirements, specifications, notes..." />
          </div>
          <button type="submit" disabled={loading || !items.length} className="btn-gold-solid w-full justify-center disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit RFQ'}
          </button>
        </form>
      </div>
    </>
  );
}

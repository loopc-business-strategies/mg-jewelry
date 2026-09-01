import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['NEW', 'UNDER_REVIEW', 'QUOTED', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'CONVERTED_TO_ORDER'];

export default function AdminRFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ totalAmount: '', currency: 'USD', validUntil: '', message: '' });
  const [loading, setLoading] = useState(true);

  const fetchRFQs = () => {
    api.get('/rfqs')
      .then(({ data }) => setRfqs(data.rfqs || []))
      .catch(() => toast.error('Failed to load RFQs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRFQs(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/rfqs/${id}`, { status });
      toast.success('Status updated');
      fetchRFQs();
    } catch {
      toast.error('Update failed');
    }
  };

  const createQuote = async (rfqId) => {
    try {
      const rfq = rfqs.find((r) => r._id === rfqId);
      await api.post(`/rfqs/${rfqId}/quote`, {
        ...quoteForm,
        totalAmount: Number(quoteForm.totalAmount),
        lineItems: rfq?.items?.map((item) => ({
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: 0,
          total: 0,
        })) || [],
      });
      toast.success('Quote created');
      setSelected(null);
      fetchRFQs();
    } catch {
      toast.error('Failed to create quote');
    }
  };

  if (loading) return <div className="p-8"><div className="skeleton h-64" /></div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display font-semibold mb-6">RFQs</h1>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Buyer', 'Products', 'Country', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{rfq.buyerId?.businessName || '—'}</td>
                <td className="p-3">{rfq.items?.length || 0} items</td>
                <td className="p-3">{rfq.destinationCountry || '—'}</td>
                <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gold/10 text-gold-dark">{rfq.status}</span></td>
                <td className="p-3 text-muted">{new Date(rfq.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button type="button" onClick={() => setSelected(rfq)} className="text-gold-dark hover:underline text-xs">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rfqs.length && <p className="p-8 text-center text-muted">No RFQs yet.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-4">RFQ — {selected.buyerId?.businessName}</h2>
            <div className="space-y-2 text-sm mb-4">
              {selected.items?.map((item, i) => (
                <p key={i}>{item.productName} · {item.sku} · Qty: {item.quantity}</p>
              ))}
              <p><strong>Country:</strong> {selected.destinationCountry}</p>
              <p><strong>Message:</strong> {selected.message || '—'}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(selected._id, s)}
                  className={`px-2 py-1 text-xs border ${selected.status === s ? 'bg-gold text-dark' : 'border-gray-200'}`}>{s}</button>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-medium">Create Quote</h3>
              <input type="number" placeholder="Total Amount" value={quoteForm.totalAmount} onChange={(e) => setQuoteForm({ ...quoteForm, totalAmount: e.target.value })} className="input-elegant" />
              <input type="date" value={quoteForm.validUntil} onChange={(e) => setQuoteForm({ ...quoteForm, validUntil: e.target.value })} className="input-elegant" />
              <textarea rows={2} placeholder="Quote message" value={quoteForm.message} onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })} className="input-elegant resize-none" />
              <button type="button" onClick={() => createQuote(selected._id)} className="btn-gold-solid w-full justify-center">Send Quote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

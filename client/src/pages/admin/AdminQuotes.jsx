import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rfqs/quotes/all')
      .then(({ data }) => setQuotes(data))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8"><div className="skeleton h-64" /></div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display font-semibold mb-6">Quotes</h1>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Buyer', 'Amount', 'Currency', 'Status', 'Valid Until', 'Date'].map((h) => (
                <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{quote.rfqId?.buyerId?.businessName || '—'}</td>
                <td className="p-3 font-medium">{quote.totalAmount?.toLocaleString()}</td>
                <td className="p-3">{quote.currency}</td>
                <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gold/10 text-gold-dark">{quote.status}</span></td>
                <td className="p-3">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : '—'}</td>
                <td className="p-3 text-muted">{new Date(quote.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!quotes.length && <p className="p-8 text-center text-muted">No quotes yet.</p>}
      </div>
    </div>
  );
}

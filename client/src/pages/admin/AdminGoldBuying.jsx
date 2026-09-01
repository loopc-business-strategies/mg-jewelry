import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['NEW', 'CONTACTED', 'APPOINTMENT', 'INSPECTION', 'VALUATION', 'QUOTED', 'ACCEPTED', 'COMPLETED', 'REJECTED'];

export default function AdminGoldBuying() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    api.get('/gold-buying/leads')
      .then(({ data }) => setLeads(data.leads || []))
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/gold-buying/leads/${id}`, { status });
      toast.success('Status updated');
      fetchLeads();
      setSelected(null);
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="p-8"><div className="skeleton h-64" /></div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display font-semibold mb-6">Gold Buying Leads</h1>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Seller', 'Phone', 'City', 'Gold Type', 'Weight', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{lead.fullName}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.city}</td>
                <td className="p-3">{lead.goldType || '—'}</td>
                <td className="p-3">{lead.approximateWeight || '—'}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 text-xs bg-gold/10 text-gold-dark">{lead.status}</span>
                </td>
                <td className="p-3 text-muted">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button type="button" onClick={() => setSelected(lead)} className="text-gold-dark hover:underline text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads.length && <p className="p-8 text-center text-muted">No gold buying leads yet.</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-4">{selected.fullName}</h2>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Email:</strong> {selected.email || '—'}</p>
              <p><strong>City:</strong> {selected.city}</p>
              <p><strong>Gold Type:</strong> {selected.goldType || '—'}</p>
              <p><strong>Weight:</strong> {selected.approximateWeight || '—'}</p>
              <p><strong>Purity:</strong> {selected.estimatedPurity || '—'}</p>
              <p><strong>Description:</strong> {selected.description || '—'}</p>
              <p><strong>Message:</strong> {selected.message || '—'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(selected._id, s)}
                  className={`px-3 py-1 text-xs border ${selected.status === s ? 'bg-gold text-dark border-gold' : 'border-gray-200 hover:border-gold'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

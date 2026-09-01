import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminBuyers() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = () => {
    api.get('/admin/wholesale')
      .then(({ data }) => setApplications(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/admin/wholesale/${id}/${action}`);
      toast.success(`Application ${action}d`);
      fetchApps();
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="p-8"><div className="skeleton h-64" /></div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-display font-semibold mb-6">International Buyers</h1>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Company', 'Country', 'Business Type', 'Monthly Purchase', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{app.businessName}</td>
                <td className="p-3">{app.country || app.city || '—'}</td>
                <td className="p-3">{app.businessType || '—'}</td>
                <td className="p-3">{app.expectedMonthlyPurchase || '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-xs uppercase ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{app.status}</span>
                </td>
                <td className="p-3 text-muted">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="p-3 space-x-2">
                  {app.status === 'pending' && (
                    <>
                      <button type="button" onClick={() => handleAction(app._id, 'approve')} className="text-xs text-green-700 hover:underline">Approve</button>
                      <button type="button" onClick={() => handleAction(app._id, 'reject')} className="text-xs text-red-700 hover:underline">Reject</button>
                    </>
                  )}
                  {app.status === 'approved' && (
                    <button type="button" onClick={() => handleAction(app._id, 'suspend')} className="text-xs text-muted hover:underline">Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!applications.length && <p className="p-8 text-center text-muted">No buyer applications yet.</p>}
      </div>
    </div>
  );
}

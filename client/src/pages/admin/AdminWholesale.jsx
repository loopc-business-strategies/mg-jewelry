import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminWholesale() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/admin/wholesale').then(({ data }) => setApplications(data)).catch(() => {});
  }, []);

  const handleAction = async (id, action) => {
    try {
      const { data } = await api.put(`/admin/wholesale/${id}/${action}`);
      setApplications(applications.map((a) => (a._id === id ? data : a)));
      toast.success(`Application ${action}d`);
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-semibold text-charcoal text-3xl mb-8">Wholesale Management</h1>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h3 className="font-medium">{app.businessName}</h3>
                <p className="text-sm text-muted">{app.email} · {app.phone}</p>
                <p className="text-sm text-muted">{app.city}, {app.state}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs capitalize ${
                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>{app.status}</span>
                {app.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(app._id, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                    <button onClick={() => handleAction(app._id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                  </>
                )}
                {app.status === 'approved' && (
                  <button onClick={() => handleAction(app._id, 'suspend')} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Suspend</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

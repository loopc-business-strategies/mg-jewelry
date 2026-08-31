import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const statuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/admin/orders').then(({ data }) => setOrders(data)).catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { status });
      setOrders(orders.map((o) => (o._id === id ? data : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex flex-wrap justify-between gap-4 mb-3">
              <div>
                <span className="font-medium">#{o.orderNumber}</span>
                <span className="text-sm text-muted ml-3">{o.userId?.name || o.shippingAddress?.name}</span>
              </div>
              <span className="font-semibold">{formatPrice(o.total)}</span>
            </div>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm"
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

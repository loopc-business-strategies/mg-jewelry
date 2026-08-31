import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { Package, ShoppingCart, Users, Store, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setData(data)).catch(() => {});
  }, []);

  if (!data) return <div className="p-8"><div className="skeleton h-64 rounded-xl" /></div>;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(data.stats.totalRevenue), icon: TrendingUp },
    { label: 'Total Orders', value: data.stats.totalOrders, icon: ShoppingCart },
    { label: 'Customers', value: data.stats.totalCustomers, icon: Users },
    { label: 'Wholesale Partners', value: data.stats.wholesaleCustomers, icon: Store },
    { label: 'Products', value: data.stats.products, icon: Package },
    { label: 'Pending Approvals', value: data.stats.pendingWholesale, icon: AlertTriangle },
    { label: 'B2C Revenue', value: formatPrice(data.stats.b2cRevenue), icon: TrendingUp },
    { label: 'Wholesale Revenue', value: formatPrice(data.stats.wholesaleRevenue), icon: TrendingUp },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">{label}</span>
              <Icon size={18} className="text-gold" />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-display text-xl mb-4">Recent B2C Orders</h2>
          {data.recentB2COrders?.map((o) => (
            <div key={o._id} className="flex justify-between py-2 border-b text-sm">
              <span>#{o.orderNumber}</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-display text-xl mb-4">Recent Wholesale Orders</h2>
          {data.recentWholesaleOrders?.map((o) => (
            <div key={o._id} className="flex justify-between py-2 border-b text-sm">
              <span>#{o.orderNumber}</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

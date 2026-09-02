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
      <h1 className="mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">{label}</span>
              <Icon size={18} className="text-gold" />
            </div>
            <p className="type-stat">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold text-charcoal text-xl mb-4">Sales (30 days)</h2>
          {data.charts?.dailySales?.length ? (
            <div className="space-y-2">
              {data.charts.dailySales.slice(-7).map((d) => (
                <div key={d._id} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-muted">{d._id}</span>
                  <div className="flex-1 bg-cream rounded h-4 overflow-hidden">
                    <div className="bg-gold h-full" style={{ width: `${Math.min(100, (d.revenue / (data.stats.b2cRevenue || 1)) * 100)}%` }} />
                  </div>
                  <span className="w-24 text-right">{formatPrice(d.revenue)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted">No sales data yet</p>}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold text-charcoal text-xl mb-4">Top Products</h2>
          {data.charts?.topProducts?.map((p) => (
            <div key={p._id} className="flex justify-between py-2 border-b text-sm">
              <span>{p.name}</span>
              <span>{p.sold} sold</span>
            </div>
          ))}
          {data.charts?.channelSplit && (
            <p className="text-xs text-muted mt-4">B2C: {data.charts.channelSplit.b2c} · B2B: {data.charts.channelSplit.b2b}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold text-charcoal text-xl mb-4">Recent B2C Orders</h2>
          {data.recentB2COrders?.map((o) => (
            <div key={o._id} className="flex justify-between py-2 border-b text-sm">
              <span>#{o.orderNumber}</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold text-charcoal text-xl mb-4">Recent Wholesale Orders</h2>
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

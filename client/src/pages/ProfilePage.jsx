import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (user) api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {});
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const tabs = [
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <SEOHead title="My Account" path="/profile" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-8">My Account</h1>
        <div className="grid md:grid-cols-4 gap-8">
          <nav className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${tab === id ? 'bg-gold text-white' : 'hover:bg-cream'}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50">
              <LogOut size={18} /> Logout
            </button>
          </nav>

          <div className="md:col-span-3">
            {tab === 'orders' && (
              <div>
                <h2 className="font-display text-xl mb-4">My Orders</h2>
                {orders.length ? orders.map((order) => (
                  <div key={order._id} className="border rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">#{order.orderNumber}</span>
                      <span className="text-sm capitalize px-2 py-1 bg-cream rounded">{order.status}</span>
                    </div>
                    <p className="text-sm text-muted">{order.items?.length} items · {formatPrice(order.total)}</p>
                  </div>
                )) : <p className="text-muted">No orders yet. <Link to="/shop" className="text-gold-dark hover:underline">Start shopping</Link></p>}
              </div>
            )}
            {tab === 'wishlist' && (
              <div>
                <h2 className="font-display text-xl mb-4">Wishlist</h2>
                <Link to="/wishlist" className="text-gold-dark hover:underline">View full wishlist →</Link>
              </div>
            )}
            {tab === 'addresses' && (
              <div>
                <h2 className="font-display text-xl mb-4">Saved Addresses</h2>
                {user.addresses?.length ? user.addresses.map((addr, i) => (
                  <div key={i} className="border rounded-xl p-4 mb-3 text-sm">
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-muted">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                )) : <p className="text-muted">No saved addresses</p>}
              </div>
            )}
            {tab === 'profile' && (
              <div>
                <h2 className="font-display text-xl mb-4">Profile Details</h2>
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-muted">Name</dt><dd className="font-medium">{user.name}</dd></div>
                  <div><dt className="text-muted">Email</dt><dd className="font-medium">{user.email}</dd></div>
                  <div><dt className="text-muted">Phone</dt><dd className="font-medium">{user.phone}</dd></div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const { t } = useTranslation();

  useEffect(() => {
    if (user) api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {});
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const tabs = [
    { id: 'orders', icon: Package, label: t('auth.orders') },
    { id: 'wishlist', icon: Heart, label: t('wishlist.title') },
    { id: 'addresses', icon: MapPin, label: t('auth.addresses') },
    { id: 'profile', icon: User, label: t('auth.profile') },
  ];

  return (
    <>
      <SEOHead title={t('auth.profileTitle')} path="/profile" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="mb-8">{t('auth.profileTitle')}</h1>
        <div className="grid md:grid-cols-4 gap-8">
          <nav className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${tab === id ? 'bg-gold text-white' : 'hover:bg-cream'}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50">
              <LogOut size={18} /> {t('auth.logout')}
            </button>
          </nav>

          <div className="md:col-span-3">
            {tab === 'orders' && (
              <div>
                <h2 className="font-semibold text-charcoal text-xl mb-4">{t('auth.myOrders')}</h2>
                {orders.length ? orders.map((order) => (
                  <div key={order._id} className="border rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">#{order.orderNumber}</span>
                      <span className="text-sm capitalize px-2 py-1 bg-cream rounded">{order.status}</span>
                    </div>
                    <p className="text-sm text-muted">{order.items?.length} items · {formatPrice(order.total)}</p>
                  </div>
                )) : <p className="text-muted">{t('auth.noOrders')} <Link to="/shop" className="text-gold-dark hover:underline">{t('auth.startShopping')}</Link></p>}
              </div>
            )}
            {tab === 'wishlist' && (
              <div>
                <h2 className="font-semibold text-charcoal text-xl mb-4">{t('wishlist.title')}</h2>
                <Link to="/wishlist" className="text-gold-dark hover:underline">{t('auth.viewWishlist')}</Link>
              </div>
            )}
            {tab === 'addresses' && (
              <div>
                <h2 className="font-semibold text-charcoal text-xl mb-4">{t('auth.savedAddresses')}</h2>
                {user.addresses?.length ? user.addresses.map((addr, i) => (
                  <div key={i} className="border rounded-xl p-4 mb-3 text-sm">
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-muted">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                )) : <p className="text-muted">{t('auth.noAddresses')}</p>}
              </div>
            )}
            {tab === 'profile' && (
              <div>
                <h2 className="font-semibold text-charcoal text-xl mb-4">{t('auth.profileDetails')}</h2>
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-muted">{t('auth.name')}</dt><dd className="font-medium">{user.name}</dd></div>
                  <div><dt className="text-muted">{t('form.email')}</dt><dd className="font-medium">{user.email}</dd></div>
                  <div><dt className="text-muted">{t('form.phone')}</dt><dd className="font-medium">{user.phone}</dd></div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

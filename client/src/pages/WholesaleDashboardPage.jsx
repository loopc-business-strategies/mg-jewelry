import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';
import { apiErrorMessage } from '../utils/apiError';

export default function WholesaleDashboardPage() {
  const { user } = useAuth();
  const { t, tf } = useTranslation();
  const { cart, fetchCart } = useWholesaleCart();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user) {
      api.get('/wholesale/profile').then(({ data }) => setProfile(data)).catch(() => {});
      api.get('/wholesale/orders').then(({ data }) => setOrders(data)).catch(() => {});
    }
  }, [user]);

  const placeOrder = async () => {
    try {
      await api.post('/wholesale/orders', { shippingAddress: { businessName: profile?.businessName } });
      toast.success(t('wholesaleDashboard.placed'));
      fetchCart();
    } catch (err) {
      toast.error(apiErrorMessage(err, t, 'wholesaleDashboard.failed'));
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  };

  return (
    <>
      <SEOHead title={t('wholesaleDashboard.title')} path="/wholesale/dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="mb-8">{t('wholesaleDashboard.title')}</h1>

        {profile && (
          <div className="bg-cream rounded-xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-charcoal text-xl">{profile.businessName}</h2>
              <p className="text-sm text-muted">{profile.email}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[profile.status]}`}>
              {t(`status.${profile.status}`, profile.status)}
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          <nav className="space-y-1">
            {['overview', 'orders', 'bulk-cart', 'support'].map((key) => (
              <button key={key} onClick={() => setTab(key)} className={`w-full text-start px-4 py-2 rounded-lg text-sm capitalize ${tab === key ? 'bg-gold text-white' : 'hover:bg-cream'}`}>
                {t(`wholesaleDashboard.tabs.${key}`, key.replace('-', ' '))}
              </button>
            ))}
          </nav>

          <div className="md:col-span-3">
            {tab === 'overview' && profile && (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted">{t('wholesaleDashboard.businessType')}</dt><dd>{t(`businessTypes.${profile.businessType}`, profile.businessType)}</dd></div>
                <div><dt className="text-muted">{t('wholesaleDashboard.gst')}</dt><dd>{profile.gstNumber || t('wholesaleDashboard.na')}</dd></div>
                <div><dt className="text-muted">{t('wholesaleDashboard.city')}</dt><dd>{profile.city}</dd></div>
                <div><dt className="text-muted">{t('wholesaleDashboard.expectedPurchase')}</dt><dd>{profile.expectedMonthlyPurchase}</dd></div>
              </dl>
            )}

            {tab === 'orders' && (
              <div>
                {orders.length ? orders.map((o) => (
                  <div key={o._id} className="border rounded-xl p-4 mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">#{o.orderNumber}</span>
                      <span className="text-sm capitalize">{t(`status.${o.status}`, o.status)}</span>
                    </div>
                    <p className="text-sm text-muted">{tf('ui.itemsCount', { n: o.items?.length ?? 0 })} · {formatPrice(o.total)}</p>
                  </div>
                )) : <p className="text-muted">{t('wholesaleDashboard.noOrders')}</p>}
              </div>
            )}

            {tab === 'bulk-cart' && (
              <div>
                {cart.items?.length ? (
                  <>
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex justify-between border-b py-3 text-sm">
                        <span>{item.productId?.name} × {item.quantity}</span>
                        <span>{formatPrice(item.appliedTierPrice * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold mt-4">
                      <span>{t('wholesaleDashboard.total')}</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                    {profile?.status === 'approved' && (
                      <button onClick={placeOrder} className="mt-4 btn-primary-gold text-xs">{t('wholesaleDashboard.placeOrder')}</button>
                    )}
                  </>
                ) : (
                  <p className="text-muted">{t('wholesaleDashboard.cartEmpty')} <Link to="/wholesale/shop" className="text-gold-dark hover:underline">{t('wholesaleDashboard.browse')}</Link></p>
                )}
              </div>
            )}

            {tab === 'support' && (
              <div className="text-sm space-y-2">
                <p>{tf('wholesaleDashboard.phone', { phone: '+91 98765 43210' })}</p>
                <p><Link to="/contact?type=quote" className="text-gold-dark hover:underline">{t('wholesaleDashboard.enquiryLink')}</Link></p>
                <p>{t('wholesaleDashboard.hours')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

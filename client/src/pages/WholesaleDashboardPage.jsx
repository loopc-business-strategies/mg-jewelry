import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

export default function WholesaleDashboardPage() {
  const { user } = useAuth();
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
      toast.success('Wholesale order placed!');
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
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
      <SEOHead title="Wholesale Dashboard" path="/wholesale/dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-semibold text-charcoal text-3xl mb-8">Wholesale Dashboard</h1>

        {profile && (
          <div className="bg-cream rounded-xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-charcoal text-xl">{profile.businessName}</h2>
              <p className="text-sm text-muted">{profile.email}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[profile.status]}`}>
              {profile.status}
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          <nav className="space-y-1">
            {['overview', 'orders', 'bulk-cart', 'support'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize ${tab === t ? 'bg-gold text-white' : 'hover:bg-cream'}`}>
                {t.replace('-', ' ')}
              </button>
            ))}
          </nav>

          <div className="md:col-span-3">
            {tab === 'overview' && profile && (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted">Business Type</dt><dd>{profile.businessType}</dd></div>
                <div><dt className="text-muted">GST</dt><dd>{profile.gstNumber || 'N/A'}</dd></div>
                <div><dt className="text-muted">City</dt><dd>{profile.city}</dd></div>
                <div><dt className="text-muted">Expected Purchase</dt><dd>{profile.expectedMonthlyPurchase}</dd></div>
              </dl>
            )}

            {tab === 'orders' && (
              <div>
                {orders.length ? orders.map((o) => (
                  <div key={o._id} className="border rounded-xl p-4 mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">#{o.orderNumber}</span>
                      <span className="text-sm capitalize">{o.status}</span>
                    </div>
                    <p className="text-sm text-muted">{o.items?.length} items · {formatPrice(o.total)}</p>
                  </div>
                )) : <p className="text-muted">No wholesale orders yet</p>}
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
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                    {profile?.status === 'approved' && (
                      <button onClick={placeOrder} className="mt-4 btn-primary-gold text-xs">Place Wholesale Order</button>
                    )}
                  </>
                ) : (
                  <p className="text-muted">Bulk cart is empty. <Link to="/wholesale/shop" className="text-gold-dark hover:underline">Browse collection</Link></p>
                )}
              </div>
            )}

            {tab === 'support' && (
              <div className="text-sm space-y-2">
                <p>Phone: +91 98765 43210</p>
                <p><Link to="/contact?type=quote" className="text-gold-dark hover:underline">Submit a business enquiry via our contact form</Link></p>
                <p>Hours: Mon – Sat, 10 AM – 8 PM</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
  suspended: 'SUSPENDED',
};

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user) {
      api.get('/wholesale/profile').then(({ data }) => setProfile(data)).catch(() => {});
      api.get('/wholesale/orders').then(({ data }) => setOrders(data)).catch(() => {});
      api.get('/rfqs/my').then(({ data }) => setRfqs(data)).catch(() => {});
      api.get('/rfqs/quotes/my').then(({ data }) => setQuotes(data)).catch(() => {});
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'profile', label: 'Company Profile' },
    { id: 'products', label: 'Products' },
    { id: 'rfqs', label: 'RFQs' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'orders', label: 'Orders' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <>
      <SEOHead title="Buyer Dashboard" path="/buyers/dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="headline-corporate headline-corporate-dark text-3xl mb-8">Buyer Dashboard</h1>

        {profile && (
          <div className="bg-white border border-gold/15 p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold">{profile.businessName}</h2>
              <p className="text-sm text-muted">{profile.email} · {profile.country || profile.city}</p>
            </div>
            <span className={`px-3 py-1 text-sm uppercase tracking-wider ${statusColors[profile.status]}`}>
              {STATUS_LABELS[profile.status] || profile.status}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gold/10 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm ${tab === t.id ? 'bg-gold text-dark font-semibold' : 'text-muted hover:text-dark'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Pending RFQs', value: rfqs.filter((r) => r.status === 'NEW').length, link: '/rfq' },
              { label: 'Active Quotes', value: quotes.filter((q) => q.status === 'SENT').length, link: null },
              { label: 'Orders', value: orders.length, link: null },
              { label: 'Account Status', value: STATUS_LABELS[profile?.status] || '—', link: null },
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-white border border-gold/10">
                <p className="text-xs uppercase tracking-wider text-muted mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-semibold text-dark">{stat.value}</p>
                {stat.link && <Link to={stat.link} className="text-xs text-gold-dark mt-2 inline-block hover:underline">View →</Link>}
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && profile && (
          <div className="bg-white border border-gold/15 p-6 grid md:grid-cols-2 gap-4 text-sm">
            {[
              ['Company', profile.businessName],
              ['Contact', profile.ownerName],
              ['Country', profile.country],
              ['City', profile.city],
              ['Business Type', profile.businessType],
              ['Years in Business', profile.yearsInBusiness],
              ['Expected Monthly Purchase', profile.expectedMonthlyPurchase],
              ['Preferred Purity', profile.preferredPurity],
              ['Website', profile.website],
            ].map(([label, value]) => value && (
              <div key={label}><span className="text-muted">{label}:</span> <strong>{value}</strong></div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div className="text-center py-12">
            <Link to="/products" className="btn-gold-solid">Browse Product Catalogue</Link>
          </div>
        )}

        {tab === 'rfqs' && (
          <div className="space-y-4">
            <Link to="/rfq" className="btn-gold-solid inline-flex mb-4">Create New RFQ</Link>
            {rfqs.length === 0 ? (
              <p className="text-muted">No RFQs yet.</p>
            ) : rfqs.map((rfq) => (
              <div key={rfq._id} className="p-4 bg-white border border-gold/10 flex justify-between items-center">
                <div>
                  <p className="font-medium">{rfq.items?.length || 0} products · {rfq.destinationCountry || '—'}</p>
                  <p className="text-xs text-muted">{new Date(rfq.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-gold-dark">{rfq.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'quotes' && (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <p className="text-muted">No quotes received yet.</p>
            ) : quotes.map((quote) => (
              <div key={quote._id} className="p-4 bg-white border border-gold/10">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{quote.currency} {quote.totalAmount?.toLocaleString()}</p>
                  <span className="text-xs uppercase text-gold-dark">{quote.status}</span>
                </div>
                {quote.validUntil && <p className="text-xs text-muted">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-muted">No orders yet.</p>
            ) : orders.map((order) => (
              <div key={order._id} className="p-4 bg-white border border-gold/10 flex justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs capitalize text-muted">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'settings' && (
          <p className="text-muted">Account settings — contact support for profile updates.</p>
        )}
      </div>
    </>
  );
}

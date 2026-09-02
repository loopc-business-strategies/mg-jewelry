import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import SEOHead from '../components/SEOHead';
import WholesaleProductCard from '../components/WholesaleProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from '../hooks/useTranslation';

export default function WholesaleShopPage() {
  const { user, isWholesaleApproved } = useAuth();
  const { addToWholesaleCart, cart } = useWholesaleCart();
  const [products, setProducts] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();

  useEffect(() => {
    api.get('/wholesale/products')
      .then(({ data }) => { setProducts(data.products); setShowPrices(data.showPrices); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, lang]);

  return (
    <>
      <SEOHead title={t('wholesaleShop.seoTitle')} path="/wholesale/shop" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1>{t('wholesaleShop.title')}</h1>
            {!showPrices && (
              <p className="text-sm text-muted mt-1">
                <Link to="/wholesale/register" className="text-gold-dark hover:underline">{t('wholesaleShop.registerNote')}</Link> {t('wholesaleShop.registerNoteSuffix')}
              </p>
            )}
          </div>
          {isWholesaleApproved && (
            <Link to="/wholesale/dashboard" className="text-sm btn-primary-gold text-xs px-4 py-2">
              {t('wholesaleShop.bulkCart')} ({cart.items?.length || 0}) · {formatPrice(cart.total || 0)}
            </Link>
          )}
        </div>
        {loading ? <LoadingSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <WholesaleProductCard
                key={p._id}
                product={p}
                showPrices={showPrices}
                onAdd={isWholesaleApproved ? addToWholesaleCart : null}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { Link, Navigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';
import { useTranslation } from '../hooks/useTranslation';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { t } = useTranslation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <SEOHead title={t('wishlist.seoTitle')} path="/wishlist" />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <p className="section-eyebrow mb-2">{t('wishlist.eyebrow')}</p>
        <h1 className="mb-8">{t('wishlist.title')}</h1>
        {wishlist.products?.length ? (
          <ProductGrid products={wishlist.products} />
        ) : (
          <EmptyState
            title={t('wishlist.emptyTitle')}
            description={t('wishlist.emptyDesc')}
            action={<Link to="/shop" className="inline-block btn-primary-ink text-xs">{t('wishlist.explore')}</Link>}
          />
        )}
      </div>
    </>
  );
}

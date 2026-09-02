import { Link, Navigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/SEOHead';
import ProductGrid from '../components/ProductGrid';
import EmptyState from '../components/EmptyState';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <SEOHead title="Wishlist" path="/wishlist" />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <p className="section-eyebrow mb-2">Saved</p>
        <h1 className="mb-8">My Wishlist</h1>
        {wishlist.products?.length ? (
          <ProductGrid products={wishlist.products} />
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            description="Save your favourite jewellery pieces here."
            action={<Link to="/shop" className="inline-block btn-primary-ink text-xs">Explore Jewellery</Link>}
          />
        )}
      </div>
    </>
  );
}

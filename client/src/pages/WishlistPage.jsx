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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-8">My Wishlist</h1>
        {wishlist.products?.length ? (
          <ProductGrid products={wishlist.products} />
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            description="Save your favourite jewellery pieces here."
            action={<Link to="/shop" className="inline-block bg-gold text-white px-8 py-3 rounded-full text-sm">EXPLORE JEWELLERY</Link>}
          />
        )}
      </div>
    </>
  );
}

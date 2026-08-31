import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist({ products: [] }); return; }
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch {
      setWishlist({ products: [] });
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) { toast.error('Please login to save wishlist'); return; }
    try {
      const { data } = await api.post('/wishlist', { productId });
      setWishlist(data);
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    setWishlist(data);
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId) =>
    wishlist.products?.some((p) => (p._id || p).toString() === productId?.toString());

  const wishlistCount = wishlist.products?.length || 0;

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

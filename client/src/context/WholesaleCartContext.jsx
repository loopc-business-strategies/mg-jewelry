import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WholesaleCartContext = createContext();

export const WholesaleCartProvider = ({ children }) => {
  const { user, isWholesaleApproved } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || !isWholesaleApproved) { setCart({ items: [], subtotal: 0, total: 0 }); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/wholesale/cart');
      setCart(data);
    } catch {
      setCart({ items: [], subtotal: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [user, isWholesaleApproved]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToWholesaleCart = async (productId, quantity) => {
    try {
      const { data } = await api.post('/wholesale/cart', { productId, quantity });
      setCart(data);
      toast.success('Added to bulk order');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <WholesaleCartContext.Provider value={{ cart, loading, addToWholesaleCart, fetchCart, cartCount }}>
      {children}
    </WholesaleCartContext.Provider>
  );
};

export const useWholesaleCart = () => useContext(WholesaleCartContext);

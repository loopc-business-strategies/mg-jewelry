import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal, fetchCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const { t } = useTranslation();

  const shipping = subtotal >= 5000 ? 0 : 99;
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(afterCoupon * 0.03);
  const total = afterCoupon + shipping + tax;
  const discount = cart.items?.reduce((sum, item) => {
    const mrp = item.productId?.mrp || 0;
    const price = item.productId?.price || 0;
    return sum + (mrp - price) * item.quantity;
  }, 0) || 0;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post('/cart/apply-coupon', { code: couponCode });
      setCouponDiscount(data.couponDiscount || 0);
      toast.success(t('cart.couponApplied'));
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || t('cart.couponInvalid'));
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = async () => {
    try {
      await api.delete('/cart/coupon');
      setCouponCode('');
      setCouponDiscount(0);
      toast.success(t('cart.couponRemoved'));
      fetchCart();
    } catch {
      toast.error(t('cart.couponRemoveFailed'));
    }
  };

  return (
    <>
      <SEOHead title={t('cart.seoTitle')} path="/cart" />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <Breadcrumbs items={[{ label: t('cart.title') }]} />
        <h1 className="mb-8">{t('cart.title')}</h1>

        {!cart.items?.length ? (
          <EmptyState
            title={t('cart.emptyTitle')}
            description={t('cart.emptyDesc')}
            action={<Link to="/shop" className="inline-block btn-primary-ink text-xs">{t('cart.continueShopping')}</Link>}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.items.map((item) => (
                <CartItem key={item._id} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
              ))}
            </div>
            <div className="card-elegant p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-charcoal text-xl mb-4">{t('cart.orderSummary')}</h3>
              <div className="flex gap-2 mb-4">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder={t('cart.couponPlaceholder')} className="input-elegant flex-1 text-sm" />
                <button onClick={applyCoupon} disabled={applying} className="btn-primary-gold text-xs px-3">{applying ? '...' : t('cart.apply')}</button>
              </div>
              {couponDiscount > 0 && (
                <button onClick={removeCoupon} className="text-xs text-red-600 mb-3 hover:underline">{t('cart.removeCoupon')}</button>
              )}
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt>{t('cart.subtotal')}</dt><dd>{formatPrice(subtotal)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><dt>{t('cart.savings')}</dt><dd>-{formatPrice(discount)}</dd></div>}
                {couponDiscount > 0 && <div className="flex justify-between text-green-600"><dt>{t('cart.coupon')}</dt><dd>-{formatPrice(couponDiscount)}</dd></div>}
                <div className="flex justify-between"><dt>{t('cart.shipping')}</dt><dd>{shipping ? formatPrice(shipping) : t('cart.free')}</dd></div>
                <div className="flex justify-between"><dt>{t('cart.tax')}</dt><dd>{formatPrice(tax)}</dd></div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t"><dt>{t('cart.total')}</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <Link to="/checkout" className="block w-full text-center btn-primary-ink justify-center text-xs mt-6">
                {t('cart.checkout')}
              </Link>
              <Link to="/shop" className="block text-center text-sm text-gold-dark mt-4 hover:underline">{t('cart.continueShopping')}</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

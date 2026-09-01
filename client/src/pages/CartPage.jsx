import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/formatPrice';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;
  const discount = cart.items?.reduce((sum, item) => {
    const mrp = item.productId?.mrp || 0;
    const price = item.productId?.price || 0;
    return sum + (mrp - price) * item.quantity;
  }, 0) || 0;

  return (
    <>
      <SEOHead title="Shopping Cart" path="/cart" />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <h1 className="font-semibold text-charcoal text-3xl md:text-4xl mb-8">Shopping Cart</h1>

        {!cart.items?.length ? (
          <EmptyState
            title="Your cart is empty"
            description="Discover our beautiful jewellery collection."
            action={<Link to="/shop" className="inline-block btn-primary-ink text-xs">Continue Shopping</Link>}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.items.map((item) => (
                <CartItem key={item._id} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
              ))}
            </div>
            <div className="card-elegant p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-charcoal text-xl mb-4">Order Summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><dt>Discount</dt><dd>-{formatPrice(discount)}</dd></div>}
                <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div>
                <div className="flex justify-between"><dt>Tax (3%)</dt><dd>{formatPrice(tax)}</dd></div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <Link to="/checkout" className="block w-full text-center btn-primary-ink justify-center text-xs mt-6">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="block text-center text-sm text-gold-dark mt-4 hover:underline">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

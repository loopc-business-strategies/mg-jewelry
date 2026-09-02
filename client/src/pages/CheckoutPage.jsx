import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/SEOHead';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const steps = ['Login', 'Address', 'Delivery', 'Payment', 'Confirmation'];
const paymentMethods = [
  { id: 'stripe', label: 'Card / UPI (Stripe)' },
  { id: 'cod', label: 'Cash on Delivery' },
];

function StripeForm({ order, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout?success=true` },
      redirect: 'if_required',
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      try {
        await api.post(`/orders/${order._id}/confirm-payment`);
      } catch {
        /* webhook may handle */
      }
      onSuccess(order);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} className="w-full btn-primary-gold justify-center text-xs disabled:opacity-50">
        {loading ? 'Processing...' : `Pay ${formatPrice(order.total)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 1 : 0);
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [address, setAddress] = useState({ name: '', phone: '', email: user?.email || '', line1: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: address, paymentMethod });
      if (data.clientSecret) {
        setOrder(data.order);
        setClientSecret(data.clientSecret);
        setStep(3.5);
      } else {
        setOrder(data.order || data);
        setStep(4);
        fetchCart();
        toast.success('Order placed successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = (confirmedOrder) => {
    setOrder(confirmedOrder);
    setStep(4);
    fetchCart();
    toast.success('Payment successful!');
  };

  if (!cart.items?.length && !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted mb-4">Your cart is empty</p>
        <Link to="/shop" className="text-gold-dark hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Checkout" path="/checkout" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="mb-8 text-center">Checkout</h1>

        <div className="flex justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-xs ${i <= step ? 'text-gold' : 'text-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i <= step ? 'bg-gold text-white' : 'bg-gray-100'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="text-center space-y-4">
            <p>Please login or continue as guest</p>
            <Link to="/login" className="inline-block btn-primary-gold text-xs">Login</Link>
            <button onClick={() => setStep(1)} className="block mx-auto text-sm text-gold-dark hover:underline">Continue as Guest</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {['name', 'phone', 'email', 'line1', 'city', 'state', 'pincode'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize block mb-1">{field === 'line1' ? 'Address' : field}</label>
                <input
                  required
                  value={address[field]}
                  onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                  className="input-elegant"
                />
              </div>
            ))}
            <button onClick={() => setStep(2)} className="w-full btn-primary-gold justify-center text-xs">Continue to Delivery</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <p className="text-muted">Standard delivery: 3-5 business days</p>
            <p className="font-semibold">Shipping: {shipping ? formatPrice(shipping) : 'Free'}</p>
            <button onClick={() => setStep(3)} className="w-full btn-primary-gold justify-center text-xs">Continue to Payment</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-4">Select payment method</p>
            {paymentMethods.map((pm) => (
              <label key={pm.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${paymentMethod === pm.id ? 'border-border bg-gold/5' : ''}`}>
                <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-gold" />
                {pm.label}
              </label>
            ))}
            <div className="bg-cream p-4 rounded-xl text-sm">
              <div className="flex justify-between"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            </div>
            <button onClick={placeOrder} disabled={loading} className="w-full btn-primary-gold justify-center text-xs disabled:opacity-50">
              {loading ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place Order' : 'Continue to Payment'}
            </button>
          </div>
        )}

        {step === 3.5 && clientSecret && order && (
          <div className="space-y-4">
            <p className="text-sm text-muted">Complete your payment securely via Stripe</p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeForm order={order} onSuccess={onPaymentSuccess} />
            </Elements>
          </div>
        )}

        {step === 4 && order && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="type-card-title">Order Confirmed!</h2>
            <p className="text-muted">Order #{order.orderNumber}</p>
            <p className="text-sm">Total: {formatPrice(order.total)}</p>
            <Link to="/shop" className="inline-block btn-primary-gold text-xs mt-4">Continue Shopping</Link>
          </div>
        )}
      </div>
    </>
  );
}

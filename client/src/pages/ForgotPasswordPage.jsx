import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('If an account exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Forgot Password" path="/forgot-password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md text-center">
          <BrandLogo variant="auth" linkTo={null} />
          <h1 className="font-semibold text-charcoal text-3xl mb-4">Reset Password</h1>
          {sent ? (
            <p className="text-muted mb-6">Check your email for a reset link. It expires in 1 hour.</p>
          ) : (
            <>
              <p className="text-muted mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-elegant"
                />
                <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center text-xs py-3">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
          <Link to="/login" className="text-sm text-gold-dark hover:underline mt-4 inline-block">Back to Login</Link>
        </div>
      </div>
    </>
  );
}

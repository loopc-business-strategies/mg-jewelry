import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password updated! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Reset Password" path="/reset-password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md text-center">
          <BrandLogo variant="auth" linkTo={null} />
          <h1 className="font-semibold text-charcoal text-3xl mb-4">Set New Password</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-elegant"
            />
            <input
              type="password"
              placeholder="Confirm password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-elegant"
            />
            <button type="submit" disabled={loading || !token} className="w-full btn-primary-gold justify-center text-xs py-3">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          <Link to="/login" className="text-sm text-gold-dark hover:underline mt-4 inline-block">Back to Login</Link>
        </div>
      </div>
    </>
  );
}

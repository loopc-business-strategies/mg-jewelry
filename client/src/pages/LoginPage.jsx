import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Login" path="/login" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md card-elegant p-8 md:p-10">
          <BrandLogo variant="auth" linkTo={null} />
          <p className="section-eyebrow text-center">Account</p>
          <h1 className="text-center mb-8">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="type-form-label">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-elegant" />
            </div>
            <div>
              <label className="type-form-label">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-elegant" />
            </div>
            <Link to="/forgot-password" className="type-body-sm text-gold-dark hover:text-gold block">Forgot password?</Link>
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center disabled:opacity-50">
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
          <p className="text-center type-body-sm mt-6">
            Don't have an account? <Link to="/signup" className="text-gold-dark hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

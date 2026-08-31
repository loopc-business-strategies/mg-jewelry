import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl text-center mb-8">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />
            </div>
            <Link to="/forgot-password" className="text-sm text-gold-dark hover:underline block">Forgot password?</Link>
            <button type="submit" disabled={loading} className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-medium tracking-wider hover:bg-gold transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            Don't have an account? <Link to="/signup" className="text-gold-dark hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

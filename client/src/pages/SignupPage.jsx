import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Sign Up" path="/signup" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-linen">
        <div className="w-full max-w-md card-elegant p-8 md:p-10">
          <BrandLogo variant="auth" linkTo={null} />
          <p className="section-eyebrow text-center mb-2">Account</p>
          <h1 className="font-display text-3xl text-center mb-8">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['name', 'email', 'phone', 'password'].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium capitalize block mb-1">{field}</label>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-elegant"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full btn-primary-ink justify-center text-xs disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            Already have an account? <Link to="/login" className="text-gold-dark hover:text-gold">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

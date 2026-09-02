import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t('auth.welcome'));
      navigate('/');
    } catch {
      toast.error(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title={t('auth.loginTitle')} path="/login" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md card-elegant p-8 md:p-10">
          <BrandLogo variant="auth" linkTo={null} />
          <p className="section-eyebrow text-center">{t('auth.account')}</p>
          <h1 className="text-center mb-8">{t('auth.welcomeBack')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="type-form-label">{t('form.email')}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-elegant" />
            </div>
            <div>
              <label className="type-form-label">{t('form.password')}</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-elegant" />
            </div>
            <Link to="/forgot-password" className="type-body-sm text-gold-dark hover:text-gold block">{t('auth.forgotPassword')}</Link>
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center disabled:opacity-50">
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
          <p className="text-center type-body-sm mt-6">
            {t('auth.noAccount')} <Link to="/signup" className="text-gold-dark hover:text-gold">{t('auth.signUp')}</Link>
          </p>
        </div>
      </div>
    </>
  );
}

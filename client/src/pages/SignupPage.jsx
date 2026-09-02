import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success(t('auth.accountCreated'));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: t('auth.name'), type: 'text' },
    { key: 'email', label: t('form.email'), type: 'email' },
    { key: 'phone', label: t('form.phone'), type: 'text' },
    { key: 'password', label: t('form.password'), type: 'password' },
  ];

  return (
    <>
      <SEOHead title={t('auth.signupTitle')} path="/signup" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md card-elegant p-8 md:p-10">
          <BrandLogo variant="auth" linkTo={null} />
          <p className="section-eyebrow text-center">{t('auth.account')}</p>
          <h1 className="text-center mb-8">{t('auth.createAccount')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="type-form-label">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-elegant"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center disabled:opacity-50">
              {loading ? t('auth.creating') : t('auth.createAccount')}
            </button>
          </form>
          <p className="text-center type-body-sm mt-6">
            {t('auth.hasAccount')} <Link to="/login" className="text-gold-dark hover:text-gold">{t('auth.signInLink')}</Link>
          </p>
        </div>
      </div>
    </>
  );
}

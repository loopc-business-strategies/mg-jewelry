import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import BrandLogo from '../components/BrandLogo';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success(t('auth.resetSuccess'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title={t('auth.resetTitle')} path="/forgot-password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="w-full max-w-md text-center">
          <BrandLogo variant="auth" linkTo={null} />
          <h1 className="mb-4">{t('auth.resetTitle')}</h1>
          {sent ? (
            <p className="text-muted mb-6">{t('auth.resetSent')}</p>
          ) : (
            <>
              <p className="text-muted mb-6">{t('auth.resetDesc')}</p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder={t('form.email')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-elegant"
                />
                <button type="submit" disabled={loading} className="w-full btn-primary-gold justify-center text-xs py-3">
                  {loading ? t('contact.sending') : t('auth.sendReset')}
                </button>
              </form>
            </>
          )}
          <Link to="/login" className="text-sm text-gold-dark hover:underline mt-4 inline-block">{t('auth.backToLogin')}</Link>
        </div>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Store, MessagesSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { apiErrorMessage } from '../utils/apiError';

const EMPTY_FORM = { name: '', email: '', password: '' };

export default function AccountPopover() {
  const {
    user, login, register, logout, loginPrompt, openLogin, closeLogin,
  } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const rootRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const open = Boolean(loginPrompt);
  const mode = loginPrompt?.mode === 'signup' ? 'signup' : 'signin';

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) closeLogin();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLogin();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeLogin]);

  const toggle = () => (open ? closeLogin() : openLogin());
  const switchMode = (next) => openLogin({ redirectTo: loginPrompt?.redirectTo, mode: next });
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const finish = () => {
    const target = loginPrompt?.redirectTo;
    closeLogin();
    setForm(EMPTY_FORM);
    if (target) navigate(target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await register({ name: form.name, email: form.email, password: form.password });
        toast.success(t('auth.accountCreated'));
      } else {
        await login(form.email, form.password);
        toast.success(t('auth.welcome'));
      }
      finish();
    } catch (err) {
      if (mode === 'signup') toast.error(apiErrorMessage(err, t, 'auth.registrationFailed'));
      else toast.error(t('auth.invalidCredentials'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    closeLogin();
    if (pathname.startsWith('/wholesale/dashboard')) navigate('/');
  };

  const hasWholesale = Boolean(user?.wholesaleStatus) || user?.role === 'wholesale_customer';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="p-2.5 text-charcoal hover:text-gold transition-colors relative"
        aria-label={t('ui.account')}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <User size={18} strokeWidth={1.5} />
        {user && <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-gold" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('auth.account')}
          className="account-popover absolute end-0 top-full mt-2 z-50 animate-fade-in"
        >
          {user ? (
            <div>
              <p className="type-micro mb-1">{t('auth.signedInAs')}</p>
              <p className="account-popover-name">{user.name}</p>
              <p className="type-body-sm truncate mb-4">{user.email}</p>
              <div className="account-popover-links">
                {hasWholesale && (
                  <Link to="/wholesale/dashboard" onClick={closeLogin} className="account-popover-link">
                    <Store size={16} className="text-gold shrink-0" /> {t('auth.wholesaleDashboard')}
                  </Link>
                )}
                <p className="account-popover-note">
                  <MessagesSquare size={16} className="text-gold shrink-0" /> {t('auth.communityNote')}
                </p>
                <button type="button" onClick={handleLogout} className="account-popover-link w-full">
                  <LogOut size={16} className="text-gold shrink-0" /> {t('auth.logout')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="account-popover-title">
                {mode === 'signup' ? t('auth.createAccount') : t('auth.welcomeBack')}
              </p>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="account-name" className="type-form-label">{t('auth.name')}</label>
                  <input id="account-name" type="text" required autoComplete="name" value={form.name} onChange={update('name')} className="input-elegant" />
                </div>
              )}
              <div>
                <label htmlFor="account-email" className="type-form-label">{t('form.email')}</label>
                <input id="account-email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} className="input-elegant" />
              </div>
              <div>
                <label htmlFor="account-password" className="type-form-label">{t('form.password')}</label>
                <input
                  id="account-password"
                  type="password"
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={form.password}
                  onChange={update('password')}
                  className="input-elegant"
                />
              </div>
              {mode === 'signin' && (
                <Link to="/forgot-password" onClick={closeLogin} className="type-body-sm text-gold-dark hover:text-gold block">
                  {t('auth.forgotPassword')}
                </Link>
              )}
              <button type="submit" disabled={submitting} className="w-full btn-primary-gold justify-center disabled:opacity-50">
                {mode === 'signup'
                  ? (submitting ? t('auth.creating') : t('auth.createAccount'))
                  : (submitting ? t('auth.signingIn') : t('auth.signIn'))}
              </button>
              <p className="type-body-sm text-center pt-1">
                {mode === 'signup' ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
                <button type="button" onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')} className="text-gold-dark hover:text-gold">
                  {mode === 'signup' ? t('auth.signInLink') : t('auth.signUp')}
                </button>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

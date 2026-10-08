import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

/** Legacy /login and /signup URLs: open the header account popover instead of a full page. */
export default function LoginRedirect({ mode = 'signin' }) {
  const { user, loading, isAdmin, openLogin } = useAuth();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  useEffect(() => {
    if (!loading && !user) openLogin({ redirectTo: next, mode });
  }, [loading, user, openLogin, next, mode]);

  if (loading) return null;
  const canFollowNext = user && next && (isAdmin || !next.startsWith('/admin'));
  return <Navigate to={canFollowNext ? next : '/'} replace />;
}

import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useLocalizedValidation } from '../hooks/useLocalizedValidation';

export default function MainLayout() {
  const { pathname } = useLocation();
  useLocalizedValidation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead path={pathname === '/' ? '' : pathname} />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

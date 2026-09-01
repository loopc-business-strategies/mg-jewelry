import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { brand, navLinks, headerCTAs, isNavLinkActive } from '../utils/brandConfig';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import BrandLogo from './BrandLogo';
import MarketSelector from './MarketSelector';

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navClass = (link) => {
    const active = isNavLinkActive(pathname, link);
    return `nav-link-corporate ${active ? 'active' : ''}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        sticky
          ? 'bg-dark/98 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-dark/95 backdrop-blur-sm'
      } border-b border-gold/10`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${sticky ? 'h-14 md:h-16' : 'h-16 md:h-[4.5rem]'}`}>
          <button
            className="lg:hidden p-2 shrink-0 text-off-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-3 shrink-0">
            <BrandLogo className="h-10 w-10 md:h-11 md:w-11 object-contain" alt={brand.name} />
            <div className="hidden sm:block">
              <span className="font-display text-lg md:text-xl font-semibold text-off-white tracking-wide">
                {brand.name}
              </span>
              <span className="block text-[9px] tracking-[0.2em] uppercase text-gold/70">
                {t('footer.goldIndustry')}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link key={link.key} to={link.path} className={navClass(link)}>
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <MarketSelector compact />
            {headerCTAs.map((cta) => (
              <Link
                key={cta.key}
                to={cta.path}
                className={`hidden md:inline-flex text-xs ${
                  cta.variant === 'primary' ? 'btn-gold-solid !py-2 !px-4' : 'btn-gold-outline btn-gold-outline-light !py-2 !px-4'
                }`}
              >
                {t(cta.key)}
              </Link>
            ))}
            <Link
              to={user ? (user.role?.includes('wholesale') ? '/buyers/dashboard' : '/profile') : '/login'}
              className="p-2.5 text-off-white/80 hover:text-gold transition-colors"
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gold/10 bg-dark animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`text-sm py-3 border-b border-gold/10 ${
                  isNavLinkActive(pathname, link) ? 'text-gold' : 'text-off-white/90'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="py-3 border-b border-gold/10">
              <MarketSelector />
            </div>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gold/10">
              {headerCTAs.map((cta) => (
                <Link
                  key={cta.key}
                  to={cta.path}
                  className={cta.variant === 'primary' ? 'btn-gold-solid text-center justify-center' : 'btn-gold-outline btn-gold-outline-light text-center justify-center'}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(cta.key)}
                </Link>
              ))}
              <Link
                to={user ? '/profile' : '/login'}
                className="text-sm py-3 text-center text-muted-light"
                onClick={() => setMobileOpen(false)}
              >
                {user ? t('common.myAccount') : t('common.login')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

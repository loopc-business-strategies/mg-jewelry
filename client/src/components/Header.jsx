import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  navLinks,
  sellGoldCta,
  isNavLinkActive,
} from '../utils/brandConfig';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import MegaMenu from './MegaMenu';
import MarketSelector from './MarketSelector';
import BrandLogo from './BrandLogo';
import AccountPopover from './AccountPopover';

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { pathname } = useLocation();
  const { user, openLogin } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const navClass = (link) => {
    const active = isNavLinkActive(pathname, link);
    return `nav-link-elegant ${active ? 'active' : ''}`;
  };

  const renderDropdown = (menu) => {
    if (openMenu !== menu) return null;
    const close = () => setOpenMenu(null);
    if (menu === 'collections') return <MegaMenu onClose={close} />;
    return null;
  };

  const directMobileLinks = navLinks.filter((link) => !link.menu);

  const openAccountFromMenu = () => {
    setMobileOpen(false);
    openLogin();
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 border-b border-border ${sticky ? 'shadow-[var(--shadow-soft)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 h-[60px] md:h-[68px] lg:h-[72px]">
          <button className="lg:hidden p-2 shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label={t('ui.menu')}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <BrandLogo variant="header" />

          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <div
                key={link.path + (link.key || link.label)}
                className="relative"
                onMouseEnter={() => link.menu && setOpenMenu(link.menu)}
                onMouseLeave={() => link.menu && setOpenMenu(null)}
              >
                <Link to={link.path} className={`${navClass(link)} inline-flex items-center gap-1`}>
                  {link.key ? t(link.key) : link.label}
                  {link.menu && <ChevronDown size={12} className="opacity-50" />}
                </Link>
                {link.menu && renderDropdown(link.menu)}
              </div>
            ))}
          </nav>

          <Link
            to={sellGoldCta.path}
            className="hidden lg:inline-flex btn-primary-gold-sm shrink-0"
          >
            {t(sellGoldCta.key)}
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden md:block">
              <MarketSelector compact />
            </div>
            <AccountPopover />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-0">
            <div className="mb-4 md:hidden">
              <MarketSelector />
            </div>
            {directMobileLinks.map((link) => (
              <Link
                key={link.path + (link.key || link.label)}
                to={link.path}
                className={`type-body-sm py-3 border-b border-border ${isNavLinkActive(pathname, link) ? 'text-gold font-medium' : 'text-charcoal'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
            <Link to="/shop" className="type-body-sm py-3 border-b border-border" onClick={() => setMobileOpen(false)}>
              {t('nav.collections')}
            </Link>
            <button type="button" onClick={openAccountFromMenu} className="type-body-sm py-3 text-start">
              {user ? t('ui.myAccount') : t('ui.login')}
            </button>
            <Link
              to={sellGoldCta.path}
              className="btn-primary-gold-sm w-full justify-center py-2.5 mt-4"
              onClick={() => setMobileOpen(false)}
            >
              {t(sellGoldCta.key)}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

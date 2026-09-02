import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import {
  navLinks,
  sellGoldCta,
  becomeBuyerCta,
  isNavLinkActive,
} from '../utils/brandConfig';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import MarketSelector from './MarketSelector';
import BrandLogo from './BrandLogo';
import SearchBar from './SearchBar';

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
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
    return `nav-link-elegant ${active ? 'active' : ''}`;
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 border-b border-border ${sticky ? 'shadow-[var(--shadow-soft)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 h-[60px] md:h-[68px] lg:h-[72px]">
          <button className="lg:hidden p-2 shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <BrandLogo variant="header" />

          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path + (link.key || link.label)}
                to={link.path}
                className={navClass(link)}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link to={sellGoldCta.path} className="btn-primary-gold-sm">
              {t(sellGoldCta.key)}
            </Link>
            <Link to={becomeBuyerCta.path} className="btn-outline-gold-sm">
              {t(becomeBuyerCta.key)}
            </Link>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden md:block">
              <MarketSelector compact />
            </div>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 text-charcoal hover:text-gold transition-colors" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className="hidden sm:block p-2.5 text-charcoal hover:text-gold transition-colors relative" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to={user ? '/profile' : '/login'} className="hidden sm:block p-2.5 text-charcoal hover:text-gold transition-colors" aria-label="Account">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="p-2.5 text-charcoal hover:text-gold transition-colors relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 animate-fade-in border-t border-border pt-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-0">
            <div className="mb-4 md:hidden">
              <MarketSelector />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path + (link.key || link.label)}
                to={link.path}
                className={`type-body-sm py-3 border-b border-border ${isNavLinkActive(pathname, link) ? 'text-gold font-medium' : 'text-charcoal'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
            <Link to="/wishlist" className="type-body-sm py-3 border-t border-border mt-2" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            <Link to={user ? '/profile' : '/login'} className="type-body-sm py-3" onClick={() => setMobileOpen(false)}>
              {user ? 'My Account' : 'Login'}
            </Link>
            <Link
              to={sellGoldCta.path}
              className="btn-primary-gold-sm w-full justify-center py-2.5 mt-4"
              onClick={() => setMobileOpen(false)}
            >
              {t(sellGoldCta.key)}
            </Link>
            <Link
              to={becomeBuyerCta.path}
              className="btn-outline-gold-sm w-full justify-center py-2.5 mt-2"
              onClick={() => setMobileOpen(false)}
            >
              {t(becomeBuyerCta.key)}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

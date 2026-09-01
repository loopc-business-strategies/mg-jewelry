import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, Gem } from 'lucide-react';
import {
  brand,
  navLinks,
  wholesaleNavLinks,
  ecommerceMenu,
  isNavLinkActive,
} from '../utils/brandConfig';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import MegaMenu from './MegaMenu';
import EcommerceMegaMenu from './EcommerceMegaMenu';
import MarketSelector from './MarketSelector';
import SearchBar from './SearchBar';

function MobileAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gold/10">
      <button
        type="button"
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-3 pl-3">{children}</div>}
    </div>
  );
}

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { pathname } = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

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
    if (menu === 'ecommerce') return <EcommerceMegaMenu onClose={close} />;
    return null;
  };

  const directMobileLinks = navLinks.filter((link) => !link.menu);

  return (
    <header className={`sticky top-0 z-50 bg-linen/95 backdrop-blur-md transition-all duration-300 border-b border-gold/10 ${sticky ? 'shadow-md shadow-gold/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${sticky ? 'h-14 md:h-16' : 'h-16 md:h-[4.5rem]'}`}>
          <button className="lg:hidden p-2 shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex flex-col items-center lg:items-start shrink-0 group">
            <div className="flex items-center gap-2">
              <Gem size={18} className="text-gold hidden sm:block" strokeWidth={1.25} />
              <span className="font-display text-xl md:text-2xl text-charcoal tracking-wide">{brand.name}</span>
            </div>
            <span className="text-[9px] tracking-[0.25em] uppercase text-muted hidden md:block">Fine Jewelry</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.menu && setOpenMenu(link.menu)}
                onMouseLeave={() => link.menu && setOpenMenu(null)}
              >
                <Link to={link.path} className={`${navClass(link)} inline-flex items-center gap-1`}>
                  {link.label}
                  {link.menu && <ChevronDown size={12} className="opacity-50" />}
                </Link>
                {link.menu && renderDropdown(link.menu)}
              </div>
            ))}
          </nav>

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
                <span className="absolute top-1 right-1 bg-emerald text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 animate-fade-in border-t border-gold/10 pt-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gold/10 bg-linen animate-fade-in max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-0">
            <div className="mb-4 md:hidden">
              <MarketSelector />
            </div>
            {directMobileLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm py-3 border-b border-gold/10 ${isNavLinkActive(pathname, link) ? 'text-gold' : 'text-charcoal'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/shop" className="text-sm py-3 border-b border-gold/10" onClick={() => setMobileOpen(false)}>
              Collections
            </Link>
            <MobileAccordion title="Ecommerce">
              <div className="space-y-4">
                <div>
                  <p className="section-eyebrow mb-2">{ecommerceMenu.retail.title}</p>
                  <div className="space-y-1">
                    {ecommerceMenu.retail.links.map((link) => (
                      <Link key={link.label + link.path} to={link.path} className="block text-sm text-muted hover:text-gold py-1.5" onClick={() => setMobileOpen(false)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-burgundy mb-2">{ecommerceMenu.wholesale.title}</p>
                  <div className="space-y-1">
                    {wholesaleNavLinks.map((link) => (
                      <Link key={link.label} to={link.path} className="block text-sm text-muted hover:text-gold py-1.5" onClick={() => setMobileOpen(false)}>
                        {link.label === 'Become a Wholesale Partner' ? 'Become a Partner' : link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </MobileAccordion>
            <Link to="/wishlist" className="text-sm py-3 border-t border-gold/10 mt-2" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            <Link to={user ? '/profile' : '/login'} className="text-sm py-3" onClick={() => setMobileOpen(false)}>
              {user ? 'My Account' : 'Login'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import {
  brand,
  navLinks,
  wholesaleNavLinks,
  manufacturingNavLinks,
  ecommerceMenu,
  isNavLinkActive,
} from '../utils/brandConfig';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import MegaMenu from './MegaMenu';
import EcommerceMegaMenu from './EcommerceMegaMenu';
import ManufacturingDropdown from './ManufacturingDropdown';
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
    const onScroll = () => setSticky(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const navClass = (link) => {
    const active = isNavLinkActive(pathname, link);
    return `text-xs xl:text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
      active ? 'text-gold border-b border-gold/40 pb-0.5' : 'text-charcoal hover:text-gold'
    }`;
  };

  const renderDropdown = (menu) => {
    if (openMenu !== menu) return null;
    const close = () => setOpenMenu(null);
    if (menu === 'collections') return <MegaMenu onClose={close} />;
    if (menu === 'manufacturing') return <ManufacturingDropdown onClose={close} />;
    if (menu === 'ecommerce') return <EcommerceMegaMenu onClose={close} />;
    return null;
  };

  const directMobileLinks = navLinks.filter((link) => !link.menu);

  return (
    <>
      <div className="bg-gradient-to-r from-champagne via-cream to-ivory text-charcoal text-center text-xs py-2 tracking-wide border-b border-gold/20">
        International jewelry manufacturing from Uzbekistan · Serving global markets
      </div>

      <header className={`sticky top-0 z-50 bg-pearl/95 backdrop-blur-sm transition-shadow duration-300 border-b border-gold/10 ${sticky ? 'shadow-md shadow-gold/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <button className="md:hidden p-2 shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="font-display text-xl md:text-2xl lg:text-3xl text-charcoal tracking-wide shrink-0">
              <span className="text-gradient-gold">{brand.name}</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 flex-1 justify-center">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.menu && setOpenMenu(link.menu)}
                  onMouseLeave={() => link.menu && setOpenMenu(null)}
                >
                  <Link to={link.path} className={navClass(link)}>
                    {link.label}
                    {link.menu && <ChevronDown size={12} className="opacity-60" />}
                  </Link>
                  {link.menu && renderDropdown(link.menu)}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <Link
                to="/contact?type=quote"
                className="hidden md:inline-flex bg-gold hover:bg-gold-dark text-white text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                Request a Quote
              </Link>
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold transition-colors" aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="hidden md:block p-2 hover:text-gold transition-colors relative" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to={user ? '/profile' : '/login'} className="hidden md:block p-2 hover:text-gold transition-colors" aria-label="Account">
                <User size={20} />
              </Link>
              <Link to="/cart" className="p-2 hover:text-gold transition-colors relative" aria-label="Cart">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gold/10 bg-pearl animate-fade-in max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col p-4 gap-0">
              {directMobileLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium py-3 border-b border-gold/10 ${
                    isNavLinkActive(pathname, link) ? 'text-gold' : ''
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/shop"
                className={`text-sm font-medium py-3 border-b border-gold/10 ${
                  isNavLinkActive(pathname, { menu: 'collections', path: '/shop' }) ? 'text-gold' : ''
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Collections
              </Link>

              <MobileAccordion title="Manufacturing">
                <div className="space-y-1">
                  {manufacturingNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="block text-sm text-muted hover:text-gold py-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              <MobileAccordion title="Ecommerce">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gold-dark mb-2">{ecommerceMenu.retail.title}</p>
                    <div className="space-y-1">
                      {ecommerceMenu.retail.links.map((link) => (
                        <Link
                          key={link.label + link.path}
                          to={link.path}
                          className="block text-sm text-muted hover:text-gold py-1.5"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-burgundy mb-2">{ecommerceMenu.wholesale.title}</p>
                    <div className="space-y-1">
                      {wholesaleNavLinks.map((link) => (
                        <Link
                          key={link.label}
                          to={link.path}
                          className="block text-sm text-muted hover:text-gold py-1.5"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label === 'Become a Wholesale Partner' ? 'Become a Partner' : link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </MobileAccordion>

              <Link to="/contact?type=quote" className="mt-3 bg-gold text-white text-center py-3 rounded-full text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Request a Quote
              </Link>
              <Link to="/wishlist" className="text-sm font-medium py-3" onClick={() => setMobileOpen(false)}>Wishlist</Link>
              <Link to={user ? '/profile' : '/login'} className="text-sm font-medium py-3" onClick={() => setMobileOpen(false)}>
                {user ? 'My Account' : 'Login'}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { brand, navLinks } from '../utils/brandConfig';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';

export default function Header() {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => link.megaMenu && setMegaOpen(true)}
                  onMouseLeave={() => link.megaMenu && setMegaOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="text-xs xl:text-sm font-medium text-charcoal hover:text-gold transition-colors tracking-wide uppercase whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                  {link.megaMenu && megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
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
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium py-3 border-b border-gold/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
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

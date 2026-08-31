import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="bg-charcoal text-white text-center text-xs py-2 tracking-wider">
        Free Shipping | Easy Returns | Secure Payments
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${sticky ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="font-display text-2xl md:text-3xl text-charcoal tracking-wide">
              {brand.name}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => link.megaMenu && setMegaOpen(true)}
                  onMouseLeave={() => link.megaMenu && setMegaOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-charcoal hover:text-gold transition-colors tracking-wide uppercase"
                  >
                    {link.label}
                  </Link>
                  {link.megaMenu && megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold transition-colors" aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="hidden md:block p-2 hover:text-gold transition-colors relative" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
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
          <div className="md:hidden border-t bg-white animate-fade-in">
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium py-2 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Wishlist</Link>
              <Link to={user ? '/profile' : '/login'} className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {user ? 'My Account' : 'Login'}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

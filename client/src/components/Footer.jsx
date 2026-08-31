import { Link } from 'react-router-dom';
import { brand } from '../utils/brandConfig';

const shopLinks = [
  'Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Bangles',
  'Mangalsutra', "Men's Jewellery", "Women's Jewellery", 'Kids Jewellery', 'Gifting',
].map((name) => ({
  label: name,
  path: `/shop/${name.toLowerCase().replace(/['\s]+/g, '-').replace('mens', 'men').replace('womens', 'women')}`,
}));

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h4 className="font-display text-xl mb-4 text-gold">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((l) => (
                <li key={l.label}><Link to={l.path} className="text-sm text-gray-400 hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4 text-gold">Wholesale</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/wholesale" className="hover:text-gold transition-colors">Wholesale</Link></li>
              <li><Link to="/wholesale/register" className="hover:text-gold transition-colors">Wholesale Registration</Link></li>
              <li><Link to="/wholesale/shop" className="hover:text-gold transition-colors">Wholesale Catalogue</Link></li>
              <li><Link to="/wholesale#bulk-pricing" className="hover:text-gold transition-colors">Bulk Orders</Link></li>
              <li><Link to="/wholesale#faq" className="hover:text-gold transition-colors">Wholesale FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4 text-gold">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-gold transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4 text-gold">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/about#story" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-4 text-gold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-gold">{brand.name}</p>
            <p className="text-sm text-gray-400 mt-1">{brand.tagline}</p>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Instagram', href: brand.social.instagram },
              { label: 'Facebook', href: brand.social.facebook },
              { label: 'YouTube', href: brand.social.youtube },
              { label: 'LinkedIn', href: brand.social.linkedin },
            ].map((social) => (
              <a key={social.label} href={social.href} className="text-gray-400 hover:text-gold transition-colors text-sm" aria-label={social.label}>
                {social.label[0]}
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

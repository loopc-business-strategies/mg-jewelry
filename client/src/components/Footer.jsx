import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { brand, footerColumns, socialLinks } from '../utils/brandConfig';
import { socialIconMap } from './ui/SocialIcons';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-ivory to-cream border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <p className="font-display text-2xl text-charcoal tracking-wide">{brand.name}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold-dark mt-1">International Jewelry</p>
            </Link>
            <p className="text-sm font-medium text-charcoal mb-1">{brand.legalName}</p>
            <address className="text-sm text-muted leading-relaxed mb-4 not-italic">
              {brand.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="text-sm text-muted leading-relaxed mb-4 max-w-xs">
              {brand.tagline}
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <Link
                    key={social.label}
                    to={social.href}
                    className="p-2 border border-gold/25 rounded-full text-muted hover:text-gold hover:border-gold/50 bg-white/50 transition-colors"
                    aria-label={social.label}
                  >
                    {Icon && <Icon size={16} />}
                  </Link>
                );
              })}
            </div>
          </div>
          {[
            { title: 'Shop', links: footerColumns.shop },
            { title: 'About', links: footerColumns.about },
            { title: 'Help', links: footerColumns.help },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.path + l.label}>
                    <Link to={l.path} className="text-sm text-muted hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-4">Newsletter</h4>
            <p className="text-sm text-muted mb-4">Receive updates on new collections and exclusive offers.</p>
            <form onSubmit={handleNewsletter} className="flex border border-gold/20 bg-white">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
                required
              />
              <button type="submit" className="px-4 text-gold hover:text-gold-dark transition-colors text-sm">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {brand.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { brand, footerColumns, socialLinks } from '../utils/brandConfig';
import BrandLogo from './BrandLogo';
import { socialIconMap } from './ui/SocialIcons';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <BrandLogo variant="footer" />
            <p className="type-body-sm font-medium text-charcoal mb-1">{brand.legalName}</p>
            <address className="type-body-sm leading-relaxed mb-4 not-italic">
              {brand.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="type-body-sm leading-relaxed mb-4 max-w-xs">
              {brand.tagline}
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <Link
                    key={social.label}
                    to={social.href}
                    className="p-2 border border-border rounded-full text-muted hover:text-gold hover:border-gold bg-cream transition-colors"
                    aria-label={social.label}
                  >
                    {Icon && <Icon size={16} />}
                  </Link>
                );
              })}
            </div>
          </div>
          {[
            { titleKey: 'footer.shop', links: footerColumns.shop },
            { titleKey: 'footer.about', links: footerColumns.about },
            { titleKey: 'footer.help', links: footerColumns.help },
          ].map(({ titleKey, links }) => (
            <div key={titleKey}>
              <h4 className="text-sm font-semibold text-charcoal mb-1">{t(titleKey)}</h4>
              <div className="section-title-line mb-4" />
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.path + l.label}>
                    <Link to={l.path} className="type-body-sm hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-charcoal mb-1">Newsletter</h4>
            <div className="section-title-line mb-4" />
            <p className="type-body-sm mb-4">Receive updates on new collections and exclusive offers.</p>
            <form onSubmit={handleNewsletter} className="flex border border-border bg-white rounded-md overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 type-body-sm bg-transparent focus:outline-none text-charcoal placeholder:text-[#999999]"
                required
              />
              <button type="submit" className="px-4 text-gold hover:text-gold-dark transition-colors text-sm font-medium">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 type-form-help">
          <p>© {new Date().getFullYear()} {brand.legalName}. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

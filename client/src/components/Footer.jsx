import { Link } from 'react-router-dom';
import { brand, footerColumns, socialLinks } from '../utils/brandConfig';
import { socialIconMap } from './ui/SocialIcons';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <BrandLogo className="h-10 w-10 object-contain" alt={brand.name} />
              <div>
                <p className="font-display text-xl font-semibold text-off-white">{brand.name}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70">Gold Industry</p>
              </div>
            </Link>
            <p className="text-sm font-medium text-off-white/80 mb-1">{brand.legalName}</p>
            <address className="text-sm text-muted-light leading-relaxed mb-4 not-italic">
              {brand.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="text-sm text-muted-light leading-relaxed mb-6 max-w-xs">
              {brand.tagline}
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <Link
                    key={social.label}
                    to={social.href}
                    className="p-2 border border-gold/20 rounded-sm text-muted-light hover:text-gold hover:border-gold/40 transition-colors"
                    aria-label={social.label}
                  >
                    {Icon && <Icon size={16} />}
                  </Link>
                );
              })}
            </div>
          </div>

          {[
            { title: 'Company', links: footerColumns.company },
            { title: 'Business', links: footerColumns.business },
            { title: 'Legal', links: footerColumns.legal },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-gold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.path + l.label}>
                    <Link to={l.path} className="text-sm text-muted-light hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-light">
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

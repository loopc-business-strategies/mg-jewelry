import { Link } from 'react-router-dom';
import { brand, collectionCategories } from '../utils/brandConfig';

const footerLinks = {
  company: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Manufacturing', path: '/manufacturing' },
    { label: 'Contact', path: '/contact' },
  ],
  collections: collectionCategories.map((slug) => ({
    label: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    path: `/shop/${slug}`,
  })),
  business: [
    { label: 'Shop Retail', path: '/shop' },
    { label: 'Wholesale Shop', path: '/wholesale/shop' },
    { label: 'Wholesale', path: '/wholesale' },
    { label: 'Custom Jewelry', path: '/custom-jewelry' },
    { label: 'Partner With Us', path: '/wholesale/register' },
    { label: 'Request a Quote', path: '/contact?type=quote' },
  ],
  support: [
    { label: 'Contact', path: '/contact' },
    { label: 'Shipping', path: '/shipping' },
    { label: 'Returns', path: '/returns' },
    { label: 'FAQ', path: '/faq' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-cream via-ivory to-champagne border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <p className="font-display text-2xl text-gradient-gold mb-2">{brand.name}</p>
            <p className="text-sm text-muted mb-4">{brand.legalName}</p>
            <address className="text-sm text-muted not-italic leading-relaxed">
              {brand.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="text-xs text-muted mt-4 leading-relaxed">
              Serving jewelry businesses across Central Asia, Russia, UK, Singapore, Malaysia, Hong Kong, USA and Dubai.
            </p>
          </div>
          {[
            { title: 'Company', links: footerLinks.company },
            { title: 'Collections', links: footerLinks.collections.slice(0, 6) },
            { title: 'Business', links: footerLinks.business },
            { title: 'Support', links: footerLinks.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-display text-lg mb-4 text-gold-dark">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.path + l.label}>
                    <Link to={l.path} className="text-sm text-muted hover:text-gold transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted italic">{brand.tagline}</p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

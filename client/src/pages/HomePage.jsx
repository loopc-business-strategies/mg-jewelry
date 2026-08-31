import { useEffect, useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/sections/HeroSection';
import ProductShowcaseSection from '../components/sections/ProductShowcaseSection';
import AboutPreviewSection from '../components/sections/AboutPreviewSection';
import B2BSection from '../components/sections/B2BSection';
import CustomManufacturingSection from '../components/sections/CustomManufacturingSection';
import TrustSection from '../components/sections/TrustSection';
import ContactCTASection from '../components/sections/ContactCTASection';
import { brand, categoryIcons } from '../utils/brandConfig';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then(({ data }) => setFeatured(data.products)).catch(() => {});
  }, []);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.legalName,
    alternateName: brand.name,
    url: brand.siteUrl,
    description: brand.heroSubtitle,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '242 Girvonbulok Street',
      addressLocality: 'Namangan Davlatabad',
      addressRegion: 'Namangan',
      addressCountry: 'UZ',
    },
  };

  return (
    <>
      <SEOHead
        title="International Jewelry Manufacturing from Uzbekistan"
        description={`${brand.name} — ${brand.tagline} Premium gold and diamond jewelry manufacturing for global markets.`}
        path="/"
        schema={schema}
      />
      <HeroSection />
      <ProductShowcaseSection products={featured} />
      <section className="py-12 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl text-center mb-8 text-charcoal">Browse Collections</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-4">
            {categoryIcons.map((cat) => (
              <Link key={cat.slug} to={`/shop/${cat.slug}`} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-xl group-hover:shadow-md group-hover:scale-105 transition-all border border-gold/10">
                  {cat.icon}
                </div>
                <span className="text-xs text-center font-medium group-hover:text-gold transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <AboutPreviewSection />
      <B2BSection />
      <CustomManufacturingSection />
      <TrustSection />
      <ContactCTASection />
    </>
  );
}

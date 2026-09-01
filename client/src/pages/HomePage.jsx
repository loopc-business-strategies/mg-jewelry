import { useEffect, useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/sections/HeroSection';
import CategoryShowcaseSection from '../components/sections/CategoryShowcaseSection';
import ProductShowcaseSection from '../components/sections/ProductShowcaseSection';
import CollectionPromoSection from '../components/sections/CollectionPromoSection';
import ServiceBarSection from '../components/sections/ServiceBarSection';
import AboutPreviewSection from '../components/sections/AboutPreviewSection';
import B2BSection from '../components/sections/B2BSection';
import CustomManufacturingSection from '../components/sections/CustomManufacturingSection';
import ContactCTASection from '../components/sections/ContactCTASection';
import { brand } from '../utils/brandConfig';

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api.get('/products?sort=best_selling&limit=4')
      .then(({ data }) => setBestSellers(data.products || []))
      .catch(() => {
        api.get('/products?featured=true&limit=4').then(({ data }) => setBestSellers(data.products || [])).catch(() => {});
      });
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
        description={`${brand.name} — ${brand.tagline} Premium gold and diamond jewelry for global markets.`}
        path="/"
        schema={schema}
      />
      <HeroSection />
      <CategoryShowcaseSection />
      <ProductShowcaseSection products={bestSellers} />
      <CollectionPromoSection />
      <ServiceBarSection />
      <AboutPreviewSection />
      <B2BSection />
      <CustomManufacturingSection />
      <ContactCTASection />
    </>
  );
}

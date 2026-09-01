import { useEffect, useState } from 'react';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import DualPathSection from '../components/sections/DualPathSection';
import CredibilitySection from '../components/sections/CredibilitySection';
import HeroSection from '../components/sections/HeroSection';
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
    logo: `${brand.siteUrl}${brand.logo}`,
    description: `${brand.legalName} — ${brand.tagline}. Local gold buying and international jewellery manufacturing from Namangan, Uzbekistan.`,
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
        title="Gold Manufacturer Uzbekistan | Sell Gold & Wholesale Jewellery"
        description={`${brand.name} — connecting Central Asian gold to global markets through mining, refinery operations, jewelry manufacturing and international trade.`}
        path="/"
        schema={schema}
      />
      <HeroSection />
      <DualPathSection />
      <CredibilitySection />
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

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
import { useTranslation } from '../hooks/useTranslation';

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);
  const { t, lang } = useTranslation();

  useEffect(() => {
    api.get('/products?sort=best_selling&limit=4')
      .then(({ data }) => setBestSellers(data.products || []))
      .catch(() => {
        api.get('/products?featured=true&limit=4').then(({ data }) => setBestSellers(data.products || [])).catch(() => {});
      });
  }, [lang]);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.legalName,
    alternateName: brand.name,
    url: brand.siteUrl,
    logo: `${brand.siteUrl}${brand.logo}`,
    description: `${brand.legalName} — ${t('brand.tagline')}. Local gold buying and international jewellery manufacturing from Namangan, Uzbekistan.`,
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
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
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

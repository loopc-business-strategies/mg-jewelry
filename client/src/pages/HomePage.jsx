import SEOHead from '../components/SEOHead';
import CorporateHeroSection from '../components/sections/CorporateHeroSection';
import CredibilitySection from '../components/sections/CredibilitySection';
import DualPathSection from '../components/sections/DualPathSection';
import CompanyStorySection from '../components/sections/CompanyStorySection';
import ManufacturingPreviewSection from '../components/sections/ManufacturingPreviewSection';
import ProductFocusSection from '../components/sections/ProductFocusSection';
import InternationalBuyersSection from '../components/sections/InternationalBuyersSection';
import RegionalMarketsSection from '../components/sections/RegionalMarketsSection';
import TrustProofSection from '../components/sections/TrustProofSection';
import ShowroomGallerySection from '../components/sections/ShowroomGallerySection';
import FinalCTASection from '../components/sections/FinalCTASection';
import { brand, seoKeywords } from '../utils/brandConfig';

export default function HomePage() {
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
        title="Modern Gold — Gold Industry Company | Central Asia"
        description={`${brand.name} — ${brand.tagline}. Gold buying, jewellery manufacturing and international trade from ${brand.location}.`}
        path="/"
        keywords={seoKeywords}
        schema={schema}
      />
      <CorporateHeroSection />
      <CredibilitySection />
      <DualPathSection />
      <CompanyStorySection />
      <ManufacturingPreviewSection />
      <ShowroomGallerySection />
      <ProductFocusSection />
      <InternationalBuyersSection />
      <RegionalMarketsSection />
      <TrustProofSection />
      <FinalCTASection />
    </>
  );
}

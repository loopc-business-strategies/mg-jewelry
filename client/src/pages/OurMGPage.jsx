import SEOHead from '../components/SEOHead';
import OurMGHeroSection from '../components/sections/our-mg/OurMGHeroSection';
import OurMGAboutSection from '../components/sections/our-mg/OurMGAboutSection';
import OurMGWhySection from '../components/sections/our-mg/OurMGWhySection';
import OurMGFeaturesSection from '../components/sections/our-mg/OurMGFeaturesSection';
import OurMGShowcaseSection from '../components/sections/our-mg/OurMGShowcaseSection';
import OurMGDifferentSection from '../components/sections/our-mg/OurMGDifferentSection';
import OurMGDownloadSection from '../components/sections/our-mg/OurMGDownloadSection';
import OurMGFinalCTASection from '../components/sections/our-mg/OurMGFinalCTASection';
import { useTranslation } from '../hooks/useTranslation';

export default function OurMGPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title="Our MG"
        description={t('ourMg.seo.description')}
        path="/our-mg"
      />
      <OurMGHeroSection />
      <OurMGAboutSection />
      <OurMGWhySection />
      <OurMGFeaturesSection />
      <OurMGShowcaseSection />
      <OurMGDifferentSection />
      <OurMGDownloadSection />
      <OurMGFinalCTASection />
    </>
  );
}

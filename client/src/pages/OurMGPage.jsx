import SEOHead from '../components/SEOHead';
import OurMGHeroSection from '../components/sections/our-mg/OurMGHeroSection';
import OurMGAboutSection from '../components/sections/our-mg/OurMGAboutSection';
import OurMGBuyGoldSection from '../components/sections/our-mg/OurMGBuyGoldSection';
import OurMGSellGoldSection from '../components/sections/our-mg/OurMGSellGoldSection';
import OurMGCollectionCentersSection from '../components/sections/our-mg/OurMGCollectionCentersSection';
import OurMGWhySection from '../components/sections/our-mg/OurMGWhySection';
import OurMGConnectSection from '../components/sections/our-mg/OurMGConnectSection';
import OurMGAppExperienceSection from '../components/sections/our-mg/OurMGAppExperienceSection';
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
      <OurMGBuyGoldSection />
      <OurMGSellGoldSection />
      <OurMGCollectionCentersSection />
      <OurMGWhySection />
      <OurMGConnectSection />
      <OurMGAppExperienceSection />
      <OurMGFinalCTASection />
    </>
  );
}

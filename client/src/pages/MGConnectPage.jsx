import SEOHead from '../components/SEOHead';
import MGConnectHeroSection from '../components/sections/mg-connect/MGConnectHeroSection';
import MGConnectIntroSection from '../components/sections/mg-connect/MGConnectIntroSection';
import MGConnectShowcaseSection from '../components/sections/mg-connect/MGConnectShowcaseSection';
import MGConnectJourneysSection from '../components/sections/mg-connect/MGConnectJourneysSection';
import MGConnectBenefitsSection from '../components/sections/mg-connect/MGConnectBenefitsSection';
import MGConnectAccessSection from '../components/sections/mg-connect/MGConnectAccessSection';
import MGConnectFinalCTASection from '../components/sections/mg-connect/MGConnectFinalCTASection';
import { useTranslation } from '../hooks/useTranslation';

export default function MGConnectPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title="MG Connect"
        description={t('mgConnect.seo.description')}
        path="/mg-connect"
      />
      <MGConnectHeroSection />
      <MGConnectIntroSection />
      <MGConnectShowcaseSection />
      <MGConnectJourneysSection />
      <MGConnectBenefitsSection />
      <MGConnectAccessSection id="app-access" />
      <MGConnectFinalCTASection />
    </>
  );
}

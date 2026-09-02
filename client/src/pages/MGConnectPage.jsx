import SEOHead from '../components/SEOHead';
import MGConnectHeroSection from '../components/sections/mg-connect/MGConnectHeroSection';
import MGConnectAboutSection from '../components/sections/mg-connect/MGConnectAboutSection';
import MGConnectFeaturesSection from '../components/sections/mg-connect/MGConnectFeaturesSection';
import MGConnectShowcaseSection from '../components/sections/mg-connect/MGConnectShowcaseSection';
import MGConnectHowItWorksSection from '../components/sections/mg-connect/MGConnectHowItWorksSection';
import MGConnectExperienceSection from '../components/sections/mg-connect/MGConnectExperienceSection';
import MGConnectDownloadSection from '../components/sections/mg-connect/MGConnectDownloadSection';
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
      <MGConnectAboutSection />
      <MGConnectFeaturesSection />
      <MGConnectShowcaseSection />
      <MGConnectHowItWorksSection />
      <MGConnectExperienceSection />
      <MGConnectDownloadSection id="download" />
      <MGConnectFinalCTASection />
    </>
  );
}

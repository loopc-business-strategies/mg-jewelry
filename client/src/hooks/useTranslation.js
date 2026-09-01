import { useMarket } from '../context/MarketContext';

export function useTranslation() {
  const { t, language, prefs } = useMarket();
  return { t, language, lang: prefs.language };
}

export default useTranslation;

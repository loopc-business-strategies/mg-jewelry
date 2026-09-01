import { useMarket } from '../context/MarketContext';

export function useTranslation() {
  const { t, language, prefs, locale } = useMarket();
  return { t, language, lang: prefs.language, locale };
}

export default useTranslation;

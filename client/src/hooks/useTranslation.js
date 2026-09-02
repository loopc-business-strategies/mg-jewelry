import { useCallback } from 'react';
import { useMarket } from '../context/MarketContext';
import { formatTranslation } from '../i18n/siteTranslations';

export function useTranslation() {
  const { t, language, prefs, locale } = useMarket();
  const tf = useCallback(
    (key, vars = {}, fallback = '') => formatTranslation(t(key, fallback), vars),
    [t]
  );
  return { t, tf, language, lang: prefs.language, locale };
}

export default useTranslation;

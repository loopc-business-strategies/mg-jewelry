import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  STORAGE_KEY,
  defaultPrefs,
  getMarketById,
  getLanguageByCode,
  getCurrencyForMarket,
} from '../utils/marketConfig';
import { translate, languageLocales } from '../i18n/translations';

const MarketContext = createContext();

function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultPrefs;
}

export function MarketProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    document.documentElement.lang = prefs.language || 'en';
  }, [prefs]);

  const setLanguage = useCallback((language) => {
    setPrefs((p) => ({ ...p, language }));
  }, []);

  const setMarket = useCallback((market) => {
    const currency = getCurrencyForMarket(market);
    setPrefs((p) => ({ ...p, market, currency }));
  }, []);

  const setCurrency = useCallback((currency) => {
    setPrefs((p) => ({ ...p, currency }));
  }, []);

  const updatePrefs = useCallback((next) => {
    setPrefs((p) => ({ ...p, ...next }));
  }, []);

  const market = getMarketById(prefs.market);
  const language = getLanguageByCode(prefs.language);
  const locale = languageLocales[prefs.language] || languageLocales.en;

  const t = useCallback(
    (key, fallback = '') => translate(prefs.language, key, fallback),
    [prefs.language]
  );

  const value = useMemo(
    () => ({
      prefs,
      market,
      language,
      locale,
      setLanguage,
      setMarket,
      setCurrency,
      updatePrefs,
      t,
    }),
    [prefs, market, language, locale, setLanguage, setMarket, setCurrency, updatePrefs, t]
  );

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);

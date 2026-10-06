import { createContext, useContext, useState, useLayoutEffect, useCallback, useMemo } from 'react';
import {
  STORAGE_KEY,
  defaultPrefs,
  getMarketById,
  getLanguageByCode,
  getCurrencyForMarket,
} from '../utils/marketConfig';
import { translate, languageLocales } from '../i18n/translations';
import { setRequestLanguage } from '../services/api';

const MarketContext = createContext();

function loadPrefs() {
  let prefs = defaultPrefs;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) prefs = { ...defaultPrefs, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  if (getLanguageByCode(prefs.language).code !== prefs.language) {
    prefs = { ...prefs, language: defaultPrefs.language };
  }
  setRequestLanguage(prefs.language);
  return prefs;
}

export function MarketProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);

  // Must run before children's passive effects that refetch on language change.
  useLayoutEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch { /* ignore */ }
    document.documentElement.lang = prefs.language || 'en';
    document.documentElement.dir = prefs.language === 'ar' ? 'rtl' : 'ltr';
  }, [prefs]);

  const setLanguage = useCallback((language) => {
    setRequestLanguage(language);
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
    if (next.language) setRequestLanguage(next.language);
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

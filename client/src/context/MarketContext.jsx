import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEY,
  defaultPrefs,
  getMarketById,
  getLanguageByCode,
  getCurrencyForMarket,
} from '../utils/marketConfig';

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

  return (
    <MarketContext.Provider
      value={{
        prefs,
        market,
        language,
        setLanguage,
        setMarket,
        setCurrency,
        updatePrefs,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);

export const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ru', label: 'Russian', short: 'RU' },
  { code: 'uz', label: 'Uzbek', short: 'UZ' },
];

export const markets = [
  { id: 'uzbekistan', label: 'Uzbekistan', flag: '🇺🇿', currency: 'UZS', locale: 'uz-UZ' },
  { id: 'central-asia', label: 'Central Asia', flag: '🌏', currency: 'USD', locale: 'en' },
  { id: 'russia', label: 'Russia', flag: '🇷🇺', currency: 'RUB', locale: 'ru-RU' },
  { id: 'united-kingdom', label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', locale: 'en-GB' },
  { id: 'singapore', label: 'Singapore', flag: '🇸🇬', currency: 'SGD', locale: 'en-SG' },
  { id: 'malaysia', label: 'Malaysia', flag: '🇲🇾', currency: 'MYR', locale: 'ms-MY' },
  { id: 'hong-kong', label: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', locale: 'zh-HK' },
  { id: 'united-states', label: 'United States', flag: '🇺🇸', currency: 'USD', locale: 'en-US' },
  { id: 'dubai-uae', label: 'Dubai / UAE', flag: '🇦🇪', currency: 'AED', locale: 'ar-AE' },
];

export const currencies = [
  { code: 'UZS', label: 'Uzbek Som (UZS)' },
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'RUB', label: 'Russian Ruble (RUB)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'SGD', label: 'Singapore Dollar (SGD)' },
  { code: 'MYR', label: 'Malaysian Ringgit (MYR)' },
  { code: 'HKD', label: 'Hong Kong Dollar (HKD)' },
  { code: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'INR', label: 'Indian Rupee (INR)' },
];

/** Base currency for stored product prices. Plug exchangeRates when backend provides them. */
export const BASE_CURRENCY = 'INR';

/** Optional: { USD: 0.012, GBP: 0.0095, ... } relative to BASE_CURRENCY */
export const exchangeRates = {};

export const STORAGE_KEY = 'mg-market-prefs';

export const defaultPrefs = {
  language: 'en',
  market: 'uzbekistan',
  currency: 'UZS',
};

export const selectorTranslations = {
  en: {
    title: 'International Market',
    selectLanguage: 'Select Language',
    selectMarket: 'Select Market',
    selectCurrency: 'Select Currency',
    continue: 'Continue',
    priceNote: 'Prices shown in selected currency. Live conversion available when configured.',
    close: 'Close',
  },
  ru: {
    title: 'Международный рынок',
    selectLanguage: 'Выберите язык',
    selectMarket: 'Выберите рынок',
    selectCurrency: 'Выберите валюту',
    continue: 'Продолжить',
    priceNote: 'Цены указаны в выбранной валюте. Конвертация будет доступна позже.',
    close: 'Закрыть',
  },
  uz: {
    title: 'Xalqaro bozor',
    selectLanguage: 'Tilni tanlang',
    selectMarket: 'Bozorni tanlang',
    selectCurrency: 'Valyutani tanlang',
    continue: 'Davom etish',
    priceNote: 'Narxlar tanlangan valyutada ko\'rsatiladi. Konvertatsiya keyinroq qo\'shiladi.',
    close: 'Yopish',
  },
};

export function getMarketById(id) {
  return markets.find((m) => m.id === id) || markets[0];
}

export function getLanguageByCode(code) {
  return languages.find((l) => l.code === code) || languages[0];
}

export function getCurrencyForMarket(marketId) {
  return getMarketById(marketId).currency;
}

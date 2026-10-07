import { translate, hasTranslation } from '../i18n/translations';

const asArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Database text that still equals a known seeded English default is shown translated;
 * anything an admin has customised is shown exactly as stored.
 */
export function seededText(t, key, value, legacy = []) {
  if (!value) return t(key);
  if (value === translate('en', key) || legacy.includes(value)) return t(key);
  return value;
}

export const metalText = (t, metal) => (metal ? t(`filters.options.${metal}`, metal) : metal);

export const sizeText = (t, size) => (size === 'Standard' ? t('ui.sizeStandard', size) : size);

export function tierLabelText(t, label, index) {
  const translated = asArray(t('wholesalePage.tierLabels'));
  if (!label) return translated[index] || '';
  const defaultIndex = asArray(translate('en', 'wholesalePage.tierLabels')).indexOf(label);
  return defaultIndex >= 0 ? translated[defaultIndex] || label : label;
}

const LEGACY_CATEGORY_TEXT = {
  chains: ['Premium gold chains manufactured by Modern Gold Jewelry in Namangan, Uzbekistan.'],
  bangles: ['Handcrafted gold bangles for retail and wholesale partners worldwide.'],
};

export const categoryIntroText = (t, slug, value) =>
  value && hasTranslation(`categoryIntro.${slug}`) ? seededText(t, `categoryIntro.${slug}`, value, LEGACY_CATEGORY_TEXT[slug]) : value;

const BLOG_CATEGORY_KEYS = {
  'Jewellery Guide': 'jewelleryGuide',
  'Buying Guide': 'buyingGuide',
  'Gold Jewellery': 'goldJewellery',
  'Diamond Jewellery': 'diamondJewellery',
  'Wedding Jewellery': 'weddingJewellery',
  'Gift Ideas': 'giftIdeas',
  'Jewellery Care': 'jewelleryCare',
  'Fashion Trends': 'fashionTrends',
};

export const blogCategoryText = (t, category) =>
  BLOG_CATEGORY_KEYS[category] ? t(`blog.categories.${BLOG_CATEGORY_KEYS[category]}`, category) : category;

export const subcategoryText = (t, sub) =>
  sub?.slug && hasTranslation(`subcategories.${sub.slug}`) ? seededText(t, `subcategories.${sub.slug}`, sub.name) : sub?.name;

import { formatTranslation } from '../i18n/siteTranslations';

const CODE_KEYS = {
  USER_EXISTS: 'errors.userExists',
  INVALID_CREDENTIALS: 'errors.invalidCredentials',
  INVALID_TOKEN: 'errors.invalidToken',
  INVALID_COUPON: 'errors.invalidCoupon',
  COUPON_EXPIRED: 'errors.couponExpired',
  COUPON_LIMIT: 'errors.couponLimit',
  COUPON_MIN_ORDER: 'errors.couponMinOrder',
  EMPTY_CART: 'errors.emptyCart',
  PRODUCT_UNAVAILABLE: 'errors.productUnavailable',
  INSUFFICIENT_STOCK: 'errors.insufficientStock',
  PAYMENT_UNAVAILABLE: 'errors.paymentUnavailable',
  DUPLICATE_REVIEW: 'errors.duplicateReview',
  FORBIDDEN: 'errors.forbidden',
};

// Server responses without a `code` field, matched by their English message.
const MESSAGE_KEYS = [
  [/^wholesale application already submitted/i, 'errors.wholesaleAlreadySubmitted'],
  [/^wholesale cart is empty/i, 'errors.emptyCart'],
  [/^cart is empty/i, 'errors.emptyCart'],
  [/^too many/i, 'errors.tooManyRequests'],
  [/wholesale account required$/i, 'errors.wholesaleRequired'],
  [/^not authorized|^user not found$/i, 'errors.notAuthorized'],
  [/^product not found/i, 'errors.productNotFound'],
  [/^order not found/i, 'errors.orderNotFound'],
];

/**
 * Translated message for a failed API request. Never shows the raw (English) server text.
 * `err` may be an axios error or a stored `{ response }`-shaped object.
 */
export function apiErrorMessage(err, t, fallbackKey) {
  const response = err?.response;
  if (!response) return t(err?.request ? 'errors.network' : fallbackKey);

  const data = response.data;
  const message = typeof data === 'string' ? data : data?.message || '';

  const moq = /^minimum order quantity is (\d+)/i.exec(message);
  if (moq) return formatTranslation(t('errors.minQuantity'), { moq: moq[1] });

  if (data?.code && CODE_KEYS[data.code]) return t(CODE_KEYS[data.code]);

  const match = MESSAGE_KEYS.find(([pattern]) => pattern.test(message));
  if (match) return t(match[1]);

  if (response.status === 429) return t('errors.tooManyRequests');
  return t(fallbackKey);
}

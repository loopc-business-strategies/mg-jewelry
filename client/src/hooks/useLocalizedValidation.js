import { useEffect } from 'react';
import { useTranslation } from './useTranslation';

function validationMessage(el, t, tf) {
  const v = el.validity;
  if (v.valueMissing) {
    if (el.type === 'checkbox') return t('validation.checkbox');
    if (el.tagName === 'SELECT' || el.type === 'radio') return t('validation.select');
    return t('validation.required');
  }
  if (v.typeMismatch) {
    if (el.type === 'email') return t('validation.email');
    if (el.type === 'url') return t('validation.url');
    return t('validation.invalid');
  }
  if (v.tooShort) return tf('validation.minLength', { n: el.minLength });
  if (v.tooLong) return tf('validation.maxLength', { n: el.maxLength });
  if (v.patternMismatch) return t('validation.pattern');
  if (v.badInput) return t('validation.number');
  if (v.rangeUnderflow) return tf('validation.min', { n: el.min });
  if (v.rangeOverflow) return tf('validation.max', { n: el.max });
  return t('validation.invalid');
}

/** Replaces the browser's native (browser-language) form validation bubbles with site-language messages. */
export function useLocalizedValidation() {
  const { t, tf } = useTranslation();

  useEffect(() => {
    const clear = (el) => {
      if (!el?.setCustomValidity) return;
      if (el.type === 'radio' && el.name && el.form) {
        el.form.querySelectorAll(`input[type="radio"][name="${CSS.escape(el.name)}"]`)
          .forEach((radio) => radio.setCustomValidity(''));
      } else {
        el.setCustomValidity('');
      }
    };

    const onInvalid = (e) => {
      const el = e.target;
      if (!el?.setCustomValidity) return;
      el.setCustomValidity('');
      if (!el.validity.valid) el.setCustomValidity(validationMessage(el, t, tf));
    };
    const onEdit = (e) => clear(e.target);

    document.addEventListener('invalid', onInvalid, true);
    document.addEventListener('input', onEdit, true);
    document.addEventListener('change', onEdit, true);
    return () => {
      document.removeEventListener('invalid', onInvalid, true);
      document.removeEventListener('input', onEdit, true);
      document.removeEventListener('change', onEdit, true);
    };
  }, [t, tf]);
}

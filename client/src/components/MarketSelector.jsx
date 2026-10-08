import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { languages } from '../utils/marketConfig';

export default function MarketSelector({ compact = false }) {
  const { prefs, language, updatePrefs, t } = useMarket();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleLanguage = (code) => {
    updatePrefs({ language: code });
    setOpen(false);
  };

  const trigger = compact ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 text-xs text-charcoal hover:text-gold transition-colors px-2.5 py-1 border border-border rounded-full bg-white"
      aria-label={t('selector.selectLanguage')}
    >
      <Globe size={14} className="text-gold" />
      <span>{language.short}</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-start border border-border bg-white rounded-md hover:border-gold transition-colors"
    >
      <Globe size={16} className="text-gold shrink-0" />
      <span>{language.label}</span>
    </button>
  );

  const modal = open ? (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 modal-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        className="relative w-full sm:max-w-sm bg-white border border-border shadow-xl sm:rounded-lg max-h-[90vh] overflow-y-auto overscroll-contain animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-selector-title"
      >
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 id="language-selector-title" className="text-xl font-semibold text-charcoal">{t('selector.selectLanguage')}</h2>
          <button type="button" onClick={() => setOpen(false)} className="p-1 text-muted hover:text-charcoal" aria-label={t('selector.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-1">
          {languages.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-cream transition-colors border border-transparent has-[:checked]:border-border has-[:checked]:bg-cream"
            >
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={prefs.language === lang.code}
                onChange={() => handleLanguage(lang.code)}
                className="accent-gold w-4 h-4 shrink-0"
              />
              <span className="text-sm text-charcoal">{lang.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {trigger}
      {modal && createPortal(modal, document.body)}
    </>
  );
}

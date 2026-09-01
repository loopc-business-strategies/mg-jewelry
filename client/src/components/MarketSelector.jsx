import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { languages, markets, currencies } from '../utils/marketConfig';
import { translate } from '../i18n/translations';

function RadioOption({ name, value, checked, onChange, label, flag }) {
  return (
    <label className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-gold/5 transition-colors border border-transparent has-[:checked]:border-gold/30 has-[:checked]:bg-champagne/30">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-gold w-4 h-4 shrink-0"
      />
      {flag && <span className="text-lg shrink-0">{flag}</span>}
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}

export default function MarketSelector({ compact = false }) {
  const { prefs, market, language, updatePrefs } = useMarket();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(prefs);

  useEffect(() => {
    if (open) setDraft(prefs);
  }, [open, prefs]);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const draftT = (key) => translate(draft.language, key);

  const handleContinue = () => {
    updatePrefs(draft);
    setOpen(false);
  };

  const trigger = compact ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 text-xs text-charcoal hover:text-gold-dark transition-colors px-2 py-1 border border-gold/20 rounded-full bg-white/60"
      aria-label="Select market and language"
    >
      <Globe size={14} className="text-gold" />
      <span className="hidden sm:inline">{language.short}</span>
      <span className="text-muted hidden sm:inline">|</span>
      <span>{market.flag}</span>
      <span className="hidden md:inline max-w-[100px] truncate">{market.label}</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left border border-gold/15 bg-white rounded-md hover:border-gold/40 transition-colors"
    >
      <Globe size={16} className="text-gold shrink-0" />
      <span>{language.short} | {market.flag} {market.label}</span>
    </button>
  );

  const modal = open ? (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 modal-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        className="relative w-full sm:max-w-md bg-pearl border border-gold/20 shadow-xl sm:rounded-lg max-h-[90vh] overflow-y-auto overscroll-contain animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="market-selector-title"
      >
        <div className="sticky top-0 bg-pearl border-b border-gold/10 px-5 py-4 flex items-center justify-between">
          <h2 id="market-selector-title" className="font-display text-xl text-charcoal">{draftT('selector.title')}</h2>
          <button type="button" onClick={() => setOpen(false)} className="p-1 text-muted hover:text-charcoal" aria-label={draftT('selector.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="section-eyebrow mb-3">{draftT('selector.selectLanguage')}</p>
            <div className="space-y-1">
              {languages.map((lang) => (
                <RadioOption
                  key={lang.code}
                  name="language"
                  value={lang.code}
                  checked={draft.language === lang.code}
                  onChange={() => setDraft((d) => ({ ...d, language: lang.code }))}
                  label={lang.label}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="section-eyebrow mb-3">{draftT('selector.selectMarket')}</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {markets.map((m) => (
                <RadioOption
                  key={m.id}
                  name="market"
                  value={m.id}
                  checked={draft.market === m.id}
                  onChange={() => setDraft((d) => ({ ...d, market: m.id, currency: m.currency }))}
                  label={m.label}
                  flag={m.flag}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="section-eyebrow mb-3">{draftT('selector.selectCurrency')}</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {currencies.map((c) => (
                <RadioOption
                  key={c.code}
                  name="currency"
                  value={c.code}
                  checked={draft.currency === c.code}
                  onChange={() => setDraft((d) => ({ ...d, currency: c.code }))}
                  label={c.label}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted leading-relaxed">{draftT('selector.priceNote')}</p>

          <button type="button" onClick={handleContinue} className="w-full btn-primary-gold justify-center text-xs">
            {draftT('selector.continue')}
          </button>
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

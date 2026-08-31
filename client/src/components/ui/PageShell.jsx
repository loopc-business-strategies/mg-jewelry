export default function PageShell({ title, eyebrow, subtitle, children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-10 md:py-14 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-8 md:mb-10">
          {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
          {title && <h1 className="font-display text-3xl md:text-4xl text-charcoal">{title}</h1>}
          {subtitle && <p className="text-muted mt-2 max-w-2xl">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}

export default function PageShell({ title, eyebrow, subtitle, children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-10 md:py-14 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-8 md:mb-10">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          {title && <h1>{title}</h1>}
          {subtitle && <p className="type-section-desc prose-section mt-3">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}

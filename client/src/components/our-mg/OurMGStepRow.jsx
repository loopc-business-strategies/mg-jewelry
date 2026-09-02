export default function OurMGStepRow({ steps, variant = 'default' }) {
  return (
    <div className={`our-mg-step-row ${variant === 'compact' ? 'our-mg-step-row--compact' : ''}`}>
      {steps.map((step, i) => (
        <div key={step.title} className="our-mg-step-row__item">
          <span className="our-mg-step-row__number">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="our-mg-step-row__title">{step.title}</h3>
          <p className="our-mg-step-row__desc">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

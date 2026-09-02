import { RotateCcw, Shield, Award, Headphones } from 'lucide-react';
import { servicePromises } from '../../utils/brandConfig';
import { useTranslation } from '../../hooks/useTranslation';

const icons = [RotateCcw, Shield, Award, Headphones];

export default function ServiceBarSection() {
  const { t } = useTranslation();
  const items = t('home.serviceBar') || servicePromises;

  return (
    <section className="section-white py-12 md:py-16 px-4 border-y border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {Array.isArray(items) && items.map((item, i) => {
          const Icon = icons[i] || Award;
          return (
            <div key={item.title} className="text-center lg:text-left">
              <Icon size={22} className="text-gold mx-auto lg:mx-0 mb-3" strokeWidth={1.25} />
              <h3 className="type-body-sm font-medium text-charcoal mb-1">{item.title}</h3>
              <p className="type-form-help">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

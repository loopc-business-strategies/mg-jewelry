import {
  User,
  ShoppingBag,
  Package,
  ClipboardList,
  Heart,
  Search,
  Mail,
  Tag,
} from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

const featureIcons = [User, ShoppingBag, Tag, ClipboardList, User, Heart, Package, Search, Mail];

export default function OurMGFeaturesSection() {
  const { t } = useTranslation();
  const items = t('ourMg.features.items');

  return (
    <section className="section-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="section-eyebrow">{t('ourMg.features.eyebrow')}</p>
          <h2 className="type-section-title mb-4">{t('ourMg.features.title')}</h2>
        </div>
        <div className="our-mg-feature-grid">
          {items.map((item, i) => {
            const Icon = featureIcons[i] || User;
            return (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-border p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center mb-3">
                  <Icon size={18} className="text-gold" />
                </div>
                <h3 className="type-body-sm font-semibold tracking-wide mb-1.5">{item.title}</h3>
                <p className="type-body-sm text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

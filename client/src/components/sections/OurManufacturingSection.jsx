import SafeImage from '../SafeImage';
import { manufacturingProcessSteps } from '../../utils/imageConfig';

export default function OurManufacturingSection() {
  return (
    <section className="section-white py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="type-section-title text-center mb-10 md:mb-12">Our Manufacturing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
          {manufacturingProcessSteps.map(({ label, src, alt }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden">
                <SafeImage
                  src={src}
                  alt={alt}
                  disableFallback
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 type-body-sm font-medium text-charcoal text-center">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { ApiProduct } from "@/lib/api";
import { ProductCard } from "@/components/product-card";

export function ProductRail({
  products,
  locale,
}: {
  products: ApiProduct[];
  locale: string;
}) {
  return (
    <div className="product-rail">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}

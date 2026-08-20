import Link from "next/link";

type Collection = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
};

export function CollectionMarquee({
  collections,
  locale,
}: {
  collections: Collection[];
  locale: string;
}) {
  if (!collections.length) return null;
  const loop = [...collections, ...collections];

  return (
    <section className="overflow-hidden border-b border-black/10 py-5">
      <div className="collection-marquee-track items-center gap-10 px-5">
        {loop.map((collection, i) => (
          <Link
            key={`${collection.id}-${i}`}
            href={`/${locale}/shop?collection=${collection.slug}`}
            className="flex shrink-0 items-center gap-3 text-sm tracking-[0.18em] uppercase text-ink/55 transition hover:text-gold"
          >
            {collection.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collection.imageUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            )}
            {collection.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

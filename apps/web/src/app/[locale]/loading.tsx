export default function LocaleLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8">
      <div className="h-3 w-28 animate-pulse rounded-sm bg-ink/10" />
      <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded-sm bg-ink/10" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-sm bg-ink/8" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse bg-ink/8" />
            <div className="h-3 w-2/3 animate-pulse rounded-sm bg-ink/10" />
            <div className="h-3 w-1/3 animate-pulse rounded-sm bg-gold/25" />
          </div>
        ))}
      </div>
    </div>
  );
}

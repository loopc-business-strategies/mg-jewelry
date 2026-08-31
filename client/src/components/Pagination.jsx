export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const visible = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) visible.push(i);
    else if (visible[visible.length - 1] !== '...') visible.push('...');
  }

  return (
    <div className="flex justify-center gap-2 mt-10 flex-wrap">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-gold"
      >
        Prev
      </button>
      {visible.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="px-2 py-2 text-muted">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 rounded-lg text-sm ${page === p ? 'bg-gold text-white' : 'border hover:border-gold'}`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-gold"
      >
        Next
      </button>
    </div>
  );
}

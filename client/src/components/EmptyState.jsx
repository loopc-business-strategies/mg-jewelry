export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center text-xl">✨</div>
      <h3 className="type-card-title mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

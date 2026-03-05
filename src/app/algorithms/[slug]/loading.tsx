export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-[var(--border)] rounded w-48 mb-6" />

      {/* Hero skeleton */}
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-[var(--border)] rounded-full w-20" />
          <div className="h-5 bg-[var(--border)] rounded-full w-16" />
        </div>
        <div className="h-10 bg-[var(--border)] rounded w-3/4 mb-3" />
        <div className="h-4 bg-[var(--border)] rounded w-full mb-2" />
        <div className="h-4 bg-[var(--border)] rounded w-2/3" />
      </div>

      {/* Complexity skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-8 h-24" />

      {/* Visualizer skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-8 h-72" />

      {/* Code skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-8 h-64" />
    </div>
  );
}

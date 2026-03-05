import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-7xl mb-6">404</div>
      <h1 className="font-[var(--font-serif)] text-2xl font-semibold text-[var(--ink)] mb-2">
        Page not found
      </h1>
      <p className="text-[var(--ink-3)] text-sm mb-8 max-w-sm">
        The algorithm or page you&apos;re looking for doesn&apos;t exist. Maybe it was moved, or you mistyped the URL.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] transition-colors"
      >
        <BookOpen size={15} />
        Back to AlgoLab
      </Link>
    </div>
  );
}

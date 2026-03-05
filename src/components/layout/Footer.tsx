import Link from 'next/link';
import { BookOpen, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-warm)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--ink-3)]" />
            <span className="font-[var(--font-serif)] text-[var(--ink-2)] font-medium">AlgoLab</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ink-3)]">
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">Algorithms</Link>
            <Link href="/compare" className="hover:text-[var(--ink)] transition-colors">Compare</Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-[var(--ink-4)]">
            &copy; {new Date().getFullYear()} AlgoLab. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, BookOpen, BarChart2, GitCompare } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const NAV_LINKS = [
  { href: '/', label: 'Algorithms' },
  { href: '/compare', label: 'Compare' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[var(--ink)] hover:text-[var(--accent)] transition-colors shrink-0"
        >
          <BookOpen size={18} strokeWidth={2} />
          <span className="font-[var(--font-serif)] text-[1.05rem] tracking-tight">AlgoLab</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-md text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

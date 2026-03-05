'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { ALGORITHMS } from '@/data/algorithms';
import { CATEGORIES, getCategoryInfo } from '@/data/categories';
import type { Category } from '@/data/types';

// ─── Difficulty badge ────────────────────────────────────────────────────────

const DIFF_COLORS: Record<string, { text: string; bg: string }> = {
  beginner:     { text: '#059669', bg: '#d1fae5' },
  intermediate: { text: '#d97706', bg: '#fef3c7' },
  advanced:     { text: '#dc2626', bg: '#fee2e2' },
};

function DiffBadge({ difficulty }: { difficulty: string }) {
  const c = DIFF_COLORS[difficulty] ?? { text: '#6b7280', bg: '#f3f4f6' };
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
      style={{ color: c.text, background: c.bg }}
    >
      {difficulty}
    </span>
  );
}

// ─── Algorithm card ──────────────────────────────────────────────────────────

function AlgorithmCard({ algo }: { algo: (typeof ALGORITHMS)[number] }) {
  const cat = getCategoryInfo(algo.category);
  return (
    <Link
      href={`/algorithms/${algo.slug}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--accent)] hover:shadow-md transition-all duration-150"
    >
      {/* Category chip */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ color: cat.color, background: cat.bgColor }}
        >
          {cat.name}
        </span>
        <DiffBadge difficulty={algo.difficulty} />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-[var(--ink)] text-sm leading-snug mb-1.5 group-hover:text-[var(--accent)] transition-colors">
        {algo.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-[var(--ink-3)] leading-relaxed line-clamp-2 mb-3">
        {algo.description}
      </p>

      {/* Complexity row */}
      <div className="flex items-center gap-3 text-[10px] text-[var(--ink-4)] font-mono">
        <span>avg {algo.complexity.time.average}</span>
        <span className="text-[var(--border)]">|</span>
        <span>space {algo.complexity.space}</span>
      </div>
    </Link>
  );
}

// ─── Category filter pill ────────────────────────────────────────────────────

function CategoryPill({
  cat,
  active,
  count,
  onClick,
}: {
  cat: (typeof CATEGORIES)[number];
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? 'border-transparent text-white shadow-sm'
          : 'border-[var(--border)] text-[var(--ink-2)] hover:border-[var(--ink-3)] bg-[var(--surface)]'
      }`}
      style={active ? { background: cat.color } : undefined}
    >
      <span>{cat.icon}</span>
      <span>{cat.name}</span>
      <span
        className={`text-[10px] px-1 py-0.5 rounded-full ${active ? 'bg-white/25 text-white' : 'bg-[var(--bg-warm)] text-[var(--ink-3)]'}`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Main home content ───────────────────────────────────────────────────────

export function HomeContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALGORITHMS.filter(a => {
      const matchesCat = activeCategory ? a.category === activeCategory : true;
      const matchesQ = q
        ? a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [query, activeCategory]);

  const countByCategory = useMemo(() => {
    const q = query.toLowerCase().trim();
    const baseAlgos = q
      ? ALGORITHMS.filter(
          a =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tags.some(t => t.toLowerCase().includes(q))
        )
      : ALGORITHMS;
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) counts[cat.id] = 0;
    for (const a of baseAlgos) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return counts;
  }, [query]);

  const handleCategoryClick = useCallback((id: Category) => {
    setActiveCategory(prev => (prev === id ? null : id));
  }, []);

  // Group filtered results by category
  const grouped = useMemo(() => {
    const map = new Map<Category, typeof ALGORITHMS>();
    for (const cat of CATEGORIES) map.set(cat.id, []);
    for (const a of filtered) map.get(a.category)!.push(a);
    return map;
  }, [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-[var(--font-serif)] text-4xl sm:text-5xl font-semibold text-[var(--ink)] leading-tight mb-4">
          Learn Every Algorithm,{' '}
          <em className="text-[var(--accent)] not-italic">Visually</em>
        </h1>
        <p className="text-[var(--ink-2)] text-lg max-w-xl mx-auto mb-8">
          Interactive visualizations, complexity analysis, and clean code for 55+ algorithms across 9 categories.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-4)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search algorithms, tags…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink)]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => (
          <CategoryPill
            key={cat.id}
            cat={cat}
            active={activeCategory === cat.id}
            count={countByCategory[cat.id] ?? 0}
            onClick={() => handleCategoryClick(cat.id)}
          />
        ))}
      </div>

      {/* Results summary */}
      {(query || activeCategory) && (
        <p className="text-sm text-[var(--ink-3)] mb-6">
          {filtered.length} algorithm{filtered.length !== 1 ? 's' : ''} found
          {query && <> matching &ldquo;{query}&rdquo;</>}
          {activeCategory && (
            <> in {getCategoryInfo(activeCategory).name}</>
          )}
        </p>
      )}

      {/* Algorithm grid grouped by category */}
      {CATEGORIES.filter(cat => (grouped.get(cat.id)?.length ?? 0) > 0).map(cat => {
        const algos = grouped.get(cat.id)!;
        return (
          <section key={cat.id} className="mb-10">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="font-semibold text-[var(--ink)] text-base">{cat.name}</h2>
              <span className="text-xs text-[var(--ink-4)] bg-[var(--bg-warm)] px-2 py-0.5 rounded-full">
                {algos.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {algos.map(algo => (
                <AlgorithmCard key={algo.slug} algo={algo} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--ink-3)]">
          <p className="text-4xl mb-3">&#x1F50D;</p>
          <p className="font-medium text-[var(--ink-2)] mb-1">No algorithms found</p>
          <p className="text-sm">Try a different search term or clear the filter.</p>
        </div>
      )}
    </div>
  );
}

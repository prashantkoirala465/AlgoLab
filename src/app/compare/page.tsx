'use client';

import { useState, useMemo } from 'react';
import { ALGORITHMS } from '@/data/algorithms';
import { CATEGORIES, getCategoryInfo } from '@/data/categories';
import type { Category } from '@/data/types';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = 'name' | 'category' | 'difficulty' | 'best' | 'average' | 'worst' | 'space';
type SortDir = 'asc' | 'desc';

// ─── Big-O rank for sorting ───────────────────────────────────────────────────

const COMPLEXITY_RANK: Record<string, number> = {
  'O(1)': 0, 'O(log n)': 1, 'O(n)': 2, 'O(n log n)': 3,
  'O(n + k)': 3, 'O(nk)': 4, 'O(n log² n)': 4,
  'O(n²)': 5, 'O(n³)': 6, 'O(nm)': 6,
  'O(2^n)': 7, 'O(n!)': 8,
};
const DIFF_RANK: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

function rankComplexity(s: string): number {
  // Try exact match first, then partial
  if (COMPLEXITY_RANK[s] !== undefined) return COMPLEXITY_RANK[s];
  for (const [key, val] of Object.entries(COMPLEXITY_RANK)) {
    if (s.includes(key.replace('O(', '').replace(')', ''))) return val;
  }
  return 99;
}

// ─── Complexity pill ─────────────────────────────────────────────────────────

function ComplexityPill({ value }: { value: string }) {
  const rank = rankComplexity(value);
  const colors =
    rank <= 1 ? { bg: '#d1fae5', text: '#065f46' } :
    rank <= 2 ? { bg: '#dbeafe', text: '#1e40af' } :
    rank <= 3 ? { bg: '#fef3c7', text: '#92400e' } :
    rank <= 5 ? { bg: '#fee2e2', text: '#991b1b' } :
               { bg: '#f3e8ff', text: '#6b21a8' };
  return (
    <span
      className="text-xs font-[var(--font-mono)] px-2 py-0.5 rounded-full font-medium"
      style={{ background: colors.bg, color: colors.text }}
    >
      {value}
    </span>
  );
}

// ─── Sort header cell ─────────────────────────────────────────────────────────

function SortHeader({
  label, sortKey, current, dir, onSort
}: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void }) {
  const active = current === sortKey;
  return (
    <th
      className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)] cursor-pointer hover:text-[var(--ink)] select-none whitespace-nowrap"
      onClick={() => onSort(sortKey)}
    >
      <span className="flex items-center gap-1">
        {label}
        {active ? (dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />) : <ArrowUpDown size={11} className="opacity-30" />}
      </span>
    </th>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [sortKey, setSortKey] = useState<SortKey>('category');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    let rows = [...ALGORITHMS];
    if (filterCategory !== 'all') rows = rows.filter(a => a.category === filterCategory);
    if (filterDifficulty !== 'all') rows = rows.filter(a => a.difficulty === filterDifficulty);

    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':       cmp = a.name.localeCompare(b.name); break;
        case 'category':   cmp = a.category.localeCompare(b.category); break;
        case 'difficulty': cmp = DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]; break;
        case 'best':       cmp = rankComplexity(a.complexity.time.best) - rankComplexity(b.complexity.time.best); break;
        case 'average':    cmp = rankComplexity(a.complexity.time.average) - rankComplexity(b.complexity.time.average); break;
        case 'worst':      cmp = rankComplexity(a.complexity.time.worst) - rankComplexity(b.complexity.time.worst); break;
        case 'space':      cmp = rankComplexity(a.complexity.space) - rankComplexity(b.complexity.space); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [sortKey, sortDir, filterCategory, filterDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-[var(--font-serif)] text-3xl font-semibold text-[var(--ink)] mb-2">Compare Algorithms</h1>
        <p className="text-[var(--ink-3)] text-sm">Sort and filter all {ALGORITHMS.length} algorithms by complexity. Click column headers to sort.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as Category | 'all')}
          className="text-xs border border-[var(--border)] rounded-lg px-2.5 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          className="text-xs border border-[var(--border)] rounded-lg px-2.5 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
        >
          <option value="all">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <span className="text-xs text-[var(--ink-4)] self-center ml-auto">{sorted.length} algorithms</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-warm)]">
              <SortHeader label="Algorithm" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Category"  sortKey="category" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Difficulty" sortKey="difficulty" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Best" sortKey="best" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Average" sortKey="average" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Worst" sortKey="worst" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Space" sortKey="space" current={sortKey} dir={sortDir} onSort={handleSort} />
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Stable</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((algo, i) => {
              const cat = getCategoryInfo(algo.category);
              const diffColors: Record<string, { text: string; bg: string }> = {
                beginner:     { text: '#059669', bg: '#d1fae5' },
                intermediate: { text: '#d97706', bg: '#fef3c7' },
                advanced:     { text: '#dc2626', bg: '#fee2e2' },
              };
              const dc = diffColors[algo.difficulty] ?? { text: '#6b7280', bg: '#f3f4f6' };
              return (
                <tr
                  key={algo.slug}
                  className={`border-b border-[var(--border-light)] hover:bg-[var(--bg-warm)] transition-colors ${i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--bg)]'}`}
                >
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/algorithms/${algo.slug}`}
                      className="font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
                    >
                      {algo.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: cat.color, background: cat.bgColor }}
                    >
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: dc.text, background: dc.bg }}
                    >
                      {algo.difficulty}
                    </span>
                  </td>
                  <td className="px-3 py-2.5"><ComplexityPill value={algo.complexity.time.best} /></td>
                  <td className="px-3 py-2.5"><ComplexityPill value={algo.complexity.time.average} /></td>
                  <td className="px-3 py-2.5"><ComplexityPill value={algo.complexity.time.worst} /></td>
                  <td className="px-3 py-2.5"><ComplexityPill value={algo.complexity.space} /></td>
                  <td className="px-3 py-2.5 text-xs text-[var(--ink-3)]">
                    {algo.complexity.stable === undefined ? '—' : algo.complexity.stable ? 'Yes' : 'No'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

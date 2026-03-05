import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALGORITHMS, getAlgorithm, getRelatedAlgorithms } from '@/data/algorithms';
import { getCategoryInfo } from '@/data/categories';
import { createHighlighter } from 'shiki';
import { CodeTabs } from '@/components/ui/CodeTabs';
import type { AlgorithmCode, Algorithm } from '@/data/types';
import Link from 'next/link';
import { ChevronRight, Clock, Database, ArrowLeft } from 'lucide-react';

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return ALGORITHMS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const algo = getAlgorithm(slug);
  if (!algo) return {};
  return {
    title: algo.name,
    description: algo.longDescription,
  };
}

// ─── Shiki singleton ─────────────────────────────────────────────────────────

let _highlighterPromise: ReturnType<typeof createHighlighter> | null = null;
function getHighlighter() {
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['cpp', 'javascript', 'python'],
    });
  }
  return _highlighterPromise;
}

// ─── Complexity cell ─────────────────────────────────────────────────────────

function ComplexityCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 min-w-0 px-4 py-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-[var(--ink-4)] mb-1">{label}</div>
      <div
        className="font-[var(--font-mono)] text-sm font-medium"
        style={accent ? { color: 'var(--accent)' } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AlgorithmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algo = getAlgorithm(slug);
  if (!algo) notFound();

  const cat = getCategoryInfo(algo.category);
  const related = getRelatedAlgorithms(algo.slug);

  // Pre-render all three code panels
  const hl = await getHighlighter();
  const renderedCode: Record<keyof AlgorithmCode, string> = {
    cpp: hl.codeToHtml(algo.code.cpp, { lang: 'cpp', theme: 'github-light' }),
    js:  hl.codeToHtml(algo.code.js,  { lang: 'javascript', theme: 'github-light' }),
    python: hl.codeToHtml(algo.code.python, { lang: 'python', theme: 'github-light' }),
  };

  const diffColors: Record<string, { text: string; bg: string }> = {
    beginner:     { text: '#059669', bg: '#d1fae5' },
    intermediate: { text: '#d97706', bg: '#fef3c7' },
    advanced:     { text: '#dc2626', bg: '#fee2e2' },
  };
  const dc = diffColors[algo.difficulty] ?? { text: '#6b7280', bg: '#f3f4f6' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--ink-3)] mb-6">
        <Link href="/" className="hover:text-[var(--ink)] transition-colors">Algorithms</Link>
        <ChevronRight size={13} />
        <Link href={`/?category=${algo.category}`} style={{ color: cat.color }} className="hover:opacity-80 transition-opacity">{cat.name}</Link>
        <ChevronRight size={13} />
        <span className="text-[var(--ink)]">{algo.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: cat.color, background: cat.bgColor }}
          >
            {cat.name}
          </span>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: dc.text, background: dc.bg }}
          >
            {algo.difficulty}
          </span>
          {algo.tags.map(tag => (
            <span key={tag} className="text-[11px] text-[var(--ink-4)] bg-[var(--bg-warm)] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-[var(--font-serif)] text-3xl sm:text-4xl font-semibold text-[var(--ink)] mb-3">
          {algo.name}
        </h1>
        <p className="text-[var(--ink-2)] text-base leading-relaxed max-w-2xl">
          {algo.longDescription}
        </p>
      </div>

      {/* Complexity table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-8 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-warm)]">
          <h2 className="text-sm font-semibold text-[var(--ink)]">Complexity</h2>
        </div>
        <div className="flex divide-x divide-[var(--border)] flex-wrap">
          <ComplexityCell label="Best" value={algo.complexity.time.best} />
          <ComplexityCell label="Average" value={algo.complexity.time.average} accent />
          <ComplexityCell label="Worst" value={algo.complexity.time.worst} />
          <ComplexityCell label="Space" value={algo.complexity.space} />
          {algo.complexity.stable !== undefined && (
            <ComplexityCell label="Stable" value={algo.complexity.stable ? 'Yes' : 'No'} />
          )}
          {algo.complexity.inPlace !== undefined && (
            <ComplexityCell label="In-Place" value={algo.complexity.inPlace ? 'Yes' : 'No'} />
          )}
        </div>
      </div>

      {/* Code */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-3">Implementation</h2>
        <CodeTabs code={algo.code} renderedCode={renderedCode} />
      </div>

      {/* Chapters */}
      {algo.chapters.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">How It Works</h2>
          <div className="space-y-4">
            {algo.chapters.map((chapter, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="font-semibold text-[var(--ink)] text-sm mb-2">
                  <span className="text-[var(--ink-4)] font-normal mr-2">{i + 1}.</span>
                  {chapter.title}
                </h3>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed">{chapter.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related algorithms */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Related Algorithms</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((rel: Algorithm) => {
              const relCat = getCategoryInfo(rel.category);
              return (
                <Link
                  key={rel.slug}
                  href={`/algorithms/${rel.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--accent)] hover:shadow-sm transition-all group"
                >
                  <span className="text-xs" style={{ color: relCat.color }}>{relCat.icon}</span>
                  <span className="font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{rel.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to all algorithms
      </Link>
    </div>
  );
}

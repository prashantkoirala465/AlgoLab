'use client';

import dynamic from 'next/dynamic';
import type { VisualizerType } from '@/data/types';
import type { SortAlgorithmId } from '@/lib/sortAlgorithms';

const SortVisualizer = dynamic(() =>
  import('./SortVisualizer').then(m => ({ default: m.SortVisualizer })),
  { ssr: false, loading: () => <VisualizerSkeleton /> }
);

function VisualizerSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] h-72 animate-pulse" />
  );
}

const SLUG_TO_SORT_ID: Record<string, SortAlgorithmId> = {
  'bubble-sort': 'bubble',
  'selection-sort': 'selection',
  'insertion-sort': 'insertion',
  'merge-sort': 'merge',
  'quick-sort': 'quick',
  'heap-sort': 'heap',
  'tim-sort': 'bubble', // fallback — Tim Sort is complex; use bubble as demo
  'counting-sort': 'bubble',
  'radix-sort': 'bubble',
  'shell-sort': 'insertion',
};

interface VisualizerPanelProps {
  visualizerType: VisualizerType;
  slug: string;
}

export function VisualizerPanel({ visualizerType, slug }: VisualizerPanelProps) {
  if (visualizerType === 'none') return null;

  if (visualizerType === 'sort') {
    const algoId = SLUG_TO_SORT_ID[slug] ?? 'bubble';
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-3">Visualizer</h2>
        <SortVisualizer initialAlgorithm={algoId} />
      </div>
    );
  }

  // Placeholder for other visualizer types
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-[var(--ink)] mb-3">Visualizer</h2>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-warm)] p-8 text-center text-[var(--ink-3)]">
        <p className="text-sm">Visualizer for <strong className="text-[var(--ink)]">{visualizerType}</strong> coming soon.</p>
      </div>
    </div>
  );
}

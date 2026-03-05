'use client';

import dynamic from 'next/dynamic';
import type { VisualizerType } from '@/data/types';
import type { SortAlgorithmId } from '@/lib/sortAlgorithms';

const SortVisualizer = dynamic(() =>
  import('./SortVisualizer').then(m => ({ default: m.SortVisualizer })),
  { ssr: false, loading: () => <VisualizerSkeleton /> }
);

const SearchVisualizer = dynamic(() =>
  import('./SearchVisualizer').then(m => ({ default: m.SearchVisualizer })),
  { ssr: false, loading: () => <VisualizerSkeleton /> }
);

const TreeVisualizer = dynamic(() =>
  import('./TreeVisualizer').then(m => ({ default: m.TreeVisualizer })),
  { ssr: false, loading: () => <VisualizerSkeleton /> }
);

const GraphVisualizer = dynamic(() =>
  import('./GraphVisualizer').then(m => ({ default: m.GraphVisualizer })),
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
  'tim-sort': 'bubble',
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

  const title = (
    <h2 className="text-lg font-semibold text-[var(--ink)] mb-3">Visualizer</h2>
  );

  if (visualizerType === 'sort') {
    const algoId = SLUG_TO_SORT_ID[slug] ?? 'bubble';
    return (
      <div className="mb-8">
        {title}
        <SortVisualizer initialAlgorithm={algoId} />
      </div>
    );
  }

  if (visualizerType === 'search') {
    return (
      <div className="mb-8">
        {title}
        <SearchVisualizer />
      </div>
    );
  }

  if (visualizerType === 'tree') {
    return (
      <div className="mb-8">
        {title}
        <TreeVisualizer />
      </div>
    );
  }

  if (visualizerType === 'graph') {
    return (
      <div className="mb-8">
        {title}
        <GraphVisualizer />
      </div>
    );
  }

  // Placeholder for remaining visualizer types
  return (
    <div className="mb-8">
      {title}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-warm)] p-8 text-center text-[var(--ink-3)]">
        <p className="text-sm">Visualizer for <strong className="text-[var(--ink)]">{visualizerType}</strong> coming soon.</p>
      </div>
    </div>
  );
}

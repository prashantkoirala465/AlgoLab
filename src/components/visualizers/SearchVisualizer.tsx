'use client';

import { useState, useCallback } from 'react';
import { Search, RefreshCw, RotateCcw } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type CellState = 'default' | 'current' | 'found' | 'eliminated' | 'low' | 'high' | 'mid';

interface SearchStep {
  states: CellState[];
  description: string;
  found: boolean;
  foundIndex: number;
}

// ─── Generators ──────────────────────────────────────────────────────────────

function linearSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = arr.length;
  const states: CellState[] = new Array(n).fill('default');
  for (let i = 0; i < n; i++) {
    const s = states.map((v, idx) => (idx === i ? 'current' : v)) as CellState[];
    steps.push({ states: [...s], description: `Check a[${i}]=${arr[i]} vs target ${target}`, found: false, foundIndex: -1 });
    if (arr[i] === target) {
      s[i] = 'found';
      steps.push({ states: [...s], description: `Found ${target} at index ${i}!`, found: true, foundIndex: i });
      return steps;
    }
    states[i] = 'eliminated';
  }
  steps.push({ states: [...states], description: `${target} not found`, found: false, foundIndex: -1 });
  return steps;
}

function binarySearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  let lo = 0, hi = n - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const states: CellState[] = new Array(n).fill('eliminated');
    for (let i = lo; i <= hi; i++) states[i] = 'default';
    states[lo] = 'low'; states[hi] = 'high'; states[mid] = 'mid';
    steps.push({ states: [...states], description: `lo=${lo} hi=${hi} mid=${mid} → a[mid]=${sorted[mid]}`, found: false, foundIndex: -1 });
    if (sorted[mid] === target) {
      states[mid] = 'found';
      steps.push({ states: [...states], description: `Found ${target} at index ${mid}!`, found: true, foundIndex: mid });
      return steps;
    }
    if (sorted[mid] < target) {
      steps.push({ states: [...states], description: `${sorted[mid]} < ${target}, search right half`, found: false, foundIndex: -1 });
      lo = mid + 1;
    } else {
      steps.push({ states: [...states], description: `${sorted[mid]} > ${target}, search left half`, found: false, foundIndex: -1 });
      hi = mid - 1;
    }
  }
  const finalStates: CellState[] = new Array(n).fill('eliminated');
  steps.push({ states: finalStates, description: `${target} not found`, found: false, foundIndex: -1 });
  return steps;
}

// ─── Color map ───────────────────────────────────────────────────────────────

const CELL_COLORS: Record<CellState, { bg: string; text: string; border: string }> = {
  default:    { bg: 'var(--surface)',   text: 'var(--ink)',    border: 'var(--border)' },
  current:    { bg: 'var(--amber-bg)',  text: 'var(--amber)',  border: 'var(--amber)' },
  found:      { bg: 'var(--emerald-bg)',text: 'var(--emerald)',border: 'var(--emerald)' },
  eliminated: { bg: 'var(--bg-warm)',   text: 'var(--ink-4)',  border: 'var(--border-light)' },
  low:        { bg: 'var(--accent-bg)', text: 'var(--accent)', border: 'var(--accent)' },
  high:       { bg: 'var(--rose-bg)',   text: 'var(--rose)',   border: 'var(--rose)' },
  mid:        { bg: 'var(--violet-bg)', text: 'var(--violet)', border: 'var(--violet)' },
};

type SearchAlgorithmId = 'linear' | 'binary';

const ALGORITHMS: Record<SearchAlgorithmId, { label: string; gen: (arr: number[], target: number) => SearchStep[] }> = {
  linear: { label: 'Linear Search', gen: linearSearchSteps },
  binary: { label: 'Binary Search', gen: binarySearchSteps },
};

// ─── Component ───────────────────────────────────────────────────────────────

function randomSortedArray(n: number): number[] {
  const arr: number[] = [];
  let v = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < n; i++) {
    arr.push(v);
    v += Math.floor(Math.random() * 15) + 1;
  }
  return arr;
}

export function SearchVisualizer() {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithmId>('linear');
  const [arr] = useState<number[]>(() => randomSortedArray(16));
  const [target, setTarget] = useState<string>('');
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [hasRun, setHasRun] = useState(false);

  const baseStates: CellState[] = new Array(arr.length).fill('default');
  const current = stepIdx >= 0 && steps.length > 0 ? steps[Math.min(stepIdx, steps.length - 1)] : null;

  const run = useCallback(() => {
    const t = Number(target);
    if (isNaN(t)) return;
    const a = algorithm === 'binary' ? [...arr].sort((a, b) => a - b) : arr;
    const s = ALGORITHMS[algorithm].gen(a, t);
    setSteps(s);
    setStepIdx(0);
    setHasRun(true);
  }, [arr, target, algorithm]);

  const handleNext = () => setStepIdx(p => Math.min(p + 1, steps.length - 1));
  const handlePrev = () => setStepIdx(p => Math.max(p - 1, 0));
  const handleReset = () => { setStepIdx(-1); setHasRun(false); };

  const displayArr = algorithm === 'binary' ? [...arr].sort((a, b) => a - b) : arr;
  const displayStates = current ? current.states : baseStates;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        <select
          value={algorithm}
          onChange={e => { setAlgorithm(e.target.value as SearchAlgorithmId); handleReset(); }}
          className="text-xs border border-[var(--border)] rounded-lg px-2.5 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
        >
          {(Object.keys(ALGORITHMS) as SearchAlgorithmId[]).map(id => (
            <option key={id} value={id}>{ALGORITHMS[id].label}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-3)]">Target:</span>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            placeholder="value"
            className="w-20 text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          />
        </div>

        <button
          onClick={run}
          disabled={!target}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-40"
        >
          <Search size={12} />
          Search
        </button>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)] transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Array display */}
      <div className="px-6 py-8 bg-[var(--bg)]">
        {algorithm === 'binary' && (
          <p className="text-xs text-[var(--ink-4)] mb-3 text-center">Array is sorted for binary search</p>
        )}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {displayArr.map((val, i) => {
            const state = displayStates[i] ?? 'default';
            const c = CELL_COLORS[state];
            return (
              <div
                key={i}
                className="w-10 h-10 flex flex-col items-center justify-center rounded-lg border text-xs font-[var(--font-mono)] font-medium transition-all duration-150"
                style={{ background: c.bg, color: c.text, borderColor: c.border }}
              >
                <span>{val}</span>
                <span className="text-[9px] opacity-50">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step navigation */}
      {hasRun && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between gap-4 bg-[var(--bg-warm)]">
          <p className="text-xs text-[var(--ink-2)] flex-1 truncate">
            {current?.description ?? '—'}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={stepIdx <= 0}
              className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-[10px] text-[var(--ink-4)] font-mono">{stepIdx + 1}/{steps.length}</span>
            <button
              onClick={handleNext}
              disabled={stepIdx >= steps.length - 1}
              className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 bg-[var(--surface)]">
        {([
          ['current', 'Checking'],
          ['mid', 'Mid'],
          ['low', 'Low'],
          ['high', 'High'],
          ['found', 'Found'],
          ['eliminated', 'Eliminated'],
        ] as [CellState, string][]).map(([state, label]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CELL_COLORS[state].bg, border: `1px solid ${CELL_COLORS[state].border}` }} />
            <span className="text-[10px] text-[var(--ink-3)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

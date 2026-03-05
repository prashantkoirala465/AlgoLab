'use client';

import { useState, useCallback } from 'react';
import { Play, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DPAlgorithm = 'fibonacci' | 'lcs' | 'knapsack';

interface DPStep {
  description: string;
  // For fib: 1D array highlight
  fib?: { table: number[]; activeIdx: number };
  // For LCS: 2D table highlight
  lcs?: { table: number[][]; row: number; col: number; seq: string };
  // For knapsack: 2D table highlight
  knapsack?: { table: number[][]; row: number; col: number };
}

// ─── Fibonacci DP ─────────────────────────────────────────────────────────────

function fibSteps(n: number): DPStep[] {
  const steps: DPStep[] = [];
  const table = new Array(n + 1).fill(0);
  table[0] = 0;
  if (n >= 1) table[1] = 1;

  steps.push({ description: `Initialize dp[0]=0, dp[1]=1`, fib: { table: [...table], activeIdx: -1 } });

  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2];
    steps.push({
      description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${table[i-1]} + ${table[i-2]} = ${table[i]}`,
      fib: { table: [...table], activeIdx: i },
    });
  }

  steps.push({
    description: `Done. fib(${n}) = ${table[n]}`,
    fib: { table: [...table], activeIdx: -1 },
  });
  return steps;
}

// ─── LCS ──────────────────────────────────────────────────────────────────────

function lcsSteps(a: string, b: string): DPStep[] {
  const steps: DPStep[] = [];
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  steps.push({
    description: `Initialize ${m+1}×${n+1} DP table with zeros`,
    lcs: { table: dp.map(r => [...r]), row: -1, col: -1, seq: '' },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        steps.push({
          description: `a[${i-1}]='${a[i-1]}' == b[${j-1}]='${b[j-1]}' → dp[${i}][${j}] = dp[${i-1}][${j-1}]+1 = ${dp[i][j]}`,
          lcs: { table: dp.map(r => [...r]), row: i, col: j, seq: '' },
        });
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        steps.push({
          description: `a[${i-1}]='${a[i-1]}' ≠ b[${j-1}]='${b[j-1]}' → dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
          lcs: { table: dp.map(r => [...r]), row: i, col: j, seq: '' },
        });
      }
    }
  }

  // Backtrack
  let seq = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i-1] === b[j-1]) { seq = a[i-1] + seq; i--; j--; }
    else if (dp[i-1][j] > dp[i][j-1]) i--;
    else j--;
  }

  steps.push({
    description: `LCS length = ${dp[m][n]}. LCS = "${seq}"`,
    lcs: { table: dp.map(r => [...r]), row: -1, col: -1, seq },
  });
  return steps;
}

// ─── 0/1 Knapsack ─────────────────────────────────────────────────────────────

const KNAPSACK_ITEMS = [
  { name: 'A', weight: 2, value: 3 },
  { name: 'B', weight: 3, value: 4 },
  { name: 'C', weight: 4, value: 5 },
  { name: 'D', weight: 5, value: 6 },
];
const KNAPSACK_CAPACITY = 8;

function knapsackSteps(): DPStep[] {
  const steps: DPStep[] = [];
  const items = KNAPSACK_ITEMS;
  const W = KNAPSACK_CAPACITY;
  const n = items.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  steps.push({
    description: `Initialize ${n+1}×${W+1} DP table. Items: ${items.map(it => `${it.name}(w=${it.weight},v=${it.value})`).join(', ')}`,
    knapsack: { table: dp.map(r => [...r]), row: -1, col: -1 },
  });

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= W; w++) {
      if (item.weight > w) {
        dp[i][w] = dp[i-1][w];
        steps.push({
          description: `Item ${item.name} (w=${item.weight}) > cap ${w}: dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`,
          knapsack: { table: dp.map(r => [...r]), row: i, col: w },
        });
      } else {
        const skip = dp[i-1][w];
        const take = dp[i-1][w - item.weight] + item.value;
        dp[i][w] = Math.max(skip, take);
        steps.push({
          description: `Item ${item.name}: skip=${skip}, take=${take} → dp[${i}][${w}] = ${dp[i][w]}`,
          knapsack: { table: dp.map(r => [...r]), row: i, col: w },
        });
      }
    }
  }

  steps.push({
    description: `Max value = ${dp[n][W]} with capacity ${W}`,
    knapsack: { table: dp.map(r => [...r]), row: -1, col: -1 },
  });
  return steps;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CELL_SIZE = 32;
const MAX_FIB_N = 10;
const LCS_A = 'ABCBDAB';
const LCS_B = 'BDCABA';

export function DPVisualizer() {
  const [algorithm, setAlgorithm] = useState<DPAlgorithm>('fibonacci');
  const [steps, setSteps] = useState<DPStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [fibN, setFibN] = useState(8);

  const current: DPStep | null = stepIdx >= 0 && steps.length > 0
    ? steps[Math.min(stepIdx, steps.length - 1)]
    : null;

  const run = useCallback(() => {
    let s: DPStep[] = [];
    if (algorithm === 'fibonacci') s = fibSteps(fibN);
    else if (algorithm === 'lcs') s = lcsSteps(LCS_A, LCS_B);
    else if (algorithm === 'knapsack') s = knapsackSteps();
    setSteps(s);
    setStepIdx(0);
  }, [algorithm, fibN]);

  const reset = () => { setSteps([]); setStepIdx(-1); };

  // ── Fibonacci rendering ─────────────────────────────────────────────────────
  const renderFib = () => {
    if (!current?.fib) return null;
    const { table, activeIdx } = current.fib;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 flex-wrap">
          {table.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-md border text-xs font-mono font-bold transition-all duration-200"
                style={{
                  background: i === activeIdx ? 'var(--violet-bg)' : i < activeIdx ? 'var(--emerald-bg)' : 'var(--surface)',
                  borderColor: i === activeIdx ? 'var(--violet)' : i < activeIdx ? 'var(--emerald)' : 'var(--border)',
                  color: i === activeIdx ? 'var(--violet)' : i < activeIdx ? 'var(--emerald)' : 'var(--ink-3)',
                }}
              >
                {val}
              </div>
              <span className="text-[9px] text-[var(--ink-4)] font-mono">{i}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--ink-3)] font-mono">dp[i] = dp[i-1] + dp[i-2]</p>
      </div>
    );
  };

  // ── LCS rendering ──────────────────────────────────────────────────────────
  const renderLCS = () => {
    if (!current?.lcs) return null;
    const { table, row, col } = current.lcs;
    const a = LCS_A, b = LCS_B;
    return (
      <div className="overflow-auto">
        <table className="border-collapse text-xs font-mono">
          <thead>
            <tr>
              <td className="w-8 h-8" />
              <td className="w-8 h-8 text-center text-[var(--ink-4)]">ε</td>
              {b.split('').map((c, j) => (
                <td key={j} className="w-8 h-8 text-center font-bold text-[var(--ink-2)]">{c}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((tableRow, i) => (
              <tr key={i}>
                <td className="w-8 h-8 text-center font-bold text-[var(--ink-2)]">
                  {i === 0 ? 'ε' : a[i - 1]}
                </td>
                {tableRow.map((cell, j) => (
                  <td
                    key={j}
                    className="w-8 h-8 text-center border transition-all duration-150"
                    style={{
                      background: i === row && j === col ? 'var(--violet-bg)' : cell > 0 ? 'var(--emerald-bg)' : 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: i === row && j === col ? 'var(--violet)' : cell > 0 ? 'var(--emerald)' : 'var(--ink-3)',
                      fontWeight: i === row && j === col ? 700 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {current.lcs.seq && (
          <p className="mt-2 text-xs text-[var(--ink-2)]">LCS: <strong className="font-mono text-[var(--accent)]">{current.lcs.seq}</strong></p>
        )}
      </div>
    );
  };

  // ── Knapsack rendering ─────────────────────────────────────────────────────
  const renderKnapsack = () => {
    if (!current?.knapsack) return null;
    const { table, row, col } = current.knapsack;
    const items = KNAPSACK_ITEMS;
    const W = KNAPSACK_CAPACITY;
    return (
      <div className="overflow-auto">
        <table className="border-collapse text-xs font-mono">
          <thead>
            <tr>
              <td className="w-16 h-8 text-[10px] text-[var(--ink-4)] text-right pr-1">Cap →</td>
              {Array.from({ length: W + 1 }, (_, w) => (
                <td key={w} className="w-8 h-8 text-center font-bold text-[var(--ink-2)]">{w}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((tableRow, i) => (
              <tr key={i}>
                <td className="w-16 h-8 text-right pr-1 text-[10px] text-[var(--ink-2)]">
                  {i === 0 ? '∅' : `${items[i-1].name}(w${items[i-1].weight}v${items[i-1].value})`}
                </td>
                {tableRow.map((cell, j) => (
                  <td
                    key={j}
                    className="w-8 h-8 text-center border transition-all duration-150"
                    style={{
                      background: i === row && j === col ? 'var(--violet-bg)' : cell > 0 ? 'var(--amber-bg)' : 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: i === row && j === col ? 'var(--violet)' : cell > 0 ? 'var(--amber)' : 'var(--ink-3)',
                      fontWeight: i === row && j === col ? 700 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {(['fibonacci', 'lcs', 'knapsack'] as DPAlgorithm[]).map(alg => (
            <button
              key={alg}
              onClick={() => { setAlgorithm(alg); reset(); }}
              className={`text-xs px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
                algorithm === alg ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-3)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {alg === 'lcs' ? 'LCS' : alg === 'knapsack' ? '0/1 Knapsack' : 'Fibonacci'}
            </button>
          ))}
        </div>

        {algorithm === 'fibonacci' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ink-3)]">n =</span>
            <input
              type="number"
              min={2} max={MAX_FIB_N}
              value={fibN}
              onChange={e => { setFibN(Math.min(MAX_FIB_N, Math.max(2, Number(e.target.value)))); reset(); }}
              className="w-14 text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
            />
          </div>
        )}

        <button
          onClick={run}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors"
        >
          <Play size={11} /> Run
        </button>
        <button onClick={reset} className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)]">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Algorithm info */}
      {algorithm === 'lcs' && steps.length === 0 && (
        <div className="px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
          <p className="text-xs text-[var(--ink-3)]">Strings: <strong className="font-mono text-[var(--ink)]">{LCS_A}</strong> and <strong className="font-mono text-[var(--ink)]">{LCS_B}</strong></p>
        </div>
      )}
      {algorithm === 'knapsack' && steps.length === 0 && (
        <div className="px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
          <p className="text-xs text-[var(--ink-3)]">
            Capacity: <strong className="font-mono text-[var(--ink)]">{KNAPSACK_CAPACITY}</strong> &nbsp;|&nbsp;
            Items: {KNAPSACK_ITEMS.map(it => <span key={it.name} className="font-mono text-[var(--ink)] mr-2">{it.name}(w={it.weight},v={it.value})</span>)}
          </p>
        </div>
      )}

      {/* DP table / chart */}
      <div className="bg-[var(--bg)] px-4 py-5 min-h-[120px]">
        {!current ? (
          <p className="text-sm text-[var(--ink-4)] italic">Press Run to start the visualization.</p>
        ) : (
          <>
            {algorithm === 'fibonacci' && renderFib()}
            {algorithm === 'lcs' && renderLCS()}
            {algorithm === 'knapsack' && renderKnapsack()}
          </>
        )}
      </div>

      {/* Step nav */}
      {steps.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between gap-4 bg-[var(--bg-warm)]">
          <p className="text-xs text-[var(--ink-2)] flex-1">{current?.description ?? '—'}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setStepIdx(p => Math.max(p-1,0))} disabled={stepIdx<=0} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">← Prev</button>
            <span className="text-[10px] text-[var(--ink-4)] font-mono">{stepIdx+1}/{steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(p+1, steps.length-1))} disabled={stepIdx>=steps.length-1} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 bg-[var(--surface)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ background: 'var(--violet-bg)', borderColor: 'var(--violet)' }} />
          <span className="text-[10px] text-[var(--ink-3)]">Current cell</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ background: 'var(--emerald-bg)', borderColor: 'var(--emerald)' }} />
          <span className="text-[10px] text-[var(--ink-3)]">Filled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ background: 'var(--amber-bg)', borderColor: 'var(--amber)' }} />
          <span className="text-[10px] text-[var(--ink-3)]">Non-zero</span>
        </div>
      </div>
    </div>
  );
}

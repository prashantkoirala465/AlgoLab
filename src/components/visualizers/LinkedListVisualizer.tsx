'use client';

import { useState } from 'react';
import { Plus, Trash2, RefreshCw, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LLNode {
  id: number;
  value: number;
}

type NodeState = 'default' | 'active' | 'found' | 'deleted' | 'new';

interface LLStep {
  nodes: LLNode[];
  states: Record<number, NodeState>;
  description: string;
}

type LLOperation = 'insert-head' | 'insert-tail' | 'delete' | 'search' | 'reverse';

// ─── Step generators ──────────────────────────────────────────────────────────

let _idCounter = 100;
function uid() { return _idCounter++; }

function insertHeadSteps(list: LLNode[], val: number): LLStep[] {
  const steps: LLStep[] = [];
  const newNode: LLNode = { id: uid(), value: val };

  steps.push({
    nodes: [...list],
    states: {},
    description: `Insert ${val} at head: create new node`,
  });

  const withNew = [newNode, ...list];
  steps.push({
    nodes: withNew,
    states: { [newNode.id]: 'new' },
    description: `Point new node → old head. Update head pointer.`,
  });

  steps.push({
    nodes: withNew,
    states: {},
    description: `Done. ${val} is now the head.`,
  });

  return steps;
}

function insertTailSteps(list: LLNode[], val: number): LLStep[] {
  const steps: LLStep[] = [];
  const newNode: LLNode = { id: uid(), value: val };

  if (list.length === 0) {
    const withNew = [newNode];
    steps.push({ nodes: withNew, states: { [newNode.id]: 'new' }, description: `List empty — new node is head and tail.` });
    return steps;
  }

  steps.push({ nodes: [...list], states: {}, description: `Insert ${val} at tail: traverse to end.` });

  const stateMap: Record<number, NodeState> = {};
  for (let i = 0; i < list.length; i++) {
    stateMap[list[i].id] = 'active';
    steps.push({
      nodes: [...list],
      states: { ...stateMap },
      description: i < list.length - 1
        ? `Traversing… current = node[${i}] (value ${list[i].value})`
        : `Reached tail node (value ${list[i].value})`,
    });
  }

  const withNew = [...list, newNode];
  steps.push({
    nodes: withNew,
    states: { ...stateMap, [newNode.id]: 'new' },
    description: `Attach new node (${val}) after tail.`,
  });

  steps.push({ nodes: withNew, states: {}, description: `Done. ${val} is the new tail.` });
  return steps;
}

function deleteSteps(list: LLNode[], val: number): LLStep[] {
  const steps: LLStep[] = [];

  steps.push({ nodes: [...list], states: {}, description: `Delete node with value ${val}: start search.` });

  const stateMap: Record<number, NodeState> = {};
  let foundIdx = -1;
  for (let i = 0; i < list.length; i++) {
    stateMap[list[i].id] = 'active';
    if (list[i].value === val) {
      foundIdx = i;
      stateMap[list[i].id] = 'found';
      steps.push({ nodes: [...list], states: { ...stateMap }, description: `Found ${val} at position ${i}.` });
      break;
    }
    steps.push({ nodes: [...list], states: { ...stateMap }, description: `Check node[${i}] = ${list[i].value} — not a match.` });
  }

  if (foundIdx === -1) {
    steps.push({ nodes: [...list], states: {}, description: `Value ${val} not found in list.` });
    return steps;
  }

  const deletedId = list[foundIdx].id;
  steps.push({
    nodes: [...list],
    states: { [deletedId]: 'deleted' },
    description: `Mark node for deletion. Re-link pointers.`,
  });

  const newList = list.filter((_, i) => i !== foundIdx);
  steps.push({ nodes: newList, states: {}, description: `Deleted. Node removed from list.` });

  return steps;
}

function searchSteps(list: LLNode[], val: number): LLStep[] {
  const steps: LLStep[] = [];
  steps.push({ nodes: [...list], states: {}, description: `Search for value ${val}.` });

  const stateMap: Record<number, NodeState> = {};
  for (let i = 0; i < list.length; i++) {
    stateMap[list[i].id] = 'active';
    if (list[i].value === val) {
      stateMap[list[i].id] = 'found';
      steps.push({ nodes: [...list], states: { ...stateMap }, description: `Found ${val} at index ${i}!` });
      return steps;
    }
    steps.push({ nodes: [...list], states: { ...stateMap }, description: `node[${i}] = ${list[i].value} — not a match.` });
  }

  steps.push({ nodes: [...list], states: {}, description: `Value ${val} not found.` });
  return steps;
}

function reverseSteps(list: LLNode[]): LLStep[] {
  const steps: LLStep[] = [];

  steps.push({ nodes: [...list], states: {}, description: `Reverse: use prev, curr, next pointers.` });

  // Show each reversal step
  const arr = [...list];
  for (let i = 0; i < arr.length; i++) {
    const stateMap: Record<number, NodeState> = {};
    stateMap[arr[i].id] = 'active';
    if (i > 0) stateMap[arr[i - 1].id] = 'found';
    steps.push({
      nodes: arr,
      states: stateMap,
      description: `Reverse pointer at node[${i}] (value ${arr[i].value}).`,
    });
  }

  const reversed = [...list].reverse();
  steps.push({ nodes: reversed, states: {}, description: `Reversal complete. Head is now ${reversed[0]?.value ?? '—'}.` });
  return steps;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const NODE_STYLES: Record<NodeState, { bg: string; border: string; text: string }> = {
  default: { bg: 'var(--surface)', border: 'var(--border)', text: 'var(--ink)' },
  active:  { bg: 'var(--amber-bg)', border: 'var(--amber)', text: 'var(--amber)' },
  found:   { bg: 'var(--emerald-bg)', border: 'var(--emerald)', text: 'var(--emerald)' },
  deleted: { bg: 'var(--red-bg, #fee2e2)', border: 'var(--red, #ef4444)', text: 'var(--red, #ef4444)' },
  new:     { bg: 'var(--violet-bg)', border: 'var(--violet)', text: 'var(--violet)' },
};

// ─── Default list ─────────────────────────────────────────────────────────────

function makeDefault(): LLNode[] {
  return [3, 7, 12, 5, 9].map(v => ({ id: uid(), value: v }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LinkedListVisualizer() {
  const [list, setList] = useState<LLNode[]>(makeDefault);
  const [operation, setOperation] = useState<LLOperation>('insert-tail');
  const [inputVal, setInputVal] = useState('');
  const [steps, setSteps] = useState<LLStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);

  const current: LLStep | null = stepIdx >= 0 && steps.length > 0
    ? steps[Math.min(stepIdx, steps.length - 1)]
    : null;

  const displayNodes = current ? current.nodes : list;
  const displayStates = current ? current.states : {};

  const run = () => {
    const v = parseInt(inputVal, 10);
    let s: LLStep[] = [];

    if (operation === 'insert-head') {
      if (isNaN(v)) return;
      s = insertHeadSteps(list, v);
    } else if (operation === 'insert-tail') {
      if (isNaN(v)) return;
      s = insertTailSteps(list, v);
    } else if (operation === 'delete') {
      if (isNaN(v)) return;
      s = deleteSteps(list, v);
    } else if (operation === 'search') {
      if (isNaN(v)) return;
      s = searchSteps(list, v);
    } else if (operation === 'reverse') {
      s = reverseSteps(list);
    }

    if (s.length > 0) {
      setSteps(s);
      setStepIdx(0);
      // After last step, commit state change
    }
  };

  const applyFinal = () => {
    if (!steps.length) return;
    const last = steps[steps.length - 1];
    setList(last.nodes);
    setSteps([]);
    setStepIdx(-1);
  };

  const reset = () => {
    setList(makeDefault());
    setSteps([]);
    setStepIdx(-1);
    setInputVal('');
  };

  const needsValue = operation !== 'reverse';

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        <select
          value={operation}
          onChange={e => { setOperation(e.target.value as LLOperation); setSteps([]); setStepIdx(-1); }}
          className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
        >
          <option value="insert-head">Insert at Head</option>
          <option value="insert-tail">Insert at Tail</option>
          <option value="delete">Delete</option>
          <option value="search">Search</option>
          <option value="reverse">Reverse</option>
        </select>

        {needsValue && (
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="value"
            className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] w-20 focus:outline-none"
          />
        )}

        <button
          onClick={run}
          disabled={steps.length > 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-50"
        >
          <Plus size={11} /> Run
        </button>

        {steps.length > 0 && stepIdx >= steps.length - 1 && (
          <button
            onClick={applyFinal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--emerald,#10b981)] text-white transition-colors"
          >
            Apply
          </button>
        )}

        <button onClick={reset} className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)]">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Linked list SVG */}
      <div className="bg-[var(--bg)] px-4 py-6 overflow-x-auto min-h-[120px] flex items-center">
        {displayNodes.length === 0 ? (
          <p className="text-sm text-[var(--ink-3)] italic">Empty list</p>
        ) : (
          <div className="flex items-center gap-0 flex-nowrap">
            {/* HEAD label */}
            <span className="text-[10px] font-mono text-[var(--ink-4)] mr-2 shrink-0">HEAD</span>

            {displayNodes.map((node, i) => {
              const state: NodeState = displayStates[node.id] ?? 'default';
              const s = NODE_STYLES[state];
              return (
                <div key={node.id} className="flex items-center shrink-0" style={{ transition: 'all 0.25s' }}>
                  {/* Node box */}
                  <div
                    className="flex rounded-lg border-2 overflow-hidden shrink-0"
                    style={{ borderColor: s.border, transition: 'all 0.25s' }}
                  >
                    {/* Value cell */}
                    <div
                      className="w-10 h-10 flex items-center justify-center text-sm font-bold font-mono"
                      style={{ background: s.bg, color: s.text, transition: 'all 0.25s' }}
                    >
                      {node.value}
                    </div>
                    {/* Pointer cell */}
                    <div
                      className="w-8 h-10 flex items-center justify-center border-l-2"
                      style={{ borderColor: s.border, background: s.bg }}
                    >
                      {i < displayNodes.length - 1
                        ? <ArrowRight size={12} style={{ color: s.text }} />
                        : <span className="text-[9px] font-mono" style={{ color: s.text }}>∅</span>
                      }
                    </div>
                  </div>
                  {/* Arrow between nodes */}
                  {i < displayNodes.length - 1 && (
                    <div className="w-4 h-0.5 bg-[var(--border)]" />
                  )}
                </div>
              );
            })}

            {/* NULL terminator */}
            <span className="text-[10px] font-mono text-[var(--ink-4)] ml-2 shrink-0">NULL</span>
          </div>
        )}
      </div>

      {/* Step nav */}
      {steps.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between gap-4 bg-[var(--bg-warm)]">
          <p className="text-xs text-[var(--ink-2)] flex-1 truncate">{current?.description ?? '—'}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setStepIdx(p => Math.max(p-1,0))} disabled={stepIdx<=0} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">← Prev</button>
            <span className="text-[10px] text-[var(--ink-4)] font-mono">{stepIdx+1}/{steps.length}</span>
            <button onClick={() => setStepIdx(p => Math.min(p+1, steps.length-1))} disabled={stepIdx>=steps.length-1} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 bg-[var(--surface)]">
        {([
          ['new', 'New node'],
          ['active', 'Traversing'],
          ['found', 'Found / prev'],
          ['deleted', 'Deleted'],
        ] as [NodeState, string][]).map(([state, label]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2" style={{ background: NODE_STYLES[state].bg, borderColor: NODE_STYLES[state].border }} />
            <span className="text-[10px] text-[var(--ink-3)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

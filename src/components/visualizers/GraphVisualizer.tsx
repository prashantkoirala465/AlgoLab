'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, RefreshCw } from 'lucide-react';

// ─── Graph types ──────────────────────────────────────────────────────────────

interface GNode { id: number; x: number; y: number; label: string; }
interface GEdge { from: number; to: number; weight?: number; }
type GNodeState = 'default' | 'queued' | 'visited' | 'current' | 'path';

interface GraphStep {
  nodeStates: Record<number, GNodeState>;
  edgeHighlights: Set<string>;
  description: string;
}

// ─── Sample graph ─────────────────────────────────────────────────────────────

const DEFAULT_NODES: GNode[] = [
  { id: 0, x: 200, y: 40,  label: 'A' },
  { id: 1, x: 80,  y: 120, label: 'B' },
  { id: 2, x: 320, y: 120, label: 'C' },
  { id: 3, x: 40,  y: 230, label: 'D' },
  { id: 4, x: 180, y: 230, label: 'E' },
  { id: 5, x: 360, y: 230, label: 'F' },
  { id: 6, x: 120, y: 320, label: 'G' },
];

const DEFAULT_EDGES: GEdge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 4 }, { from: 2, to: 5 },
  { from: 3, to: 6 }, { from: 4, to: 6 },
];

// ─── BFS steps ────────────────────────────────────────────────────────────────

function bfsSteps(nodes: GNode[], edges: GEdge[], startId: number): GraphStep[] {
  const adj: Record<number, number[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) { adj[e.from].push(e.to); adj[e.to].push(e.from); }

  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const queue = [startId];
  visited.add(startId);
  let nodeStates: Record<number, GNodeState> = {};
  nodeStates[startId] = 'queued';
  steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: new Set(), description: `Start BFS from ${nodes[startId].label}` });

  while (queue.length > 0) {
    const cur = queue.shift()!;
    nodeStates[cur] = 'current';
    steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: new Set(), description: `Dequeue ${nodes[cur].label}` });

    for (const nb of adj[cur]) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        nodeStates[nb] = 'queued';
        const eh = new Set<string>();
        eh.add(`${Math.min(cur,nb)}-${Math.max(cur,nb)}`);
        steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: eh, description: `Enqueue neighbor ${nodes[nb].label}` });
      }
    }
    nodeStates[cur] = 'visited';
  }
  steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: new Set(), description: 'BFS complete' });
  return steps;
}

function dfsSteps(nodes: GNode[], edges: GEdge[], startId: number): GraphStep[] {
  const adj: Record<number, number[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) { adj[e.from].push(e.to); adj[e.to].push(e.from); }

  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const nodeStates: Record<number, GNodeState> = {};

  function dfs(id: number) {
    visited.add(id);
    nodeStates[id] = 'current';
    steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: new Set(), description: `Visit ${nodes[id].label}` });
    nodeStates[id] = 'visited';
    for (const nb of adj[id]) {
      if (!visited.has(nb)) {
        const eh = new Set<string>();
        eh.add(`${Math.min(id,nb)}-${Math.max(id,nb)}`);
        steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: eh, description: `Explore edge ${nodes[id].label} → ${nodes[nb].label}` });
        dfs(nb);
      }
    }
  }
  dfs(startId);
  steps.push({ nodeStates: { ...nodeStates }, edgeHighlights: new Set(), description: 'DFS complete' });
  return steps;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const NODE_COLORS: Record<GNodeState, { fill: string; stroke: string; text: string }> = {
  default: { fill: 'var(--surface)', stroke: 'var(--border)', text: 'var(--ink)' },
  queued:  { fill: 'var(--amber-bg)', stroke: 'var(--amber)', text: 'var(--amber)' },
  current: { fill: 'var(--violet-bg)', stroke: 'var(--violet)', text: 'var(--violet)' },
  visited: { fill: 'var(--emerald-bg)', stroke: 'var(--emerald)', text: 'var(--emerald)' },
  path:    { fill: 'var(--accent-bg)', stroke: 'var(--accent)', text: 'var(--accent)' },
};

type GraphAlgorithm = 'bfs' | 'dfs';

// ─── Component ────────────────────────────────────────────────────────────────

export function GraphVisualizer() {
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs');
  const [startNode, setStartNode] = useState(0);
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);

  const nodes = DEFAULT_NODES;
  const edges = DEFAULT_EDGES;

  const current: GraphStep | null = stepIdx >= 0 && steps.length > 0
    ? steps[Math.min(stepIdx, steps.length - 1)]
    : null;

  const getNodeState = (id: number): GNodeState => current?.nodeStates[id] ?? 'default';
  const isEdgeHighlighted = (from: number, to: number) =>
    current?.edgeHighlights.has(`${Math.min(from,to)}-${Math.max(from,to)}`) ?? false;

  const run = () => {
    const gen = algorithm === 'bfs' ? bfsSteps : dfsSteps;
    const s = gen(nodes, edges, startNode);
    setSteps(s);
    setStepIdx(0);
  };

  const reset = () => { setSteps([]); setStepIdx(-1); };

  const SVG_W = 420;
  const SVG_H = 380;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {(['bfs', 'dfs'] as GraphAlgorithm[]).map(alg => (
            <button
              key={alg}
              onClick={() => { setAlgorithm(alg); reset(); }}
              className={`text-xs px-3 py-1.5 rounded-md uppercase font-medium transition-colors ${
                algorithm === alg ? 'bg-[var(--accent)] text-white' : 'text-[var(--ink-3)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-3)]">Start:</span>
          <select
            value={startNode}
            onChange={e => { setStartNode(Number(e.target.value)); reset(); }}
            className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
          >
            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>
        <button onClick={run} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors">
          <Play size={11} /> Run
        </button>
        <button onClick={reset} className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)]">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* SVG graph */}
      <div className="bg-[var(--bg)] flex justify-center p-4">
        <svg width={SVG_W} height={SVG_H} style={{ overflow: 'visible' }}>
          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodes[e.from];
            const to = nodes[e.to];
            const highlighted = isEdgeHighlighted(e.from, e.to);
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={highlighted ? 'var(--violet)' : 'var(--border)'}
                strokeWidth={highlighted ? 2.5 : 1.5}
                style={{ transition: 'all 0.2s' }}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(n => {
            const state = getNodeState(n.id);
            const c = NODE_COLORS[state];
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle r={20} fill={c.fill} stroke={c.stroke} strokeWidth={state !== 'default' ? 2 : 1} style={{ transition: 'all 0.2s' }} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600} fill={c.text} style={{ userSelect: 'none' }}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
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
        {(['queued', 'current', 'visited'] as GNodeState[]).map(state => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border" style={{ background: NODE_COLORS[state].fill, borderColor: NODE_COLORS[state].stroke }} />
            <span className="text-[10px] text-[var(--ink-3)] capitalize">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

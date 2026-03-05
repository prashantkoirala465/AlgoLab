'use client';

import { useState, useCallback } from 'react';
import { Plus, Search, RefreshCw, Play } from 'lucide-react';

// ─── BST types ────────────────────────────────────────────────────────────────

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  id: number;
}

type NodeState = 'default' | 'active' | 'found' | 'inserted' | 'visited';

interface LayoutNode {
  node: TreeNode;
  state: NodeState;
}

// ─── BST logic ────────────────────────────────────────────────────────────────

let nodeIdCounter = 0;

function createNode(val: number): TreeNode {
  return { val, left: null, right: null, x: 0, y: 0, id: ++nodeIdCounter };
}

function insert(root: TreeNode | null, val: number): TreeNode {
  if (!root) return createNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}

// Reingold–Tilford layout (simplified)
function layoutTree(node: TreeNode | null, depth: number, counter: { x: number }, spacing: number): void {
  if (!node) return;
  layoutTree(node.left, depth + 1, counter, spacing);
  node.x = counter.x * spacing;
  node.y = depth * 70;
  counter.x++;
  layoutTree(node.right, depth + 1, counter, spacing);
}

function cloneTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  return { ...root, left: cloneTree(root.left), right: cloneTree(root.right) };
}

function collectNodes(root: TreeNode | null, out: TreeNode[] = []): TreeNode[] {
  if (!root) return out;
  collectNodes(root.left, out);
  out.push(root);
  collectNodes(root.right, out);
  return out;
}

function collectEdges(root: TreeNode | null, out: { from: TreeNode; to: TreeNode }[] = []) {
  if (!root) return out;
  if (root.left) { out.push({ from: root, to: root.left }); collectEdges(root.left, out); }
  if (root.right) { out.push({ from: root, to: root.right }); collectEdges(root.right, out); }
  return out;
}

// ─── Insert steps ─────────────────────────────────────────────────────────────

interface TreeStep {
  states: Map<number, NodeState>;
  description: string;
}

function insertSteps(root: TreeNode | null, val: number): TreeStep[] {
  const steps: TreeStep[] = [];
  const path: number[] = [];
  let cur = root;
  while (cur) {
    path.push(cur.id);
    const m = new Map<number, NodeState>(path.map(id => [id, 'active']));
    steps.push({ states: m, description: `Visit ${cur.val}: ${val} < ${cur.val} ? go ${val < cur.val ? 'left' : 'right'}` });
    if (val < cur.val) cur = cur.left;
    else if (val > cur.val) cur = cur.right;
    else { // duplicate
      const m2 = new Map<number, NodeState>(path.map(id => [id, id === cur!.id ? 'found' : 'active']));
      steps.push({ states: m2, description: `${val} already exists in tree` });
      return steps;
    }
  }
  const insertedM = new Map<number, NodeState>(path.map(id => [id, 'active']));
  steps.push({ states: insertedM, description: `Insert ${val} here` });
  return steps;
}

function searchSteps(root: TreeNode | null, val: number): TreeStep[] {
  const steps: TreeStep[] = [];
  const path: number[] = [];
  let cur = root;
  while (cur) {
    path.push(cur.id);
    const m = new Map<number, NodeState>(path.map(id => [id, id === cur!.id ? 'active' : 'visited']));
    if (cur.val === val) {
      m.set(cur.id, 'found');
      steps.push({ states: m, description: `Found ${val} at node!` });
      return steps;
    }
    steps.push({ states: m, description: `${val} ${val < cur.val ? '<' : '>'} ${cur.val} → go ${val < cur.val ? 'left' : 'right'}` });
    cur = val < cur.val ? cur.left : cur.right;
  }
  const m = new Map<number, NodeState>(path.map(id => [id, 'visited']));
  steps.push({ states: m, description: `${val} not found in tree` });
  return steps;
}

function inorderSteps(root: TreeNode | null): TreeStep[] {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  function inorder(node: TreeNode | null) {
    if (!node) return;
    inorder(node.left);
    visited.push(node.id);
    const m = new Map<number, NodeState>(visited.map(id => [id, id === node.id ? 'active' : 'visited']));
    steps.push({ states: m, description: `Visit ${node.val} (inorder: ${visited.length})` });
    inorder(node.right);
  }
  inorder(root);
  return steps;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const NODE_COLORS: Record<NodeState, { fill: string; stroke: string; text: string }> = {
  default:  { fill: 'var(--surface)', stroke: 'var(--border)', text: 'var(--ink)' },
  active:   { fill: 'var(--amber-bg)', stroke: 'var(--amber)', text: 'var(--amber)' },
  found:    { fill: 'var(--emerald-bg)', stroke: 'var(--emerald)', text: 'var(--emerald)' },
  inserted: { fill: 'var(--accent-bg)', stroke: 'var(--accent)', text: 'var(--accent)' },
  visited:  { fill: 'var(--bg-warm)', stroke: 'var(--border)', text: 'var(--ink-3)' },
};

const INITIAL_VALUES = [40, 20, 60, 10, 30, 50, 70];

// ─── Component ────────────────────────────────────────────────────────────────

export function TreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(() => {
    let r: TreeNode | null = null;
    for (const v of INITIAL_VALUES) r = insert(r, v);
    return r;
  });
  const [inputVal, setInputVal] = useState('');
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [nodeStates, setNodeStates] = useState<Map<number, NodeState>>(new Map());
  const [message, setMessage] = useState('');
  const [operation, setOperation] = useState<'insert' | 'search' | 'inorder'>('insert');

  // Layout tree
  const layoutRoot = cloneTree(root);
  if (layoutRoot) {
    const counter = { x: 0 };
    layoutTree(layoutRoot, 0, counter, 50);
  }
  const allNodes = collectNodes(layoutRoot);
  const allEdges = collectEdges(layoutRoot);

  const minX = allNodes.reduce((m, n) => Math.min(m, n.x), 0);
  const maxX = allNodes.reduce((m, n) => Math.max(m, n.x), 0);
  const maxY = allNodes.reduce((m, n) => Math.max(m, n.y), 0);
  const svgWidth = Math.max(300, maxX - minX + 80);
  const svgHeight = maxY + 60;
  const offsetX = -minX + 40;

  const runOperation = useCallback(() => {
    const val = Number(inputVal);
    if (isNaN(val) || !inputVal) return;

    let generatedSteps: TreeStep[] = [];

    if (operation === 'insert') {
      generatedSteps = insertSteps(root, val);
      setSteps(generatedSteps);
      setStepIdx(0);
      setNodeStates(generatedSteps[0]?.states ?? new Map());
      setMessage(generatedSteps[0]?.description ?? '');
      // Actually insert after animation
      setTimeout(() => {
        setRoot(prev => {
          const newRoot = cloneTree(prev);
          return insert(newRoot, val);
        });
        setNodeStates(new Map());
      }, (generatedSteps.length + 1) * 400);
    } else if (operation === 'search') {
      generatedSteps = searchSteps(root, val);
      setSteps(generatedSteps);
      setStepIdx(0);
      setNodeStates(generatedSteps[0]?.states ?? new Map());
      setMessage(generatedSteps[0]?.description ?? '');
    } else {
      generatedSteps = inorderSteps(root);
      setSteps(generatedSteps);
      setStepIdx(0);
      setNodeStates(generatedSteps[0]?.states ?? new Map());
      setMessage(generatedSteps[0]?.description ?? '');
    }
  }, [root, inputVal, operation]);

  const handleNext = () => {
    const next = Math.min(stepIdx + 1, steps.length - 1);
    setStepIdx(next);
    setNodeStates(steps[next]?.states ?? new Map());
    setMessage(steps[next]?.description ?? '');
  };

  const handlePrev = () => {
    const prev = Math.max(stepIdx - 1, 0);
    setStepIdx(prev);
    setNodeStates(steps[prev]?.states ?? new Map());
    setMessage(steps[prev]?.description ?? '');
  };

  const handleReset = () => {
    nodeIdCounter = 0;
    let r: TreeNode | null = null;
    for (const v of INITIAL_VALUES) r = insert(r, v);
    setRoot(r);
    setSteps([]);
    setStepIdx(-1);
    setNodeStates(new Map());
    setMessage('');
    setInputVal('');
  };

  const getNodeState = (id: number): NodeState => nodeStates.get(id) ?? 'default';

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        {/* Operation selector */}
        <div className="flex gap-1">
          {(['insert', 'search', 'inorder'] as const).map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition-colors capitalize ${
                operation === op
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        {operation !== 'inorder' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="value"
              className="w-20 text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            />
          </div>
        )}

        <button
          onClick={runOperation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors"
        >
          <Play size={11} />
          Run
        </button>

        <button onClick={handleReset} className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] border border-[var(--border)] bg-[var(--surface)]">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* SVG tree */}
      <div className="bg-[var(--bg)] overflow-auto p-4" style={{ minHeight: 200 }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        >
          {/* Edges */}
          {allEdges.map((e, i) => (
            <line
              key={i}
              x1={e.from.x + offsetX}
              y1={e.from.y + 20}
              x2={e.to.x + offsetX}
              y2={e.to.y + 20}
              stroke="var(--border)"
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes */}
          {allNodes.map(node => {
            const state = getNodeState(node.id);
            const c = NODE_COLORS[state];
            return (
              <g key={node.id} transform={`translate(${node.x + offsetX}, ${node.y + 20})`}>
                <circle
                  r={18}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={state !== 'default' ? 2 : 1}
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  fontWeight={state !== 'default' ? 600 : 400}
                  fill={c.text}
                  style={{ transition: 'all 0.2s', userSelect: 'none' }}
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step navigation */}
      {steps.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between gap-4 bg-[var(--bg-warm)]">
          <p className="text-xs text-[var(--ink-2)] flex-1 truncate">{message}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handlePrev} disabled={stepIdx <= 0} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">← Prev</button>
            <span className="text-[10px] text-[var(--ink-4)] font-mono">{stepIdx + 1}/{steps.length}</span>
            <button onClick={handleNext} disabled={stepIdx >= steps.length - 1} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 bg-[var(--surface)]">
        {([
          ['active', 'Current'],
          ['found', 'Found'],
          ['inserted', 'Inserted'],
          ['visited', 'Visited'],
        ] as [NodeState, string][]).map(([state, label]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ background: NODE_COLORS[state].fill, borderColor: NODE_COLORS[state].stroke }}
            />
            <span className="text-[10px] text-[var(--ink-3)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

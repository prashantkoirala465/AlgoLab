'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, RefreshCw, Shuffle, Volume2, VolumeX } from 'lucide-react';
import {
  SORT_GENERATORS,
  SORT_ALGORITHM_NAMES,
  type SortAlgorithmId,
  type SortStep,
  type BarState,
} from '@/lib/sortAlgorithms';
import { useSound } from '@/hooks/useSound';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

const BAR_COLORS: Record<BarState, string> = {
  default:   'var(--border)',
  comparing: 'var(--amber)',
  swapping:  'var(--rose)',
  sorted:    'var(--emerald)',
  pivot:     'var(--violet)',
  min:       'var(--accent)',
};

const SPEED_MS: Record<string, number> = {
  slow: 600,
  normal: 200,
  fast: 60,
};

// ─── Visualizer ──────────────────────────────────────────────────────────────

interface SortVisualizerProps {
  initialAlgorithm?: SortAlgorithmId;
}

export function SortVisualizer({ initialAlgorithm = 'bubble' }: SortVisualizerProps) {
  const [algorithm, setAlgorithm] = useState<SortAlgorithmId>(initialAlgorithm);
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [baseArray, setBaseArray] = useState<number[]>(() => randomArray(20));
  const [currentStep, setCurrentStep] = useState<SortStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const stepsRef = useRef<SortStep[]>([]);
  const playIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDoneRef = useRef(false);

  const { muted, toggleMute, ensureAudio, sndSweep, sndDone } = useSound();

  // Track step index in a ref so the auto-play loop can read it
  // without depending on React state (avoids stale closures & lets us
  // play sound OUTSIDE the setState updater).
  const stepIndexRef = useRef(0);

  // Build all steps upfront when array or algorithm changes
  const buildSteps = useCallback((arr: number[], alg: SortAlgorithmId) => {
    const gen = SORT_GENERATORS[alg](arr);
    const steps: SortStep[] = [];
    let result = gen.next();
    while (!result.done) {
      steps.push(result.value as SortStep);
      result = gen.next();
    }
    stepsRef.current = steps;
    setTotalSteps(steps.length);
    stepIndexRef.current = 0;
    setStepIndex(0);
    setCurrentStep(steps[0] ?? null);
    setIsDone(false);
    wasDoneRef.current = false;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    buildSteps(baseArray, algorithm);
  }, [baseArray, algorithm, buildSteps]);

  // Play victory chord once when sort completes
  useEffect(() => {
    if (isDone && !wasDoneRef.current) {
      wasDoneRef.current = true;
      sndDone();
    }
  }, [isDone, sndDone]);

  // Auto-play loop — sound is played OUTSIDE the setState updater
  useEffect(() => {
    if (!isPlaying) {
      if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
      return;
    }
    const tick = () => {
      const next = stepIndexRef.current + 1;
      if (next >= stepsRef.current.length) {
        setIsPlaying(false);
        setIsDone(true);
        return;
      }
      const step = stepsRef.current[next];
      stepIndexRef.current = next;
      setStepIndex(next);
      setCurrentStep(step);

      // Sound: play a tone mapped to a highlighted bar's value
      const maxVal = Math.max(...step.array);
      const activeIdx = step.states.findIndex(
        s => s === 'comparing' || s === 'swapping' || s === 'pivot' || s === 'min'
      );
      if (activeIdx !== -1) {
        sndSweep(step.array[activeIdx], maxVal);
      }

      playIntervalRef.current = setTimeout(tick, SPEED_MS[speed]);
    };
    playIntervalRef.current = setTimeout(tick, SPEED_MS[speed]);
    return () => { if (playIntervalRef.current) clearTimeout(playIntervalRef.current); };
  }, [isPlaying, speed, sndSweep]);

  const handleStep = () => {
    const next = stepIndexRef.current + 1;
    if (next >= stepsRef.current.length) { setIsDone(true); return; }
    stepIndexRef.current = next;
    setStepIndex(next);
    setCurrentStep(stepsRef.current[next]);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
    const steps = stepsRef.current;
    stepIndexRef.current = 0;
    setStepIndex(0);
    setCurrentStep(steps[0] ?? null);
    setIsDone(false);
    wasDoneRef.current = false;
  };

  const handleShuffle = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
    const newArr = randomArray(arraySize);
    setBaseArray(newArr);
  };

  const handleSizeChange = (s: number) => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
    setArraySize(s);
    setBaseArray(randomArray(s));
  };

  const display = currentStep ?? { array: baseArray, states: baseArray.map(() => 'default' as BarState), description: '' };
  const maxVal = Math.max(...display.array);

  const progressPct = totalSteps > 0 ? Math.round((stepIndex / Math.max(totalSteps - 1, 1)) * 100) : 0;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Controls bar */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-warm)] px-4 py-3 flex flex-wrap gap-3 items-center">
        {/* Algorithm selector */}
        <select
          value={algorithm}
          onChange={e => setAlgorithm(e.target.value as SortAlgorithmId)}
          className="text-xs border border-[var(--border)] rounded-lg px-2.5 py-1.5 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-colors"
        >
          {(Object.keys(SORT_ALGORITHM_NAMES) as SortAlgorithmId[]).map(id => (
            <option key={id} value={id}>{SORT_ALGORITHM_NAMES[id]}</option>
          ))}
        </select>

        {/* Size */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-3)]">n=</span>
          <input
            type="range" min={8} max={40} step={4} value={arraySize}
            onChange={e => handleSizeChange(Number(e.target.value))}
            className="w-20 accent-[var(--accent)]"
          />
          <span className="text-xs text-[var(--ink-3)] w-4">{arraySize}</span>
        </div>

        {/* Speed */}
        <div className="flex gap-1">
          {(['slow', 'normal', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors capitalize ${
                speed === s
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            aria-label="New random array"
            className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)] border border-[var(--border)] bg-[var(--surface)] transition-colors"
          >
            <Shuffle size={14} />
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset to start"
            className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)] border border-[var(--border)] bg-[var(--surface)] transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleStep}
            disabled={isDone}
            aria-label="Step forward one step"
            className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)] border border-[var(--border)] bg-[var(--surface)] transition-colors disabled:opacity-40"
          >
            <SkipForward size={14} />
          </button>
          <button
            onClick={() => {
              ensureAudio(); // Resume audio context on user gesture
              toggleMute();
            }}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            className="p-1.5 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--bg-warm)] border border-[var(--border)] bg-[var(--surface)] transition-colors"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            onClick={() => {
              ensureAudio(); // Must be called in user gesture handler
              setIsPlaying(p => !p);
            }}
            disabled={isDone}
            aria-label={isPlaying ? 'Pause sorting' : 'Play sorting'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-40"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Bar chart */}
      <div className="px-4 py-6 bg-[var(--bg)]">
        <div className="flex items-end gap-[2px] h-48 w-full">
          {display.array.map((val, i) => {
            const heightPct = (val / maxVal) * 100;
            const color = BAR_COLORS[display.states[i]] ?? BAR_COLORS.default;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm min-w-0"
                style={{ height: `${heightPct}%`, background: color }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-[var(--border)] px-4 py-2.5 flex items-center justify-between gap-4 bg-[var(--bg-warm)]">
        <p className="text-xs text-[var(--ink-3)] truncate flex-1">
          {isDone
            ? 'Sorted'
            : display.description || 'Press Play to start'}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[10px] text-[var(--ink-4)] font-mono tabular-nums">{stepIndex}/{totalSteps}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-[var(--border)] px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 bg-[var(--surface)]">
        {([
          ['comparing', 'Comparing'],
          ['swapping', 'Swapping'],
          ['sorted', 'Sorted'],
          ['pivot', 'Pivot'],
          ['min', 'Minimum'],
        ] as [BarState, string][]).map(([state, label]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: BAR_COLORS[state] }} aria-hidden="true" />
            <span className="text-[10px] text-[var(--ink-3)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

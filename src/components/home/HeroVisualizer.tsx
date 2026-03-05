'use client';

import { useEffect, useRef, useState } from 'react';
import { SORT_GENERATORS, type SortStep, type BarState } from '@/lib/sortAlgorithms';

// Theme-aware bar colors using CSS custom properties
const BAR_COLORS: Record<BarState, string> = {
  default:   'var(--border)',
  comparing: 'var(--amber)',
  swapping:  'var(--rose)',
  sorted:    'var(--emerald)',
  pivot:     'var(--violet)',
  min:       'var(--accent)',
};

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 20);
}

const ALGO_IDS = ['merge', 'quick', 'heap', 'bubble', 'insertion', 'selection'] as const;

export function HeroVisualizer() {
  const [display, setDisplay] = useState<SortStep>(() => {
    const arr = randomArray(32);
    return { array: arr, states: arr.map(() => 'default' as BarState), description: '' };
  });

  const stepsRef = useRef<SortStep[]>([]);
  const idxRef   = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const algoIdxRef = useRef(0);

  function buildNextRound() {
    const arr = randomArray(32);
    const algoId = ALGO_IDS[algoIdxRef.current % ALGO_IDS.length];
    algoIdxRef.current++;
    const gen = SORT_GENERATORS[algoId](arr);
    const steps: SortStep[] = [];
    let r = gen.next();
    while (!r.done) { steps.push(r.value as SortStep); r = gen.next(); }
    // append a short "all-sorted" hold at the end
    if (steps.length > 0) {
      const last = steps[steps.length - 1];
      for (let i = 0; i < 8; i++) steps.push(last);
    }
    stepsRef.current = steps;
    idxRef.current = 0;
  }

  useEffect(() => {
    buildNextRound();

    const tick = () => {
      const steps = stepsRef.current;
      if (idxRef.current >= steps.length) {
        // pause one beat, then start a new round
        timerRef.current = setTimeout(() => {
          buildNextRound();
          timerRef.current = setTimeout(tick, 60);
        }, 600);
        return;
      }
      setDisplay(steps[idxRef.current]);
      idxRef.current++;
      timerRef.current = setTimeout(tick, 42); // ~24 fps
    };

    timerRef.current = setTimeout(tick, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const maxVal = Math.max(...display.array);

  return (
    <div className="w-full h-full flex items-end gap-[3px] px-2 pb-2" aria-hidden="true">
      {display.array.map((val, i) => {
        const h = (val / maxVal) * 100;
        const color = BAR_COLORS[display.states[i]] ?? BAR_COLORS.default;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-[2px] min-w-0 will-change-[height]"
            style={{
              height: `${h}%`,
              background: color,
              transition: 'height 60ms linear, background 80ms linear',
            }}
          />
        );
      })}
    </div>
  );
}

'use client';

import { useProgress } from '@/hooks/useProgress';
import { CheckCircle2, Circle } from 'lucide-react';

interface MarkDoneButtonProps {
  slug: string;
}

export function MarkDoneButton({ slug }: MarkDoneButtonProps) {
  const { isDone, toggle } = useProgress();
  const done = isDone(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      aria-label={done ? 'Mark as not done' : 'Mark as done'}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
        done
          ? 'bg-[var(--emerald-bg)] border-[var(--emerald)] text-[var(--emerald)] hover:bg-[var(--emerald-bg-hover,var(--emerald-bg))]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--emerald)] hover:text-[var(--emerald)]'
      }`}
    >
      {done
        ? <CheckCircle2 size={16} className="shrink-0" />
        : <Circle size={16} className="shrink-0" />
      }
      {done ? 'Completed' : 'Mark as done'}
    </button>
  );
}

'use client';

import { useState } from 'react';
import type { AlgorithmCode } from '@/data/types';

const TABS: { key: keyof AlgorithmCode; label: string; lang: 'cpp' | 'javascript' | 'python' }[] = [
  { key: 'cpp', label: 'C++', lang: 'cpp' },
  { key: 'js', label: 'JavaScript', lang: 'javascript' },
  { key: 'python', label: 'Python', lang: 'python' },
];

interface CodeTabsProps {
  code: AlgorithmCode;
  /** Pre-rendered HTML per language, keyed by tab key */
  renderedCode: Record<keyof AlgorithmCode, string>;
}

export function CodeTabs({ code, renderedCode }: CodeTabsProps) {
  const [active, setActive] = useState<keyof AlgorithmCode>('cpp');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code[active]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-warm)] px-2">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                active === tab.key
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code'}
          className="text-xs text-[var(--ink-4)] hover:text-[var(--ink)] px-3 py-1.5 rounded transition-colors"
        >
          <span aria-live="polite" aria-atomic="true">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code panel */}
      <div
        className="overflow-auto text-sm leading-relaxed font-[var(--font-mono)] [&_pre]:p-4 [&_pre]:!bg-transparent max-h-[480px]"
        dangerouslySetInnerHTML={{ __html: renderedCode[active] }}
      />
    </div>
  );
}

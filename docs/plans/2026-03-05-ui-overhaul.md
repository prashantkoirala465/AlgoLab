# AlgoLab UI Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all AI-generated UI patterns (emoji abuse, generic hero copy, `transition-all`, missing aria-labels), add Web Audio API sound to the sort visualizer, and make the frontend feel like a professional human-crafted product.

**Architecture:** Surgical file-by-file edits — no new pages, no new dependencies. Sound lives in a `useSound` hook. Emoji icons in categories.ts are replaced with Lucide component names and rendered dynamically in HomeContent.tsx and CategoryPill.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, Lucide React, Web Audio API (browser-native)

---

### Task 1: Create `src/hooks/useSound.ts`

**Files:**
- Create: `src/hooks/useSound.ts`

Implements Web Audio API sound with `sndSweep(value, max)` and `sndDone()`. Respects `prefers-reduced-motion`. Exposes `{ muted, toggleMute, sndSweep, sndDone }`.

```ts
'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export function useSound() {
  const actxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  function ensureAudio() {
    if (!actxRef.current) {
      actxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (actxRef.current.state === 'suspended') actxRef.current.resume();
  }

  function tone(freq: number, dur: number, type: OscillatorType, vol: number) {
    if (muted || reducedMotion.current || !actxRef.current) return;
    const ctx = actxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  const sndSweep = useCallback((value: number, max: number) => {
    ensureAudio();
    tone(200 + (value / max) * 800, 0.04, 'sine', 0.04);
  }, [muted]);

  const sndDone = useCallback(() => {
    ensureAudio();
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => tone(f, 0.22, 'sine', 0.09), i * 110)
    );
  }, [muted]);

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  return { muted, toggleMute, sndSweep, sndDone };
}
```

---

### Task 2: Update `SortVisualizer.tsx` — sound + aria-labels + status text

**Files:**
- Modify: `src/components/visualizers/SortVisualizer.tsx`

Changes:
1. Import `useSound` and `Volume2`, `VolumeX` from lucide-react
2. Call `sndSweep(val, maxVal)` during auto-play tick on each step that has `comparing` or `swapping` state
3. Call `sndDone()` when `isDone` becomes true
4. Replace `title=` on icon buttons with `aria-label=`
5. Replace `'✓ Sorted!'` with `'Sorted'`
6. Remove `transition-all` from bars (keep `transition-colors` where needed)
7. Add mute toggle button next to shuffle/reset/step

---

### Task 3: Replace emoji icons in `categories.ts`

**Files:**
- Modify: `src/data/categories.ts`

Change `icon: string` (emoji) to `icon: string` (Lucide component name):
- sorting → `'ArrowUpDown'`
- searching → `'Search'`
- linked-lists → `'Link2'`
- trees → `'GitBranch'`
- graphs → `'Share2'`
- dynamic-programming → `'LayoutGrid'`
- greedy → `'TrendingUp'`
- backtracking → `'CornerUpLeft'`
- advanced → `'Cpu'`

Comment field: change `// emoji` to `// lucide icon name`

---

### Task 4: Overhaul `HomeContent.tsx`

**Files:**
- Modify: `src/components/home/HomeContent.tsx`

Changes:
1. Import Lucide icons dynamically: import `* as LucideIcons` then render `const Icon = (LucideIcons as any)[cat.icon]`
2. `CategoryPill` — replace `<span>{cat.icon}</span>` with `<Icon size={13} aria-hidden="true" />`
3. Section headers — replace `<span className="text-xl">{cat.icon}</span>` with `<Icon size={15} aria-hidden="true" className="text-[var(--ink-3)]" />`
4. Empty state — replace `&#x1F50D;` emoji `<p>` with a `<Search size={32} className="mx-auto mb-3 text-[var(--border)]" />` (no text emoji)
5. `AlgorithmCard` — replace `transition-all` with `transition-colors`
6. Search input — replace `transition-all` with `transition-colors`
7. Search clear button — add `aria-label="Clear search"`
8. Hero subtitle — replace "Interactive visualizations, complexity analysis, and clean code for 55+ algorithms across 9 categories." with tighter copy
9. Add `style={{ textWrap: 'balance' } as React.CSSProperties}` to `<h1>`

---

### Task 5: Fix `globals.css`

**Files:**
- Modify: `src/app/globals.css`

Add to `.dark {}`:
```css
color-scheme: dark;
```

Add to `html {}`:
```css
touch-action: manipulation;
```

Add after scrollbar block:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Task 6: Fix `CodeTabs.tsx` — aria-label + aria-live

**Files:**
- Modify: `src/components/ui/CodeTabs.tsx`

Changes:
1. Copy button: add `aria-label={copied ? 'Code copied' : 'Copy code'}`
2. Wrap copy button text in `<span aria-live="polite" aria-atomic="true">{copied ? 'Copied!' : 'Copy'}</span>`

---

### Task 7: Fix `Navbar.tsx` — focus-visible

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

Add `focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50` to nav links and theme toggle button (where only `hover:` states exist currently).

---

### Task 8: Fix `Footer.tsx` — add GitHub link

**Files:**
- Modify: `src/components/layout/Footer.tsx`

Add GitHub link in nav section:
```tsx
<a href="https://github.com/prashantkoirala465/AlgoLab" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors flex items-center gap-1">
  <Github size={13} />
  GitHub
</a>
```

---

### Task 9: Run type-check and build

```bash
cd algolab && npx tsc --noEmit && npm run build
```

Expected: 0 TypeScript errors, successful build.

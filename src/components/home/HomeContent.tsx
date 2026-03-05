"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Search,
  X,
  ArrowUpRight,
  ArrowRight,
  Play,
  Code2,
  BookOpen,
  BarChart3,
  HelpCircle,
  CheckCircle2,
  Zap,
  Layers,
  Clock,
  ChevronRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { ALGORITHMS } from "@/data/algorithms";
import { CATEGORIES, getCategoryInfo } from "@/data/categories";
import type { Category } from "@/data/types";
import { HeroVisualizer } from "./HeroVisualizer";

// ── Helpers ───────────────────────────────────────────────────────────────────

type LucideIconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

function CategoryIcon({
  name,
  size = 14,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIconComponent>)[
    name
  ];
  if (!Icon) return null;
  return <Icon size={size} className={className} aria-hidden="true" />;
}

// ── Scroll-triggered reveal hook ──────────────────────────────────────────

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Featured algorithm data (Merge Sort) ──────────────────────────────────

const FEATURED_ALGO = ALGORITHMS.find((a) => a.slug === "merge-sort")!;

// ── Ticker items ──────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { label: "Algorithms", value: "55+" },
  { label: "Categories", value: "9" },
  { label: "Visualizer Types", value: "6" },
  { label: "Languages", value: "3" },
  { label: "Step-by-step", value: "Yes" },
  { label: "Quizzes", value: "Built-in" },
  { label: "Complexity", value: "Analyzed" },
  { label: "Progress", value: "Tracked" },
];

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 1: Hero ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const reveal = useReveal(0.1);

  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-0 hero-glow">
      <div className="relative z-[1] max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Headline + sub */}
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.visible ? "visible" : ""} max-w-3xl mb-10 sm:mb-14`}
        >
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--ink-4)] mb-4">
            Interactive algorithm learning
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-[clamp(2.25rem,5.5vw,4rem)] font-semibold text-[var(--ink)] leading-[1.08] tracking-[-0.025em] mb-5">
            Learn every algorithm,{" "}
            <span className="italic text-[var(--ink-3)]">visually</span>
          </h1>
          <p className="text-[var(--ink-3)] text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
            Interactive visualizations, real code, complexity analysis, and
            quizzes for 55+ algorithms. Step through each one at your own pace.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#explore"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Start exploring
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              href="#deep-dive"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[var(--border)] text-[var(--ink-2)] text-sm font-medium hover:border-[var(--ink-4)] hover:text-[var(--ink)] transition-all duration-200"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Visualizer frame */}
        <HeroVisualizerFrame />
      </div>
    </section>
  );
}

function HeroVisualizerFrame() {
  const reveal = useReveal(0.05);

  return (
    <div
      ref={reveal.ref}
      className={`reveal ${reveal.visible ? "visible" : ""}`}
      style={{ transitionDelay: "150ms" }}
    >
      <div className="viz-frame rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-light)] bg-[var(--bg-warm)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[var(--emerald)] pulse-dot" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-4)] uppercase tracking-wider">
              Live &mdash; Sorting Visualizer
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--ink-4)]">
            <Play size={11} aria-hidden="true" />
            <span className="text-[11px] font-[family-name:var(--font-mono)]">Auto</span>
          </div>
        </div>
        {/* Visualizer */}
        <div className="h-56 sm:h-64 lg:h-72" aria-hidden="true">
          <HeroVisualizer />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Ticker ───────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function TickerBar() {
  return (
    <section className="py-10 sm:py-14 border-y border-[var(--border-light)] overflow-hidden">
      <div className="ticker-track">
        {/* Duplicate items for infinite scroll */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-[var(--ink)]">
              {item.value}
            </span>
            <span className="text-sm text-[var(--ink-4)]">{item.label}</span>
            {i < TICKER_ITEMS.length * 2 - 1 && (
              <span className="text-[var(--border)] mx-2" aria-hidden="true">
                /
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Interstitial Quote ───────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function Interstitial({
  text,
  attribution,
}: {
  text: string;
  attribution?: string;
}) {
  const reveal = useReveal(0.15);

  return (
    <div
      ref={reveal.ref}
      className={`reveal ${reveal.visible ? "visible" : ""} max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20`}
    >
      <div className="interstitial pl-8 sm:pl-10">
        <p className="font-[family-name:var(--font-serif)] text-[clamp(1.25rem,2.5vw,1.75rem)] italic text-[var(--ink-2)] leading-relaxed max-w-3xl">
          {text}
        </p>
        {attribution && (
          <p className="mt-4 text-sm text-[var(--ink-4)]">{attribution}</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 2: Bento Grid ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function BentoGrid() {
  const reveal = useReveal(0.1);

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.visible ? "visible" : ""} mb-12 sm:mb-16`}
        >
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--ink-4)] mb-3">
            01 &mdash; Everything you need
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em] max-w-xl">
            What&rsquo;s inside AlgoLab
          </h2>
        </div>

        {/* Grid: 3 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Interactive Visualizers (large, spans 2 cols) */}
          <BentoVisualizer parentVisible={reveal.visible} />

          {/* Card 2: Code in Three Languages */}
          <BentoCode parentVisible={reveal.visible} />

          {/* Card 3: Step-by-step Chapters */}
          <BentoChapters parentVisible={reveal.visible} />

          {/* Card 4: Complexity Analysis */}
          <BentoComplexity parentVisible={reveal.visible} />

          {/* Card 5: Quiz Yourself */}
          <BentoQuiz parentVisible={reveal.visible} />
        </div>
      </div>
    </section>
  );
}

function BentoVisualizer({ parentVisible }: { parentVisible: boolean }) {
  return (
    <div
      className={`reveal-stagger bento-card md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden ${parentVisible ? "visible" : ""}`}
      style={{ "--i": 0 } as React.CSSProperties}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center">
            <Play size={15} className="text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Interactive Visualizers
            </h3>
            <p className="text-xs text-[var(--ink-4)]">
              6 types: sort, search, tree, graph, linked list, DP
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--ink-3)] leading-relaxed mb-4">
          Watch algorithms execute step by step. Pause, rewind, adjust speed, and
          hear each operation with sound feedback.
        </p>
      </div>
      {/* Mini visualizer preview */}
      <div className="h-36 sm:h-40 border-t border-[var(--border-light)] bg-[var(--bg-warm)]/30 px-4 pb-3 flex items-end gap-[3px]" aria-hidden="true">
        {/* Static bar chart representing a mid-sort state */}
        {[35, 72, 18, 55, 90, 42, 65, 28, 80, 12, 48, 95, 38, 60, 22, 75, 50, 85, 30, 68].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[2px] min-w-0"
            style={{
              height: `${h}%`,
              background:
                i < 8
                  ? "var(--emerald)"
                  : i === 8 || i === 9
                  ? "var(--amber)"
                  : "var(--border)",
              opacity: i < 8 ? 0.8 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BentoCode({ parentVisible }: { parentVisible: boolean }) {
  return (
    <div
      className={`reveal-stagger bento-card code-card-border rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden ${parentVisible ? "visible" : ""}`}
      style={{ "--i": 1 } as React.CSSProperties}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--violet-bg)] flex items-center justify-center">
            <Code2 size={15} className="text-[var(--violet)]" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">
            Code in 3 Languages
          </h3>
        </div>
        <p className="text-xs text-[var(--ink-4)] mb-4">
          C++, JavaScript, and Python implementations for every algorithm.
        </p>
      </div>
      {/* Code preview */}
      <div className="border-t border-[var(--border-light)] bg-[var(--bg-warm)]/30 p-4 overflow-hidden">
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--amber-bg)] text-[var(--amber)]">
            Python
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium text-[var(--ink-4)] bg-[var(--bg-warm)]">
            JS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium text-[var(--ink-4)] bg-[var(--bg-warm)]">
            C++
          </span>
        </div>
        <pre className="home-code font-[family-name:var(--font-mono)] text-[12px] leading-[1.8] text-[var(--ink-2)] overflow-hidden max-h-32">
          <code>
            <span className="comment"># Merge Sort</span>{"\n"}
            <span className="keyword">def</span> <span className="function">merge_sort</span>(arr):{"\n"}
            {"  "}<span className="keyword">if</span> <span className="function">len</span>(arr) &lt;= <span className="number">1</span>:{"\n"}
            {"    "}<span className="keyword">return</span> arr{"\n"}
            {"  "}mid = <span className="function">len</span>(arr) // <span className="number">2</span>{"\n"}
            {"  "}left = <span className="function">merge_sort</span>(arr[:mid]){"\n"}
            {"  "}right = <span className="function">merge_sort</span>(arr[mid:]){"\n"}
            {"  "}<span className="keyword">return</span> <span className="function">merge</span>(left, right)
          </code>
        </pre>
      </div>
    </div>
  );
}

function BentoChapters({ parentVisible }: { parentVisible: boolean }) {
  const chapters = FEATURED_ALGO.chapters.slice(0, 4);
  return (
    <div
      className={`reveal-stagger bento-card rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 ${parentVisible ? "visible" : ""}`}
      style={{ "--i": 2 } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--emerald-bg)] flex items-center justify-center">
          <BookOpen size={15} className="text-[var(--emerald)]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          Step-by-Step Chapters
        </h3>
      </div>
      <p className="text-xs text-[var(--ink-4)] mb-4">
        Each algorithm is explained in digestible sections.
      </p>
      <div className="space-y-2">
        {chapters.map((ch, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[var(--bg-warm)]/50 border border-[var(--border-light)]"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-4)] w-5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-xs text-[var(--ink-2)] font-medium truncate">
              {ch.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoComplexity({ parentVisible }: { parentVisible: boolean }) {
  return (
    <div
      className={`reveal-stagger bento-card rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 ${parentVisible ? "visible" : ""}`}
      style={{ "--i": 3 } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--amber-bg)] flex items-center justify-center">
          <BarChart3 size={15} className="text-[var(--amber)]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          Complexity Analysis
        </h3>
      </div>
      <p className="text-xs text-[var(--ink-4)] mb-4">
        Time and space complexity for every algorithm.
      </p>
      {/* Mini complexity table */}
      <div className="rounded-lg border border-[var(--border-light)] overflow-hidden text-[11px]">
        <div className="grid grid-cols-4 bg-[var(--bg-warm)]/50 px-3 py-1.5 border-b border-[var(--border-light)]">
          <span className="text-[var(--ink-4)]" />
          <span className="font-medium text-[var(--ink-3)]">Best</span>
          <span className="font-medium text-[var(--ink-3)]">Avg</span>
          <span className="font-medium text-[var(--ink-3)]">Worst</span>
        </div>
        {[
          { name: "Merge", b: "n log n", a: "n log n", w: "n log n" },
          { name: "Quick", b: "n log n", a: "n log n", w: "n\u00B2" },
          { name: "Bubble", b: "n", a: "n\u00B2", w: "n\u00B2" },
        ].map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-4 px-3 py-1.5 border-b border-[var(--border-light)] last:border-b-0"
          >
            <span className="font-medium text-[var(--ink-2)]">{row.name}</span>
            <span className="font-[family-name:var(--font-mono)] text-[var(--emerald)]">{row.b}</span>
            <span className="font-[family-name:var(--font-mono)] text-[var(--amber)]">{row.a}</span>
            <span className="font-[family-name:var(--font-mono)] text-[var(--rose)]">{row.w}</span>
          </div>
        ))}
      </div>
      <Link
        href="/compare"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] mt-3 hover:underline"
      >
        Compare all
        <ArrowUpRight size={11} aria-hidden="true" />
      </Link>
    </div>
  );
}

function BentoQuiz({ parentVisible }: { parentVisible: boolean }) {
  return (
    <div
      className={`reveal-stagger bento-card rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 ${parentVisible ? "visible" : ""}`}
      style={{ "--i": 4 } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--rose-bg)] flex items-center justify-center">
          <HelpCircle size={15} className="text-[var(--rose)]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          Test Your Knowledge
        </h3>
      </div>
      <p className="text-xs text-[var(--ink-4)] mb-4">
        Quizzes after every algorithm to reinforce learning.
      </p>
      {/* Mock quiz question */}
      <div className="rounded-lg border border-[var(--border-light)] p-3 bg-[var(--bg-warm)]/30">
        <p className="text-xs font-medium text-[var(--ink-2)] mb-2.5">
          What is the time complexity of Merge Sort?
        </p>
        <div className="space-y-1.5">
          {["O(n)", "O(n log n)", "O(n\u00B2)", "O(log n)"].map((opt, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] ${
                i === 1
                  ? "bg-[var(--emerald-bg)] text-[var(--emerald)] font-medium border border-[var(--emerald)]/20"
                  : "bg-[var(--bg-warm)] text-[var(--ink-3)]"
              }`}
            >
              {i === 1 && <CheckCircle2 size={11} aria-hidden="true" />}
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 3: Category Showcase ─────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function CategoryShowcase() {
  const reveal = useReveal(0.1);

  const activeCategories = CATEGORIES.filter(
    (c) => ALGORITHMS.filter((a) => a.category === c.id).length > 0
  );

  return (
    <section id="explore" className="py-20 sm:py-28 border-t border-[var(--border-light)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.visible ? "visible" : ""} mb-12 sm:mb-16`}
        >
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--ink-4)] mb-3">
            02 &mdash; Explore by category
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em]">
            9 categories, 55 algorithms
          </h2>
        </div>

        {/* Category rows */}
        <div className="space-y-1">
          {activeCategories.map((cat, i) => (
            <CategoryRow key={cat.id} category={cat} index={i} parentVisible={reveal.visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryRow({
  category,
  index,
  parentVisible,
}: {
  category: (typeof CATEGORIES)[number];
  index: number;
  parentVisible: boolean;
}) {
  const algos = ALGORITHMS.filter((a) => a.category === category.id);
  const preview = algos.slice(0, 4);

  return (
    <div
      className={`reveal-stagger ${parentVisible ? "visible" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="cat-row group rounded-xl px-4 sm:px-6 py-5 -mx-4 sm:-mx-6">
        {/* Top row: number + name + count + arrow */}
        <div className="flex items-center gap-4 mb-3">
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-4)] w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: category.color }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-[var(--ink)]">
              {category.name}
            </h3>
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-4)]">
              {algos.length}
            </span>
          </div>
          <Link
            href="#index"
            className="text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors shrink-0"
            aria-label={`View all ${category.name} algorithms`}
          >
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--ink-3)] ml-10 mb-3">
          {category.description}
        </p>

        {/* Algorithm pills */}
        <div className="flex flex-wrap gap-2 ml-10">
          {preview.map((algo) => (
            <Link
              key={algo.slug}
              href={`/algorithms/${algo.slug}`}
              className="algo-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-4)] bg-[var(--surface)]"
            >
              {algo.name}
            </Link>
          ))}
          {algos.length > 4 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-[var(--ink-4)]">
              +{algos.length - 4} more
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-light)] mt-5 ml-10" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 4: Featured Algorithm Deep-Dive ──────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function DeepDive() {
  const reveal = useReveal(0.1);
  const algo = FEATURED_ALGO;
  const cat = getCategoryInfo(algo.category);

  return (
    <section
      id="deep-dive"
      className="py-20 sm:py-28 border-t border-[var(--border-light)] grid-pattern"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.visible ? "visible" : ""} mb-12 sm:mb-16`}
        >
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--ink-4)] mb-3">
            03 &mdash; How it works
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em] mb-3">
            Every algorithm, explained
          </h2>
          <p className="text-[var(--ink-3)] text-base sm:text-lg max-w-2xl">
            Each algorithm comes with interactive visualizations, code in three languages,
            step-by-step explanations, and quizzes. Here&rsquo;s what a typical page looks like.
          </p>
        </div>

        {/* Split layout: product page preview */}
        <div className={`reveal ${reveal.visible ? "visible" : ""} grid lg:grid-cols-2 gap-6`} style={{ transitionDelay: "200ms" }}>
          {/* Left: Algorithm info */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            {/* Algorithm header */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: cat.color }}
                aria-hidden="true"
              />
              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-4)] font-medium">
                {cat.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink-4)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                {algo.difficulty}
              </span>
            </div>

            <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-[var(--ink)] mb-3">
              {algo.name}
            </h3>

            <p className="text-sm text-[var(--ink-3)] leading-relaxed mb-6">
              {algo.longDescription}
            </p>

            {/* Complexity mini-table */}
            <div className="rounded-lg border border-[var(--border-light)] overflow-hidden mb-6">
              <div className="grid grid-cols-4 text-[11px] bg-[var(--bg-warm)]/50 px-4 py-2 border-b border-[var(--border-light)] font-medium text-[var(--ink-3)]">
                <span>Metric</span>
                <span>Best</span>
                <span>Average</span>
                <span>Worst</span>
              </div>
              <div className="grid grid-cols-4 text-[11px] px-4 py-2 border-b border-[var(--border-light)]">
                <span className="text-[var(--ink-3)]">Time</span>
                <span className="font-[family-name:var(--font-mono)] text-[var(--emerald)]">{algo.complexity.time.best}</span>
                <span className="font-[family-name:var(--font-mono)] text-[var(--amber)]">{algo.complexity.time.average}</span>
                <span className="font-[family-name:var(--font-mono)] text-[var(--rose)]">{algo.complexity.time.worst}</span>
              </div>
              <div className="grid grid-cols-4 text-[11px] px-4 py-2">
                <span className="text-[var(--ink-3)]">Space</span>
                <span className="font-[family-name:var(--font-mono)] text-[var(--ink-2)] col-span-3">{algo.complexity.space}</span>
              </div>
            </div>

            {/* Chapters list */}
            <div className="space-y-2">
              {algo.chapters.map((ch, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--ink-4)] mt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="font-medium text-[var(--ink-2)]">{ch.title}</span>
                    <span className="text-[var(--ink-4)]"> &mdash; </span>
                    <span className="text-[var(--ink-3)]">{ch.content.slice(0, 80)}...</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/algorithms/${algo.slug}`}
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Open full page
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          {/* Right: Code */}
          <div className="code-card-border rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col">
            {/* Code header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-light)] bg-[var(--bg-warm)]/50">
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[var(--amber-bg)] text-[var(--amber)]">
                  Python
                </span>
                <span className="px-2.5 py-1 rounded text-[11px] font-medium text-[var(--ink-4)]">
                  JavaScript
                </span>
                <span className="px-2.5 py-1 rounded text-[11px] font-medium text-[var(--ink-4)]">
                  C++
                </span>
              </div>
              <Code2 size={14} className="text-[var(--ink-4)]" aria-hidden="true" />
            </div>
            {/* Code body */}
            <div className="flex-1 p-5 overflow-auto">
              <pre className="home-code font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.85] text-[var(--ink-2)]">
                <code>{`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 5: Stats Strip ───────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function StatsStrip() {
  const reveal = useReveal(0.15);

  const stats = [
    { value: "55+", label: "Algorithms", icon: Layers },
    { value: "6", label: "Visualizer types", icon: Play },
    { value: "3", label: "Languages per algo", icon: Code2 },
    { value: "\u221E", label: "Free forever", icon: Clock },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
      <div
        ref={reveal.ref}
        className={`reveal ${reveal.visible ? "visible" : ""} max-w-7xl mx-auto px-6 sm:px-8 lg:px-12`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="stat-shine rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-5 sm:p-6 text-center"
              >
                <Icon
                  size={18}
                  className="text-[var(--ink-4)] mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--ink-4)]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 6: Algorithm Index ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function AlgorithmIndex() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALGORITHMS.filter((a) => {
      const matchesCat = activeCategory ? a.category === activeCategory : true;
      const matchesQ = q
        ? a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [query, activeCategory]);

  const countByCategory = useMemo(() => {
    const q = query.toLowerCase().trim();
    const base = q
      ? ALGORITHMS.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        )
      : ALGORITHMS;
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) counts[cat.id] = 0;
    for (const a of base) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return counts;
  }, [query]);

  const handleCategoryClick = useCallback((id: Category) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof ALGORITHMS>();
    for (const cat of CATEGORIES) map.set(cat.id, []);
    for (const a of filtered) map.get(a.category)!.push(a);
    return map;
  }, [filtered]);

  const reveal = useReveal(0.1);

  return (
    <section id="index" className="py-20 sm:py-28 border-t border-[var(--border-light)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header + search */}
        <div
          ref={reveal.ref}
          className={`reveal ${reveal.visible ? "visible" : ""} mb-10`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--ink-4)] mb-3">
                04 &mdash; Full collection
              </p>
              <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em]">
                Algorithm Index
              </h2>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-4)] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 focus:border-[var(--accent)]/40 transition-all duration-200"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => (countByCategory[c.id] ?? 0) > 0).map(
              (cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "border-transparent text-white"
                      : "border-[var(--border)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-4)]"
                  }`}
                  style={
                    activeCategory === cat.id
                      ? { background: cat.color }
                      : undefined
                  }
                >
                  <CategoryIcon name={cat.icon} size={11} />
                  {cat.name}
                  <span
                    className={`tabular-nums ${
                      activeCategory === cat.id
                        ? "text-white/70"
                        : "text-[var(--ink-4)]"
                    }`}
                  >
                    {countByCategory[cat.id]}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Results count */}
        {(query || activeCategory) && (
          <p className="text-sm text-[var(--ink-4)] mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {query && (
              <span>
                {" "}for &ldquo;<span className="text-[var(--ink-2)]">{query}</span>&rdquo;
              </span>
            )}
            {activeCategory && (
              <span> in {getCategoryInfo(activeCategory).name}</span>
            )}
          </p>
        )}

        {/* Grouped algorithm list */}
        {CATEGORIES.filter(
          (cat) => (grouped.get(cat.id)?.length ?? 0) > 0
        ).map((cat) => {
          const algos = grouped.get(cat.id)!;
          return (
            <IndexGroup key={cat.id} category={cat} algorithms={algos} />
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="font-[family-name:var(--font-serif)] text-xl text-[var(--ink-3)] mb-2">
              Nothing found.
            </p>
            <p className="text-sm text-[var(--ink-4)]">
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function IndexGroup({
  category,
  algorithms,
}: {
  category: (typeof CATEGORIES)[number];
  algorithms: (typeof ALGORITHMS)[number][];
}) {
  const reveal = useReveal(0.05);

  return (
    <div
      ref={reveal.ref}
      className={`reveal ${reveal.visible ? "visible" : ""} mb-12 last:mb-0`}
    >
      {/* Category heading with rule */}
      <div className="flex items-center gap-4 mb-4">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: category.color }}
          aria-hidden="true"
        />
        <h3 className="font-[family-name:var(--font-serif)] text-base font-semibold text-[var(--ink)] shrink-0">
          {category.name}
        </h3>
        <div className="flex-1 h-px bg-[var(--border-light)]" />
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-4)] tabular-nums shrink-0">
          {algorithms.length}
        </span>
      </div>

      {/* Algorithm rows */}
      {algorithms.map((algo) => (
        <Link
          key={algo.slug}
          href={`/algorithms/${algo.slug}`}
          className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_130px_80px_20px] items-center gap-4 py-2.5 border-b border-[var(--border-light)] hover:bg-[var(--bg-warm)]/50 -mx-3 px-3 rounded transition-colors duration-150"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-medium text-sm text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors duration-150">
              {algo.name}
            </span>
            <span className="hidden lg:inline text-xs text-[var(--ink-4)] truncate">
              {algo.description}
            </span>
          </div>
          <span className="hidden sm:block font-[family-name:var(--font-mono)] text-xs text-[var(--ink-4)] text-right">
            {algo.complexity.time.average}
          </span>
          <span className="hidden sm:block text-[10px] uppercase tracking-wider text-[var(--ink-4)] text-right">
            {algo.difficulty}
          </span>
          <ArrowUpRight
            size={12}
            className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-150 justify-self-end"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── SECTION 7: CTA Footer ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function CTAFooter() {
  const reveal = useReveal(0.2);

  return (
    <section className="py-20 sm:py-28 cta-gradient">
      <div
        ref={reveal.ref}
        className={`reveal ${reveal.visible ? "visible" : ""} max-w-2xl mx-auto px-6 sm:px-8 text-center`}
      >
        <hr className="rule-fade mb-12" />
        <div className="w-12 h-12 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center mx-auto mb-6">
          <Zap size={20} className="text-[var(--accent)]" aria-hidden="true" />
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-[var(--ink)] leading-tight tracking-[-0.02em] mb-4">
          Start learning algorithms today
        </h2>
        <p className="text-[var(--ink-3)] text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          55 algorithms with interactive visualizations, code in three languages,
          and built-in quizzes. Completely free.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#index"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity duration-200"
          >
            Browse all algorithms
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border)] text-[var(--ink-2)] text-sm font-medium hover:border-[var(--ink-4)] hover:text-[var(--ink)] transition-all duration-200"
          >
            Compare complexities
          </Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Main Export ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

export function HomeContent() {
  return (
    <div className="grain-overlay">
      <HeroSection />
      <TickerBar />
      <BentoGrid />
      <Interstitial
        text="The best way to understand an algorithm is to watch it run. AlgoLab turns abstract pseudocode into something you can see, hear, and step through."
      />
      <CategoryShowcase />
      <DeepDive />
      <StatsStrip />
      <AlgorithmIndex />
      <CTAFooter />
    </div>
  );
}

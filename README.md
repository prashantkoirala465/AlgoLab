# AlgoLab

An interactive platform for learning algorithms through step-by-step visualizations, real code, and quizzes.

Built with Next.js 16, React 19, and TypeScript. No accounts, no paywalls.

## What's in here

- **55 algorithms** across 9 categories — sorting, searching, trees, graphs, linked lists, dynamic programming, greedy, backtracking, and more
- **6 visualizer types** — watch sorting bars swap, search pointers move, trees rebalance, graphs traverse, linked lists mutate, and DP tables fill in real time
- **Code in 3 languages** — every algorithm ships with C++, JavaScript, and Python implementations, syntax-highlighted with Shiki
- **Step-by-step chapters** — each algorithm has a structured walkthrough that breaks the concept into digestible sections
- **Complexity analysis** — best, average, and worst-case time/space complexity for every algorithm, with a comparison table at `/compare`
- **Built-in quizzes** — test yourself after each algorithm with multiple-choice questions
- **Progress tracking** — mark algorithms as done and track completion across sessions (stored locally)
- **Sound feedback** — the sort visualizer generates tones proportional to bar height as operations execute

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Compiler) |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Code highlighting | Shiki 4 (server-rendered) |
| Fonts | Inter, Source Serif 4, JetBrains Mono |
| Deployment | Static export, works on any CDN |

## Getting started

```bash
git clone https://github.com/prashantkoirala465/AlgoLab.git
cd AlgoLab
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    page.tsx                    # Landing page
    algorithms/[slug]/page.tsx  # 55 algorithm detail pages (SSG)
    compare/page.tsx            # Side-by-side complexity table
    globals.css                 # Design tokens, animations, dark mode
  components/
    home/                       # Landing page sections
    visualizers/                # Sort, search, tree, graph, linked list, DP
    ui/                         # CodeTabs, QuizPanel, CodeBlock
    layout/                     # Navbar, Footer, ThemeProvider
  data/
    algorithms.ts               # All 55 algorithm definitions
    categories.ts               # 9 category configs
    quizData.ts                 # Quiz questions per algorithm
  hooks/
    useSound.ts                 # Web Audio API tone generation
    useProgress.ts              # localStorage progress state
  lib/
    sortAlgorithms.ts           # Generator functions for 6 sort algorithms
```

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build (generates 61 static pages)
npm run start     # Serve production build
npm run lint      # ESLint
```

## Dark mode

Toggle in the navbar. Theme preference is saved to localStorage. The design system uses CSS custom properties mapped through Tailwind v4's `@theme inline` — no JavaScript theme classes needed beyond the `.dark` toggle on `<html>`.

## How the visualizers work

Each visualizer type uses a **generator function** pattern. The algorithm yields its state at every meaningful step (comparison, swap, insertion, etc.), and the visualizer consumes those steps at a configurable speed. Users can play, pause, step forward, step backward, and adjust speed.

The sort visualizer also generates audio feedback using the Web Audio API — each bar produces a tone proportional to its height when it's compared or swapped.

## Contributing

Open an issue or PR. The algorithm data lives in `src/data/algorithms.ts` — adding a new algorithm means adding an entry there and optionally writing a visualizer generator if a new type is needed.

## License

MIT

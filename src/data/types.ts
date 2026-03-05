export type Category =
  | 'sorting'
  | 'searching'
  | 'linked-lists'
  | 'trees'
  | 'graphs'
  | 'dynamic-programming'
  | 'greedy'
  | 'backtracking'
  | 'advanced';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type VisualizerType =
  | 'sort'
  | 'search'
  | 'tree'
  | 'graph'
  | 'linked-list'
  | 'dp'
  | 'none';

export interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface Complexity {
  time: TimeComplexity;
  space: string;
  stable?: boolean;
  inPlace?: boolean;
  adaptive?: boolean;
  online?: boolean;
}

export interface AlgorithmCode {
  cpp: string;
  js: string;
  python: string;
}

export interface Chapter {
  title: string;
  content: string; // plain text, can include newlines
}

export interface Algorithm {
  slug: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  description: string;       // 1-2 sentences for card
  longDescription: string;   // 2-4 sentences for hero
  tags: string[];
  complexity: Complexity;
  code: AlgorithmCode;
  visualizerType: VisualizerType;
  chapters: Chapter[];       // 3-5 chapters explaining the algorithm
  relatedAlgorithms: string[]; // slugs of related algorithms
}

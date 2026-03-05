import { Category } from './types';

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  color: string;     // hex color for accent
  bgColor: string;   // hex for background tint
  icon: string;      // lucide icon name
  order: number;     // display order
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    description: 'Algorithms that arrange elements in a specific order',
    color: '#6366f1',
    bgColor: '#eef2ff',
    icon: 'ArrowUpDown',
    order: 1,
  },
  {
    id: 'searching',
    name: 'Searching',
    description: 'Algorithms for finding elements in data structures',
    color: '#d97706',
    bgColor: '#fffbeb',
    icon: 'Search',
    order: 2,
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    description: 'Operations on linked node structures',
    color: '#0891b2',
    bgColor: '#ecfeff',
    icon: 'Link2',
    order: 3,
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Hierarchical data structures and their algorithms',
    color: '#10b981',
    bgColor: '#ecfdf5',
    icon: 'GitBranch',
    order: 4,
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'Graph traversal, shortest paths, and spanning trees',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    icon: 'Share2',
    order: 5,
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Optimization using memoization and tabulation',
    color: '#e11d48',
    bgColor: '#fff1f2',
    icon: 'LayoutGrid',
    order: 6,
  },
  {
    id: 'greedy',
    name: 'Greedy',
    description: 'Locally optimal choices that yield global solutions',
    color: '#06b6d4',
    bgColor: '#ecfeff',
    icon: 'TrendingUp',
    order: 7,
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    description: 'Exhaustive search with pruning',
    color: '#ea580c',
    bgColor: '#fff7ed',
    icon: 'CornerUpLeft',
    order: 8,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Tries, string matching, union-find, and more',
    color: '#64748b',
    bgColor: '#f8fafc',
    icon: 'Cpu',
    order: 9,
  },
];

export function getCategoryInfo(id: Category): CategoryInfo {
  return CATEGORIES.find(c => c.id === id)!;
}

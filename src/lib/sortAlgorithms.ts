// Sorting algorithm step generators
// Each generator yields SortStep arrays describing bar states

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'min';

export interface SortStep {
  array: number[];
  states: BarState[];  // per-index state
  description: string;
}

function* bubbleSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const states: BarState[] = new Array(n).fill('default');
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      states.fill('default');
      for (let k = n - i - 1; k < n; k++) states[k] = 'sorted';
      states[j] = 'comparing'; states[j + 1] = 'comparing';
      yield { array: [...a], states: [...states], description: `Compare a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}` };
      if (a[j] > a[j + 1]) {
        states[j] = 'swapping'; states[j + 1] = 'swapping';
        yield { array: [...a], states: [...states], description: `Swap ${a[j]} and ${a[j+1]}` };
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    states[n - i - 1] = 'sorted';
    if (!swapped) {
      for (let k = 0; k <= n - i - 1; k++) states[k] = 'sorted';
      yield { array: [...a], states: [...states], description: 'No swaps — array is sorted' };
      return;
    }
  }
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

function* selectionSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const states: BarState[] = new Array(n).fill('default');
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    states.fill('default');
    for (let k = 0; k < i; k++) states[k] = 'sorted';
    states[minIdx] = 'min';
    for (let j = i + 1; j < n; j++) {
      states[j] = 'comparing';
      yield { array: [...a], states: [...states], description: `Compare a[${j}]=${a[j]} with min=${a[minIdx]}` };
      if (a[j] < a[minIdx]) {
        states[minIdx] = 'default';
        minIdx = j;
        states[minIdx] = 'min';
      } else {
        states[j] = 'default';
      }
    }
    if (minIdx !== i) {
      states[i] = 'swapping'; states[minIdx] = 'swapping';
      yield { array: [...a], states: [...states], description: `Swap a[${i}]=${a[i]} with min a[${minIdx}]=${a[minIdx]}` };
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    states[i] = 'sorted';
  }
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

function* insertionSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const states: BarState[] = new Array(n).fill('default');
  states[0] = 'sorted';
  yield { array: [...a], states: [...states], description: 'First element is trivially sorted' };
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    states.fill('default');
    for (let k = 0; k < i; k++) states[k] = 'sorted';
    states[i] = 'comparing';
    yield { array: [...a], states: [...states], description: `Insert key=${key} into sorted portion` };
    while (j >= 0 && a[j] > key) {
      states[j + 1] = 'swapping'; states[j] = 'swapping';
      yield { array: [...a], states: [...states], description: `Shift a[${j}]=${a[j]} right` };
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    for (let k = 0; k <= i; k++) states[k] = 'sorted';
    yield { array: [...a], states: [...states], description: `Placed ${key} at index ${j+1}` };
  }
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

function* mergeSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const states: BarState[] = new Array(a.length).fill('default');
  function* merge(l: number, m: number, r: number): Generator<SortStep> {
    const L = a.slice(l, m + 1);
    const R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) {
      states.fill('default');
      for (let x = l; x <= r; x++) states[x] = 'comparing';
      yield { array: [...a], states: [...states], description: `Merge: comparing L[${i}]=${L[i]} and R[${j}]=${R[j]}` };
      if (L[i] <= R[j]) { a[k++] = L[i++]; } else { a[k++] = R[j++]; }
    }
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
    states.fill('default');
    for (let x = l; x <= r; x++) states[x] = 'sorted';
    yield { array: [...a], states: [...states], description: `Merged subarray [${l}..${r}]` };
  }
  function* sort(l: number, r: number): Generator<SortStep> {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    yield* sort(l, m);
    yield* sort(m + 1, r);
    yield* merge(l, m, r);
  }
  yield* sort(0, a.length - 1);
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

function* quickSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const states: BarState[] = new Array(a.length).fill('default');
  function* partition(l: number, r: number): Generator<SortStep, number> {
    const pivot = a[r];
    states[r] = 'pivot';
    yield { array: [...a], states: [...states], description: `Pivot = ${pivot} at index ${r}` };
    let i = l - 1;
    for (let j = l; j < r; j++) {
      states[j] = 'comparing';
      yield { array: [...a], states: [...states], description: `Compare a[${j}]=${a[j]} with pivot ${pivot}` };
      if (a[j] <= pivot) {
        i++;
        states[i] = 'swapping'; states[j] = 'swapping';
        yield { array: [...a], states: [...states], description: `Swap a[${i}]=${a[i]} and a[${j}]=${a[j]}` };
        [a[i], a[j]] = [a[j], a[i]];
      }
      states[j] = 'default';
    }
    states[i + 1] = 'swapping'; states[r] = 'swapping';
    [a[i + 1], a[r]] = [a[r], a[i + 1]];
    states[r] = 'default'; states[i + 1] = 'sorted';
    yield { array: [...a], states: [...states], description: `Pivot placed at index ${i+1}` };
    return i + 1;
  }
  function* sort(l: number, r: number): Generator<SortStep> {
    if (l >= r) {
      if (l === r) states[l] = 'sorted';
      return;
    }
    const p: number = yield* partition(l, r);
    yield* sort(l, p - 1);
    yield* sort(p + 1, r);
  }
  yield* sort(0, a.length - 1);
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

function* heapSortSteps(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const states: BarState[] = new Array(n).fill('default');
  function* heapify(size: number, root: number): Generator<SortStep> {
    let largest = root, l = 2 * root + 1, r = 2 * root + 2;
    states[root] = 'comparing';
    if (l < size) states[l] = 'comparing';
    if (r < size) states[r] = 'comparing';
    yield { array: [...a], states: [...states], description: `Heapify at ${root}: left=${l<size?a[l]:'—'} right=${r<size?a[r]:'—'}` };
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== root) {
      states[root] = 'swapping'; states[largest] = 'swapping';
      yield { array: [...a], states: [...states], description: `Swap a[${root}]=${a[root]} and a[${largest}]=${a[largest]}` };
      [a[root], a[largest]] = [a[largest], a[root]];
      states[root] = 'default'; states[largest] = 'default';
      yield* heapify(size, largest);
    } else {
      states[root] = 'default';
      if (l < size) states[l] = 'default';
      if (r < size) states[r] = 'default';
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    states[0] = 'swapping'; states[i] = 'swapping';
    yield { array: [...a], states: [...states], description: `Move max ${a[0]} to position ${i}` };
    [a[0], a[i]] = [a[i], a[0]];
    states[i] = 'sorted';
    yield* heapify(i, 0);
  }
  states.fill('sorted');
  yield { array: [...a], states: [...states], description: 'Array sorted!' };
}

// ─── Registry ────────────────────────────────────────────────────────────────

export type SortAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

export const SORT_GENERATORS: Record<SortAlgorithmId, (arr: number[]) => Generator<SortStep>> = {
  bubble: bubbleSortSteps,
  selection: selectionSortSteps,
  insertion: insertionSortSteps,
  merge: mergeSortSteps,
  quick: quickSortSteps,
  heap: heapSortSteps,
};

export const SORT_ALGORITHM_NAMES: Record<SortAlgorithmId, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
};

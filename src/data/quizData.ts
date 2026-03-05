export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  'bubble-sort': [
    {
      question: 'What is the average-case time complexity of Bubble Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctIndex: 2,
      explanation: 'Bubble Sort has O(n²) average time because it compares every pair in nested loops.',
    },
    {
      question: 'Bubble Sort is:',
      options: ['Unstable and in-place', 'Stable and in-place', 'Stable and not in-place', 'Unstable and not in-place'],
      correctIndex: 1,
      explanation: 'Bubble Sort only swaps adjacent elements when strictly out of order, preserving relative order of equal elements.',
    },
    {
      question: 'What is the best-case time complexity of Bubble Sort (with early exit)?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
      correctIndex: 2,
      explanation: 'With an "already sorted" check, Bubble Sort terminates after one pass — O(n).',
    },
  ],
  'selection-sort': [
    {
      question: 'What does Selection Sort do in each pass?',
      options: [
        'Swaps adjacent out-of-order elements',
        'Finds the minimum and places it in position',
        'Partitions the array around a pivot',
        'Merges two sorted halves',
      ],
      correctIndex: 1,
      explanation: 'Selection Sort finds the minimum in the unsorted portion and swaps it to its correct position.',
    },
    {
      question: 'Selection Sort makes how many swaps in the worst case for n elements?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
      correctIndex: 2,
      explanation: 'Despite O(n²) comparisons, Selection Sort makes at most n−1 swaps — one per pass.',
    },
    {
      question: 'Is Selection Sort stable?',
      options: ['Yes, always', 'No, not in the standard implementation', 'Only for integer arrays', 'Only when n is even'],
      correctIndex: 1,
      explanation: 'Standard Selection Sort is not stable — it can swap a minimum past an equal element.',
    },
  ],
  'insertion-sort': [
    {
      question: 'Insertion Sort is most efficient when:',
      options: ['Data is randomly shuffled', 'Data is nearly sorted', 'Data is in reverse order', 'Data has many duplicates'],
      correctIndex: 1,
      explanation: 'For nearly sorted arrays Insertion Sort runs close to O(n) because elements shift very little.',
    },
    {
      question: 'What is the worst-case time complexity of Insertion Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctIndex: 2,
      explanation: 'Reverse-sorted input forces every element to shift all the way left — O(n²).',
    },
    {
      question: 'Which real-world use case favors Insertion Sort?',
      options: ['Sorting a billion records', 'Sorting a hand of playing cards online', 'Database bulk inserts', 'External merge sort'],
      correctIndex: 1,
      explanation: 'Small or nearly-sorted sequences like a hand of cards are the classic home for Insertion Sort.',
    },
  ],
  'merge-sort': [
    {
      question: 'Merge Sort follows which paradigm?',
      options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
      correctIndex: 2,
      explanation: 'Merge Sort divides the array, recursively sorts each half, then merges — classic divide and conquer.',
    },
    {
      question: 'What is the space complexity of standard Merge Sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Merge Sort requires O(n) auxiliary space for the temporary arrays used during merging.',
    },
    {
      question: 'Merge Sort is preferred over Quick Sort when:',
      options: ['Memory is very limited', 'Stable sorting is required', 'Cache performance is critical', 'The array is small'],
      correctIndex: 1,
      explanation: 'Merge Sort is stable; Quick Sort in its standard form is not, making Merge Sort better when equal elements must retain order.',
    },
  ],
  'quick-sort': [
    {
      question: "Quick Sort's worst-case time complexity is:",
      options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'Worst case occurs when the pivot is always the smallest or largest — O(n²) — e.g., sorted input with a naive pivot.',
    },
    {
      question: "Which pivot strategy avoids Quick Sort's worst case in practice?",
      options: ['Always pick the first element', 'Always pick the last element', 'Median-of-three', 'Pick index n/3'],
      correctIndex: 2,
      explanation: 'Median-of-three picks the median of first, middle, and last elements, avoiding degenerate pivots on sorted inputs.',
    },
    {
      question: 'Quick Sort is generally preferred over Merge Sort for in-memory sorting because:',
      options: ['It is always O(n log n)', 'It is stable', 'It has better cache locality', 'It uses O(n) space'],
      correctIndex: 2,
      explanation: "Quick Sort's in-place partitioning accesses memory sequentially, giving it superior cache performance.",
    },
  ],
  'heap-sort': [
    {
      question: 'Heap Sort uses which data structure?',
      options: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'],
      correctIndex: 2,
      explanation: 'Heap Sort builds a max-heap and repeatedly extracts the maximum to produce a sorted array.',
    },
    {
      question: 'What is the time complexity of building a heap (heapify)?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
      correctIndex: 2,
      explanation: 'Building a heap bottom-up is O(n) — the amortized cost per node decreases with depth.',
    },
    {
      question: 'Heap Sort is:',
      options: ['Stable and in-place', 'Unstable and not in-place', 'Stable and not in-place', 'Unstable and in-place'],
      correctIndex: 3,
      explanation: 'Heap Sort sorts in-place (O(1) extra space) but is not stable due to the heap swaps.',
    },
  ],
  'binary-search': [
    {
      question: 'Binary Search requires the input to be:',
      options: ['Unsorted', 'Sorted', 'Distinct', 'Stored in a hash table'],
      correctIndex: 1,
      explanation: 'Binary Search eliminates half the search space each step by comparing with the middle element — only valid on sorted data.',
    },
    {
      question: 'What is the time complexity of Binary Search?',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correctIndex: 2,
      explanation: 'Each comparison halves the remaining search space, giving O(log n) comparisons.',
    },
    {
      question: 'Binary Search can be applied to:',
      options: ['Only arrays', 'Any data structure with O(1) random access', 'Sorted linked lists efficiently', 'Unsorted arrays with hashing'],
      correctIndex: 1,
      explanation: 'Efficient binary search needs O(1) index access; linked lists lack this, making binary search O(n) on them.',
    },
  ],
  'linear-search': [
    {
      question: 'Linear Search is preferred over Binary Search when:',
      options: ['The array is sorted', 'The array is small or unsorted', 'n > 10⁶', 'Memory is unlimited'],
      correctIndex: 1,
      explanation: 'For small or unsorted arrays, the overhead of sorting for binary search outweighs its benefits.',
    },
    {
      question: 'What is the worst-case time complexity of Linear Search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'In the worst case, Linear Search must check every element — O(n).',
    },
    {
      question: 'Linear Search on an unsorted array finds:',
      options: ['The minimum element', 'The first occurrence of the target', 'The median element', 'A random occurrence'],
      correctIndex: 1,
      explanation: 'Linear Search scans from left to right and returns the first match.',
    },
  ],
  'bfs': [
    {
      question: 'BFS uses which data structure?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Deque'],
      correctIndex: 1,
      explanation: 'BFS processes nodes level by level using a FIFO queue.',
    },
    {
      question: 'BFS on an unweighted graph finds:',
      options: ['The longest path', 'The shortest path in hops', 'A topological order', 'A minimum spanning tree'],
      correctIndex: 1,
      explanation: 'BFS expands nodes by distance, so the first time it reaches a node it has found the shortest hop-count path.',
    },
    {
      question: 'Time complexity of BFS is:',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
      correctIndex: 2,
      explanation: 'BFS visits each vertex once and each edge once — O(V + E).',
    },
  ],
  'dfs': [
    {
      question: 'DFS uses which data structure (or technique)?',
      options: ['Queue', 'Stack or recursion', 'Priority Queue', 'Hash Set only'],
      correctIndex: 1,
      explanation: 'DFS explores as deep as possible using a stack (or the call stack via recursion).',
    },
    {
      question: 'DFS is commonly used for:',
      options: ['Shortest path in unweighted graphs', 'Cycle detection and topological sort', 'Finding connected components only', 'Minimum spanning tree'],
      correctIndex: 1,
      explanation: 'DFS is ideal for cycle detection, topological ordering, and exploring maze-like structures.',
    },
    {
      question: 'What is the time complexity of DFS?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V log V)'],
      correctIndex: 2,
      explanation: 'DFS visits each vertex and edge exactly once — O(V + E).',
    },
  ],
  'dijkstra': [
    {
      question: "Dijkstra's algorithm cannot handle:",
      options: ['Directed graphs', 'Negative edge weights', 'Disconnected graphs', 'Dense graphs'],
      correctIndex: 1,
      explanation: "Dijkstra's greedy relaxation fails with negative weights — use Bellman-Ford instead.",
    },
    {
      question: "With a binary min-heap, Dijkstra's time complexity is:",
      options: ['O(V²)', 'O((V + E) log V)', 'O(V log V + E)', 'O(E log E)'],
      correctIndex: 1,
      explanation: 'Each of the V extractions costs O(log V) and each of the E relaxations costs O(log V) — total O((V + E) log V).',
    },
    {
      question: "Dijkstra's algorithm is a:",
      options: ['Dynamic Programming approach', 'Greedy approach', 'Divide and Conquer approach', 'Backtracking approach'],
      correctIndex: 1,
      explanation: 'Dijkstra greedily picks the unvisited node with the smallest tentative distance at each step.',
    },
  ],
  'fibonacci': [
    {
      question: 'What does memoization add to naive recursive Fibonacci?',
      options: ['Worse space complexity', 'Reduced time from O(2ⁿ) to O(n)', 'Worse time complexity', 'Sorting capability'],
      correctIndex: 1,
      explanation: 'Memoization caches subproblem results, eliminating redundant calls and reducing time to O(n).',
    },
    {
      question: 'Bottom-up DP for Fibonacci uses:',
      options: ['Recursion with memoization', 'An iterative loop building from base cases', 'Divide and conquer', 'A priority queue'],
      correctIndex: 1,
      explanation: 'Tabulation fills dp[0], dp[1], …, dp[n] iteratively — no recursion needed.',
    },
    {
      question: 'Space-optimized Fibonacci DP uses:',
      options: ['O(n) space', 'O(log n) space', 'O(1) space', 'O(n²) space'],
      correctIndex: 2,
      explanation: 'Only the last two values are needed to compute the next — O(1) space.',
    },
  ],
  'knapsack': [
    {
      question: 'The 0/1 Knapsack problem is called "0/1" because:',
      options: ['Items have 0 or 1 weight', 'Each item is either taken fully or not at all', 'The capacity is binary', 'Solutions are binary strings'],
      correctIndex: 1,
      explanation: 'Each item can be included exactly once (1) or excluded (0) — no fractions allowed.',
    },
    {
      question: 'The DP recurrence for 0/1 Knapsack is:',
      options: [
        'dp[i][w] = dp[i-1][w] + values[i]',
        'dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])',
        'dp[i][w] = dp[i][w-1] + dp[i-1][w]',
        'dp[i][w] = min(dp[i-1][w], dp[i][w-1])',
      ],
      correctIndex: 1,
      explanation: 'Either skip item i (take dp[i-1][w]) or include it (take dp[i-1][w-weight[i]] + value[i]).',
    },
    {
      question: 'Time and space complexity of the DP Knapsack solution are:',
      options: ['O(n²) time, O(1) space', 'O(nW) time, O(nW) space', 'O(n log n) time, O(n) space', 'O(2ⁿ) time, O(n) space'],
      correctIndex: 1,
      explanation: 'The table has n×W cells, each computed in O(1) — O(nW) time and space.',
    },
  ],
  'lcs': [
    {
      question: 'LCS stands for:',
      options: ['Largest Common Subsequence', 'Longest Common Substring', 'Longest Common Subsequence', 'Least Common Set'],
      correctIndex: 2,
      explanation: 'LCS = Longest Common Subsequence — elements need not be contiguous but must appear in order.',
    },
    {
      question: 'The time complexity of the DP LCS algorithm for strings of length m and n is:',
      options: ['O(m + n)', 'O(m × n)', 'O(m log n)', 'O(2^(m+n))'],
      correctIndex: 1,
      explanation: 'The DP table is m×n and each cell is computed in O(1).',
    },
    {
      question: 'If a[i] == b[j] in the LCS recurrence, dp[i][j] equals:',
      options: ['max(dp[i-1][j], dp[i][j-1])', 'dp[i-1][j-1]', 'dp[i-1][j-1] + 1', '1'],
      correctIndex: 2,
      explanation: 'A match extends the LCS found so far — dp[i][j] = dp[i-1][j-1] + 1.',
    },
  ],
  'binary-search-tree': [
    {
      question: 'In a BST, for any node N:',
      options: [
        'Left subtree values > N, right subtree values < N',
        'Left subtree values < N, right subtree values > N',
        'All subtree values equal N',
        'Left subtree has more nodes than right',
      ],
      correctIndex: 1,
      explanation: 'BST property: left child < parent < right child, enabling binary search at each node.',
    },
    {
      question: 'Inorder traversal of a BST produces:',
      options: ['Random order', 'Values in sorted ascending order', 'Values in reverse sorted order', 'Level-order values'],
      correctIndex: 1,
      explanation: 'Left → Root → Right traversal visits BST nodes in non-decreasing order.',
    },
    {
      question: 'Search in a balanced BST takes:',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctIndex: 1,
      explanation: 'A balanced BST has height O(log n), so search eliminates half the tree per step.',
    },
  ],
};

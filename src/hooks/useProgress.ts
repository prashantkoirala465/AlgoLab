'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'algolab:progress';

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveProgress(slugs: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]));
  } catch {}
}

export function useProgress() {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDone(loadProgress());
  }, []);

  const markDone = useCallback((slug: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.add(slug);
      saveProgress(next);
      return next;
    });
  }, []);

  const unmark = useCallback((slug: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.delete(slug);
      saveProgress(next);
      return next;
    });
  }, []);

  const toggle = useCallback((slug: string) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      saveProgress(next);
      return next;
    });
  }, []);

  const isDone = (slug: string) => done.has(slug);
  const count = done.size;

  return { isDone, markDone, unmark, toggle, count };
}

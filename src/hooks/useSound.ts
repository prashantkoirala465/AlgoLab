'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export function useSound() {
  const actxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  /**
   * Create or resume the AudioContext.
   * MUST be called synchronously inside a user-gesture handler (e.g. onClick)
   * so the browser allows it. Subsequent calls from timeouts are fine once
   * the context exists and is running.
   */
  const ensureAudio = useCallback(() => {
    if (!actxRef.current) {
      actxRef.current = new (
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext
      )();
    }
    if (actxRef.current.state === 'suspended') actxRef.current.resume();
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType, vol: number) => {
      if (mutedRef.current || reducedMotionRef.current || !actxRef.current)
        return;
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
    },
    []
  );

  /**
   * Play a sweep tone whose pitch maps to bar value (200-1000 Hz).
   * Safe to call from setTimeout — does NOT create AudioContext.
   */
  const sndSweep = useCallback(
    (value: number, max: number) => {
      tone(200 + (value / max) * 800, 0.035, 'sine', 0.035);
    },
    [tone]
  );

  /**
   * Play a 4-note victory chord when sorting completes.
   */
  const sndDone = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => tone(f, 0.22, 'sine', 0.07), i * 120)
    );
  }, [tone]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMute, ensureAudio, sndSweep, sndDone };
}

import { useEffect, useRef, useState } from 'react';
import type { Signal } from '../data/signals';

export type TextSpeed = 'slow' | 'normal' | 'fast';

const speedConfig: Record<TextSpeed, { tickMs: number; charsPerTick: number }> = {
  // Roughly 10 chars/sec, close to classic 100 baud TTY throughput.
  slow: { tickMs: 95, charsPerTick: 1 },
  normal: { tickMs: 75, charsPerTick: 2 },
  fast: { tickMs: 50, charsPerTick: 3 }
};

const MAX_LINES = 16;

const applyChunk = (previous: string[], chunk: string) => {
  let next = [...previous];
  if (next.length === 0) next = [''];

  for (const char of chunk) {
    if (char === '\r') continue;
    if (char === '\n') {
      next.push('');
      if (next.length > MAX_LINES) next = next.slice(next.length - MAX_LINES);
      continue;
    }
    next[next.length - 1] = `${next[next.length - 1] ?? ''}${char}`;
  }

  return next;
};

const garble = (line: string, clarity: number) => {
  if (clarity >= 0.75) return line;
  const chars = line.split('');
  return chars
    .map((c) => {
      const roll = Math.random();
      if (roll > clarity) {
        if (c === ' ') return Math.random() > 0.5 ? '' : ' ';
        if (c === 'E') return 'I';
        if (c === 'I') return 'E';
        if (c === 'T') return '5';
        if (c === 'O') return '0';
        if (c === 'S') return '5';
        return '?';
      }
      return c;
    })
    .join('');
};

const randomNoise = () => {
  const base = ['...RYRY...', '...QRM...', '...'];
  const random = Array.from({ length: 8 })
    .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)])
    .join('');
  return Math.random() > 0.6 ? random : base[Math.floor(Math.random() * base.length)];
};

export function useStreamingText(signal: Signal | undefined, clarity: number, speed: TextSpeed) {
  const [lines, setLines] = useState<string[]>(['WATCH RECEIVER READY', '']);
  const lineIndex = useRef(0);
  const queuedLine = useRef('');
  const queueIndex = useRef(0);
  const interLinePause = useRef(0);
  const noiseTicker = useRef(0);

  useEffect(() => {
    lineIndex.current = 0;
    queuedLine.current = '';
    queueIndex.current = 0;
    interLinePause.current = 0;
    noiseTicker.current = 0;
    setLines((prev: string[]) => [
      ...prev.slice(-8),
      signal ? `LOCK ${signal.station} ${signal.frequencyKhz.toFixed(1)}kHz` : 'SEARCHING BAND...',
      ''
    ]);
  }, [signal?.id]);

  useEffect(() => {
    const { tickMs, charsPerTick } = speedConfig[speed];
    const timer = setInterval(() => {
      if (!signal || clarity < 0.18) {
        noiseTicker.current += 1;
        if (noiseTicker.current >= 8) {
          noiseTicker.current = 0;
          setLines((prev: string[]) => applyChunk(prev, `${randomNoise()}\n`));
        }
        return;
      }
      noiseTicker.current = 0;

      if (interLinePause.current > 0) {
        interLinePause.current -= 1;
        return;
      }

      if (queueIndex.current >= queuedLine.current.length) {
        const nextLine = signal.lines[lineIndex.current % signal.lines.length];
        const cut = Math.random() < 0.2 ? Math.max(6, Math.floor(nextLine.length * 0.65)) : nextLine.length;
        queuedLine.current = `${garble(nextLine.slice(0, cut), clarity)}\n`;
        queueIndex.current = 0;
        interLinePause.current = Math.floor(Math.random() * 4) + 2;
        lineIndex.current += 1;
        return;
      }

      const chunk = queuedLine.current.slice(queueIndex.current, queueIndex.current + charsPerTick);
      queueIndex.current += charsPerTick;
      setLines((prev: string[]) => applyChunk(prev, chunk));
    }, tickMs);

    return () => clearInterval(timer);
  }, [signal, clarity, speed]);

  return lines;
}

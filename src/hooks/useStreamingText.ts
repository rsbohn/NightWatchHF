import { useEffect, useRef, useState } from 'react';
import type { Signal } from '../data/signals';

export type TextSpeed = 'slow' | 'normal' | 'fast';

const speedToMs: Record<TextSpeed, number> = { slow: 1200, normal: 900, fast: 700 };

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
  const [lines, setLines] = useState<string[]>(['WATCH RECEIVER READY']);
  const lineIndex = useRef(0);

  useEffect(() => {
    lineIndex.current = 0;
    setLines((prev: string[]) => [...prev.slice(-8), signal ? `LOCK ${signal.station} ${signal.frequencyKhz.toFixed(1)}kHz` : 'SEARCHING BAND...']);
  }, [signal?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!signal || clarity < 0.18) {
        setLines((prev: string[]) => [...prev.slice(-15), randomNoise()]);
        return;
      }

      const nextLine = signal.lines[lineIndex.current % signal.lines.length];
      const cut = Math.random() < 0.2 ? Math.max(6, Math.floor(nextLine.length * 0.65)) : nextLine.length;
      setLines((prev: string[]) => [...prev.slice(-15), garble(nextLine.slice(0, cut), clarity)]);
      lineIndex.current += 1;
    }, speedToMs[speed]);

    return () => clearInterval(timer);
  }, [signal, clarity, speed]);

  return lines;
}

import { useEffect, useMemo, useState } from 'react';
import { activeFrequencies, signals } from '../data/signals';

const STEPS = [0.5, 1.0, 5.0];

export function useReceiver() {
  const [frequency, setFrequency] = useState(8416.0);
  const [stepIndex, setStepIndex] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [holdUntil, setHoldUntil] = useState(0);

  useEffect(() => {
    if (!isScanning) return;
    let idx = activeFrequencies.findIndex((f) => f >= frequency);
    const timer = setInterval(() => {
      idx = (idx + 1) % activeFrequencies.length;
      setFrequency(activeFrequencies[idx]);
    }, 1200);
    return () => clearInterval(timer);
  }, [isScanning, frequency]);

  const tunedSignal = useMemo(() => {
    const nearby = signals
      .map((signal) => ({ signal, distance: Math.abs(signal.frequencyKhz - frequency) }))
      .filter(({ distance }) => distance <= 1.0)
      .sort((a, b) => a.distance - b.distance);
    return nearby[0]?.signal;
  }, [frequency]);

  const distance = tunedSignal ? Math.abs(tunedSignal.frequencyKhz - frequency) : 3;
  const holdBoost = Date.now() < holdUntil ? 0.2 : 0;
  const clarity = Math.max(0, Math.min(1, 1 - distance + holdBoost));
  const signalMeter = Math.max(1, Math.min(9, Math.round((tunedSignal?.signalStrength ?? 1) * clarity)));
  const noiseMeter = Math.max(1, Math.min(9, Math.round((tunedSignal?.noise ?? 6) + (1 - clarity) * 3)));

  return {
    frequency,
    mode: tunedSignal?.mode ?? 'USB',
    tunedSignal,
    clarity,
    signalMeter,
    noiseMeter,
    step: STEPS[stepIndex],
    isScanning,
    tuneUp: () => setFrequency((f: number) => Number((f + STEPS[stepIndex]).toFixed(1))),
    tuneDown: () => setFrequency((f: number) => Number((f - STEPS[stepIndex]).toFixed(1))),
    cycleStep: () => setStepIndex((v: number) => (v + 1) % STEPS.length),
    toggleScan: () => setIsScanning((v: boolean) => !v),
    hold: () => setHoldUntil(Date.now() + 7000)
  };
}

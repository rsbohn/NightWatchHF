import { useEffect, useRef, useState } from 'react';

export function useAudio(enabled: boolean) {
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext>();
  const oscRef = useRef<OscillatorNode>();
  const gainRef = useRef<GainNode>();

  const unlock = async () => {
    if (!enabled) return;
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 340;
      filter.type = 'bandpass';
      filter.frequency.value = 900;
      gain.gain.value = 0.0001;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ctxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
    }
    await ctxRef.current.resume();
    setReady(true);
  };

  const setSignal = (strength: number) => {
    if (!ready || !enabled || !gainRef.current || !oscRef.current) return;
    const now = ctxRef.current!.currentTime;
    gainRef.current.gain.linearRampToValueAtTime(Math.min(0.03, strength / 300), now + 0.15);
    oscRef.current.frequency.linearRampToValueAtTime(280 + strength * 20, now + 0.15);
  };

  const click = () => {
    if (!ready || !enabled || !ctxRef.current) return;
    const osc = ctxRef.current.createOscillator();
    const gain = ctxRef.current.createGain();
    osc.frequency.value = 1200;
    gain.gain.value = 0.012;
    osc.connect(gain);
    gain.connect(ctxRef.current.destination);
    osc.start();
    osc.stop(ctxRef.current.currentTime + 0.03);
  };

  useEffect(
    () => () => {
      oscRef.current?.stop();
      ctxRef.current?.close();
    },
    []
  );

  return { ready, unlock, setSignal, click };
}

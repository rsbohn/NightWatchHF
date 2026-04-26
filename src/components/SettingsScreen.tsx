import type { ChangeEvent } from 'react';
import type { TextSpeed } from '../hooks/useStreamingText';

interface SettingsProps {
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  textSpeed: TextSpeed;
  setTextSpeed: (v: TextSpeed) => void;
  theme: 'amber' | 'green';
  setTheme: (v: 'amber' | 'green') => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  resetLogbook: () => void;
}

export function SettingsScreen(props: SettingsProps) {
  return (
    <section className="screen">
      <div className="panel settings">
        <label><input type="checkbox" checked={props.audioEnabled} onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAudioEnabled(e.target.checked)} /> Audio</label>
        <label>Text speed
          <select value={props.textSpeed} onChange={(e: ChangeEvent<HTMLSelectElement>) => props.setTextSpeed(e.target.value as TextSpeed)}>
            <option value="slow">TTY 100 baud</option>
            <option value="normal">TTY 300 baud</option>
            <option value="fast">High-speed copy</option>
          </select>
        </label>
        <label>Theme
          <select value={props.theme} onChange={(e: ChangeEvent<HTMLSelectElement>) => props.setTheme(e.target.value as 'amber' | 'green')}>
            <option value="amber">Amber</option><option value="green">Green</option>
          </select>
        </label>
        <label><input type="checkbox" checked={props.reducedMotion} onChange={(e: ChangeEvent<HTMLInputElement>) => props.setReducedMotion(e.target.checked)} /> Reduced motion</label>
        <button onClick={props.resetLogbook}>Reset logbook</button>
      </div>
    </section>
  );
}

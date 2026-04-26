export function FrequencyDisplay({ frequency, mode }: { frequency: number; mode: string }) {
  return (
    <div className="freq-wrap panel">
      <div className="freq">{frequency.toFixed(1)} kHz</div>
      <span className="mode-pill">{mode}</span>
      <button className="star" aria-label="favorite">☆</button>
    </div>
  );
}

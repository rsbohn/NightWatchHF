export function Meter({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="meter panel">
      <div className="meter-label">{label}</div>
      <div className="meter-bar">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={i < value ? `on ${danger ? 'danger' : ''}` : ''} />
        ))}
      </div>
    </div>
  );
}

export function ReceivePane({ lines, distress }: { lines: string[]; distress?: boolean }) {
  return (
    <div className={`receive panel ${distress ? 'distress' : ''}`}>
      {lines.slice(-12).map((line, i) => (
        <p key={`${line}-${i}`}>{line}</p>
      ))}
    </div>
  );
}

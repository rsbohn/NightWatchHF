export function ReceivePane({ lines, distress }: { lines: string[]; distress?: boolean }) {
  const viewLines = lines.slice(-12);

  return (
    <div className={`receive panel ${distress ? 'distress' : ''}`}>
      {viewLines.map((line, i) => (
        <p key={`${line}-${i}`} className={i === viewLines.length - 1 ? 'active-line' : undefined}>
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
}

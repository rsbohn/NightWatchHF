export function Spectrum({ clarity }: { clarity: number }) {
  return (
    <div className="spectrum panel">
      {Array.from({ length: 28 }).map((_, i) => {
        const h = 18 + Math.sin((i / 4) * Math.PI) * 10 + Math.random() * 20 + clarity * 26;
        return <span key={i} style={{ height: `${Math.max(8, h)}px` }} />;
      })}
    </div>
  );
}

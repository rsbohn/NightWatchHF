export function MapScreen({ utc }: { utc: string }) {
  return (
    <section className="screen">
      <div className="panel map-panel">
        <div className="world" />
        <span style={{ left: '20%', top: '45%' }}>NMC</span>
        <span style={{ left: '24%', top: '40%' }}>WLO</span>
        <span style={{ left: '17%', top: '53%' }}>KLB</span>
        <span style={{ left: '60%', top: '30%' }}>CFH</span>
        <span style={{ left: '32%', top: '58%' }}>NMG</span>
        <svg viewBox="0 0 300 180" aria-hidden>
          <path d="M55 85 Q135 20 210 45" />
          <path d="M60 95 Q150 130 240 90" />
          <path d="M85 100 Q160 40 205 105" />
        </svg>
      </div>
      <div className="panel conditions">
        <p>Solar Flux: 126</p><p>A Index: 8</p><p>K Index: 3</p>
        <p>UTC: {utc}</p><p>Day: 116</p><p>SSN: 88</p>
      </div>
    </section>
  );
}

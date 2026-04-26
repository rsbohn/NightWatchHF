import type { SignalType } from '../data/signals';
import type { LogEntry } from '../App';

const tabs: Array<{ id: 'all' | 'stations' | 'weather' | 'alerts'; label: string }> = [
  { id: 'all', label: 'ALL' },
  { id: 'stations', label: 'STATIONS' },
  { id: 'weather', label: 'WEATHER' },
  { id: 'alerts', label: 'ALERTS' }
];

const inFilter = (type: SignalType, filter: string) => {
  if (filter === 'all') return true;
  if (filter === 'weather') return type === 'weather';
  if (filter === 'alerts') return type === 'distress' || type === 'anomaly';
  return type === 'routine' || type === 'traffic';
};

export function LogbookScreen({ logs, filter, setFilter }: { logs: LogEntry[]; filter: 'all' | 'stations' | 'weather' | 'alerts'; setFilter: (v: 'all' | 'stations' | 'weather' | 'alerts') => void }) {
  return (
    <section className="screen">
      <div className="tabs panel">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setFilter(tab.id)} className={filter === tab.id ? 'active' : ''}>{tab.label}</button>
        ))}
      </div>
      <div className="log-list">
        {logs.filter((l) => inFilter(l.type, filter)).map((log) => (
          <article key={log.id} className="panel log-card">
            <header>
              <strong>{log.station}</strong>
              <span>{log.utc}</span>
            </header>
            <p>{log.frequency.toFixed(1)} kHz • {log.mode} • S{log.signal}</p>
            <p>{log.summary}</p>
            <p className="mono">{log.snippet}</p>
            <p>{log.starred ? '★ Starred' : '☆ Unstarred'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

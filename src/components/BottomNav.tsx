export type Tab = 'receiver' | 'logbook' | 'map' | 'settings';

const labels: Record<Tab, string> = {
  receiver: 'Receiver',
  logbook: 'Logbook',
  map: 'Map',
  settings: 'Settings'
};

export function BottomNav({ tab, onSelect }: { tab: Tab; onSelect: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav">
      {(Object.keys(labels) as Tab[]).map((item) => (
        <button key={item} className={tab === item ? 'active' : ''} onClick={() => onSelect(item)}>
          {labels[item]}
        </button>
      ))}
    </nav>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { LogbookScreen } from './components/LogbookScreen';
import { MapScreen } from './components/MapScreen';
import { PhoneShell } from './components/PhoneShell';
import { ReceiverScreen } from './components/ReceiverScreen';
import { SettingsScreen } from './components/SettingsScreen';
import type { SignalType } from './data/signals';
import { useAudio } from './hooks/useAudio';
import { useReceiver } from './hooks/useReceiver';
import { type TextSpeed, useStreamingText } from './hooks/useStreamingText';

export interface LogEntry {
  id: string;
  utc: string;
  station: string;
  frequency: number;
  mode: 'USB' | 'LSB';
  signal: number;
  summary: string;
  snippet: string;
  starred: boolean;
  type: SignalType;
}

const LOG_KEY = 'nightwatch-logbook-v1';

function App() {
  const [tab, setTab] = useState<Tab>('receiver');
  const [logbook, setLogbook] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem(LOG_KEY);
    return saved ? (JSON.parse(saved) as LogEntry[]) : [];
  });
  const [logFilter, setLogFilter] = useState<'all' | 'stations' | 'weather' | 'alerts'>('all');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [theme, setTheme] = useState<'amber' | 'green'>('amber');
  const [textSpeed, setTextSpeed] = useState<TextSpeed>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [utc, setUtc] = useState(new Date().toISOString().slice(11, 16) + 'Z');

  const receiver = useReceiver();
  const stream = useStreamingText(receiver.tunedSignal, receiver.clarity, textSpeed);
  const audio = useAudio(audioEnabled);

  useEffect(() => {
    const t = setInterval(() => setUtc(new Date().toISOString().slice(11, 16) + 'Z'), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logbook));
  }, [logbook]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'normal';
  }, [theme, reducedMotion]);

  useEffect(() => {
    audio.setSignal(receiver.signalMeter);
  }, [receiver.signalMeter, audioEnabled, audio.ready]);

  const canLog = !!receiver.tunedSignal;
  const sortedLogs = useMemo(() => [...logbook].sort((a, b) => (a.utc < b.utc ? 1 : -1)), [logbook]);

  const logCurrent = () => {
    if (!receiver.tunedSignal) return;
    audio.unlock();
    const snippet = stream.slice(-3).join(' | ').slice(0, 120);
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      utc,
      station: receiver.tunedSignal.station,
      frequency: receiver.frequency,
      mode: receiver.tunedSignal.mode,
      signal: receiver.signalMeter,
      summary: receiver.tunedSignal.summary,
      snippet,
      starred: receiver.tunedSignal.type === 'distress' || receiver.tunedSignal.type === 'anomaly',
      type: receiver.tunedSignal.type
    };
    setLogbook((prev: LogEntry[]) => [entry, ...prev]);
  };

  return (
    <PhoneShell>
      {!audio.ready && audioEnabled && (
        <button className="audio-unlock" onClick={audio.unlock}>Enable Audio</button>
      )}
      {tab === 'receiver' && (
        <ReceiverScreen
          utc={utc}
          frequency={receiver.frequency}
          mode={receiver.mode}
          signalMeter={receiver.signalMeter}
          noiseMeter={receiver.noiseMeter}
          lines={stream}
          signal={receiver.tunedSignal}
          step={receiver.step}
          scanning={receiver.isScanning}
          tuneDown={() => {
            receiver.tuneDown();
            audio.unlock();
          }}
          tuneUp={() => {
            receiver.tuneUp();
            audio.unlock();
          }}
          cycleStep={receiver.cycleStep}
          toggleScan={receiver.toggleScan}
          hold={receiver.hold}
          logCurrent={logCurrent}
          onTextTick={audio.click}
        />
      )}
      {tab === 'logbook' && <LogbookScreen logs={sortedLogs} filter={logFilter} setFilter={setLogFilter} />}
      {tab === 'map' && <MapScreen utc={utc} />}
      {tab === 'settings' && (
        <SettingsScreen
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          textSpeed={textSpeed}
          setTextSpeed={setTextSpeed}
          theme={theme}
          setTheme={setTheme}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          resetLogbook={() => setLogbook([])}
        />
      )}
      <BottomNav tab={tab} onSelect={setTab} />
      {tab === 'receiver' && !canLog && <p className="hint">Tune within ±1.0kHz to copy traffic.</p>}
    </PhoneShell>
  );
}

export default App;

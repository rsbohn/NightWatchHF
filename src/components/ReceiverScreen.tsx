import { useEffect, useMemo, useState } from 'react';
import type { Signal } from '../data/signals';
import { Controls } from './Controls';
import { FrequencyDisplay } from './FrequencyDisplay';
import { Meter } from './Meter';
import { ReceivePane } from './ReceivePane';

interface ReceiverProps {
  utc: string;
  frequency: number;
  mode: string;
  signalMeter: number;
  noiseMeter: number;
  lines: string[];
  signal?: Signal;
  step: number;
  scanning: boolean;
  tuneDown: () => void;
  tuneUp: () => void;
  cycleStep: () => void;
  toggleScan: () => void;
  logCurrent: () => void;
  hold: () => void;
  onTextTick: () => void;
}

export function ReceiverScreen(props: ReceiverProps) {
  const distress = props.signal?.type === 'distress';
  const [showMeters, setShowMeters] = useState(true);
  const [showTuner, setShowTuner] = useState(true);

  const headerText = useMemo(
    () => (props.signal ? `${props.signal.station}${props.signal.ship ? `/${props.signal.ship}` : ''} • ${props.signal.summary}` : 'NO LOCK / BAND NOISE'),
    [props.signal]
  );

  useEffect(() => {
    props.onTextTick();
  }, [props.lines.length]);

  return (
    <section className="screen receiver-screen">
      <header className="header panel">
        <h1>NIGHT WATCH HF</h1>
        <span>{props.utc}</span>
      </header>
      <FrequencyDisplay frequency={props.frequency} mode={props.mode} />
      <p className={`status ${distress ? 'distress-txt' : ''}`}>{headerText}</p>
      <button className="section-toggle" onClick={() => setShowMeters((v) => !v)} aria-expanded={showMeters}>
        {showMeters ? '▼' : '▶'} SIGNAL / NOISE
      </button>
      {showMeters && (
        <div className="meters-row">
          <Meter label="SIGNAL" value={props.signalMeter} />
          <Meter label="NOISE" value={props.noiseMeter} danger={props.noiseMeter > 7 || distress} />
        </div>
      )}
      <button className="section-toggle" onClick={() => setShowTuner((v) => !v)} aria-expanded={showTuner}>
        {showTuner ? '▼' : '▶'} TUNER
      </button>
      {showTuner && (
        <Controls
          onDown={props.tuneDown}
          onUp={props.tuneUp}
          onStep={props.cycleStep}
          onScan={props.toggleScan}
          onLog={props.logCurrent}
          onHold={props.hold}
          scanning={props.scanning}
          step={props.step}
        />
      )}
      <ReceivePane lines={props.lines} distress={distress} />
    </section>
  );
}

interface Props {
  onDown: () => void;
  onUp: () => void;
  onStep: () => void;
  onScan: () => void;
  onLog: () => void;
  onHold: () => void;
  scanning: boolean;
  step: number;
}

export function Controls({ onDown, onUp, onStep, onScan, onLog, onHold, scanning, step }: Props) {
  return (
    <div className="controls panel">
      <button onClick={onDown}>-</button>
      <button onClick={onStep}>TUNE {step.toFixed(1)}</button>
      <button onClick={onUp}>+</button>
      <button onClick={onScan} className={scanning ? 'active' : ''}>{scanning ? 'STOP' : 'SCAN'}</button>
      <button onClick={onLog}>LOG</button>
      <button onClick={onHold}>HOLD</button>
    </div>
  );
}

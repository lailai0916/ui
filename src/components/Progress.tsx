type ProgressProps = {
  label: string;
  max?: number;
  showValue?: boolean;
  value: number;
};

export function Progress({ label, max = 100, showValue = true, value }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const percent = max === 0 ? 0 : Math.round((safeValue / max) * 100);

  return (
    <div className="lui-progress">
      <div className="lui-progress__meta">
        <span>{label}</span>
        {showValue && <span>{percent}%</span>}
      </div>
      <div
        className="lui-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={safeValue}
      >
        <div className="lui-progress__value" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

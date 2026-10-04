import styles from './styles.module.css';
export type ProgressProps = {
  label: string;
  max?: number;
  showValue?: boolean;
  showLabel?: boolean;
  value: number;
};

export function Progress({
  label,
  max = 100,
  showValue = true,
  showLabel = true,
  value,
}: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(value, safeMax)) : 0;
  const percent = safeMax === 0 ? 0 : Math.round((safeValue / safeMax) * 100);

  return (
    <div className={styles.progress}>
      {(showLabel || showValue) && (
        <div className={styles.progressMeta}>
          {showLabel && <span>{label}</span>}
          {showValue && <span>{percent}%</span>}
        </div>
      )}
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
      >
        <div className={styles.progressValue} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default Progress;

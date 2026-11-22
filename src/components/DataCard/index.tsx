import { useLaikit } from '../../provider.js';
import Card from '../Card/index.js';
import Icon from '../Icon/index.js';
import Skeleton from '../Skeleton/index.js';
import styles from './styles.module.css';
import type { ReactNode } from 'react';

export interface DataCardProps {
  value: number | string;
  label: string;
  icon: string;
  // Optional display formatter (e.g. compact "88.8K"); defaults to the raw value.
  format?: (value: number) => string;
  description?: ReactNode;
  loading?: boolean;
  trend?: ReactNode;
}

export default function DataCard({
  value,
  label,
  icon,
  format,
  description,
  loading,
  trend,
}: DataCardProps) {
  const { selectMessage } = useLaikit();
  const count = typeof value === 'number' ? value : Number(value);
  const displayLabel = selectMessage(Number.isFinite(count) ? count : 0, label);

  return (
    <Card className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statLabel}>{displayLabel}</div>
        <Icon className={styles.statIcon} icon={icon} aria-hidden="true" />
      </div>
      <div className={styles.statNumber} aria-busy={loading || undefined}>
        {loading ? (
          <Skeleton width="3.5rem" height="1.5rem" radius="var(--lk-radius-sm)" />
        ) : format && typeof value === 'number' ? (
          format(value)
        ) : (
          value
        )}
      </div>
      {description != null && <div className={styles.statDescription}>{description}</div>}
      {trend != null && <div className={styles.statTrend}>{trend}</div>}
    </Card>
  );
}

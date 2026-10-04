import { useLaikit } from '../../provider.js';
import Card from '../Card/index.js';
import IconBlock from '../IconBlock/index.js';
import styles from './styles.module.css';
import type { ReactNode } from 'react';

export interface DataCardProps {
  value: number | string;
  label: string;
  icon: string;
  // Optional display formatter (e.g. compact "88.8K"); defaults to the raw value.
  format?: (value: number) => string;
  description?: ReactNode;
}

export default function DataCard({ value, label, icon, format, description }: DataCardProps) {
  const { selectMessage } = useLaikit();
  const count = typeof value === 'number' ? value : Number(value);
  const displayLabel = selectMessage(Number.isFinite(count) ? count : 0, label);

  return (
    <Card padding="1.5rem">
      <div className={styles.statCard}>
        <IconBlock icon={icon} variant="muted" />
        <div className={styles.statContent}>
          <div className={styles.statNumber}>
            {format && typeof value === 'number' ? format(value) : value}
          </div>
          <div className={styles.statLabel}>{displayLabel}</div>
          {description != null && <div className={styles.statDescription}>{description}</div>}
        </div>
      </div>
    </Card>
  );
}

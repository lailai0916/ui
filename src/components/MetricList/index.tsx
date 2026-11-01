import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Link, useLaikit } from '../../provider.js';
import { formatCompact } from '../../utils/format.js';
import TitleCard, { type TitleCardProps } from '../TitleCard/index.js';
import DataState from '../DataState/index.js';
import Skeleton from '../Skeleton/index.js';
import Hint from '../Hint/index.js';
import styles from './styles.module.css';

export interface MetricListItem {
  x: string;
  y: number;
}
export interface MetricListProps {
  title: string;
  icon?: string;
  items: MetricListItem[];
  loading?: boolean;
  loadingCount?: number;
  emptyText: string;
  error?: string;
  errorAction?: ReactNode;
  notice?: ReactNode;
  renderLabel?: (key: string) => ReactNode;
  labelTitle?: (key: string) => string;
  formatValue?: (value: number) => string;
  href?: (key: string) => string | null | undefined;
  variant?: 'bar' | 'ranked';
  size?: TitleCardProps['size'];
  padding?: TitleCardProps['padding'];
  className?: string;
}

function Row({ to, hint, children }: { to?: string | null; hint?: string; children: ReactNode }) {
  const row = to ? (
    <Link to={to} className={styles.row}>
      {children}
    </Link>
  ) : (
    <div className={styles.row}>{children}</div>
  );
  return (
    <li className={styles.rowItem}>
      {hint ? (
        <Hint label={hint} onlyWhenTruncated truncationTarget="[data-truncated-title]">
          {row}
        </Hint>
      ) : (
        row
      )}
    </li>
  );
}

export default function MetricList({
  title,
  icon,
  items,
  loading,
  loadingCount = 8,
  emptyText,
  error,
  errorAction,
  notice,
  renderLabel,
  labelTitle,
  formatValue,
  href,
  variant = 'bar',
  size = 'sm',
  padding = '1.5rem 1.25rem 1.25rem',
  className,
}: MetricListProps) {
  const { locale } = useLaikit();
  const format = formatValue ?? ((value: number) => formatCompact(value, locale));
  const ranked = variant === 'ranked';
  const max = Math.max(...items.map((item) => item.y), 1);
  function content(item: MetricListItem | undefined, index: number) {
    const label = (
      <span className={styles.label} data-truncated-title>
        {item ? (
          renderLabel ? (
            renderLabel(item.x)
          ) : (
            <span>{item.x}</span>
          )
        ) : ranked ? (
          <Skeleton width="75%" height="1.4em" />
        ) : (
          '\u00a0'
        )}
      </span>
    );
    const value = (
      <span className={styles.value}>
        {item ? format(item.y) : ranked ? <Skeleton width="4rem" height="1.4em" /> : null}
      </span>
    );
    const percent = item ? Math.max(0, item.y / max) * 100 : 0;
    return ranked ? (
      <>
        <span className={styles.rank} aria-hidden="true">
          {item ? index + 1 : <Skeleton width="1.25rem" height="1.25rem" />}
        </span>
        <div className={styles.content}>
          <div className={styles.heading}>
            {label}
            {value}
          </div>
          {item ? (
            <div className={styles.track} aria-hidden="true">
              <div className={styles.fill} style={{ width: `${percent}%` }} />
            </div>
          ) : (
            <Skeleton width="100%" height="3px" />
          )}
        </div>
      </>
    ) : (
      <>
        {item ? (
          <div className={styles.bar} style={{ width: `${percent}%` }} aria-hidden="true" />
        ) : (
          <Skeleton className={styles.skeletonBar} />
        )}
        {label}
        {value}
      </>
    );
  }
  return (
    <TitleCard
      title={title}
      icon={icon}
      size={size}
      padding={padding}
      className={clsx(styles.card, ranked && styles.ranked, className)}
    >
      <div aria-busy={Boolean(loading)} aria-live="polite">
        {notice}
        {loading ? (
          <ol className={styles.list} aria-hidden="true">
            {Array.from({ length: loadingCount }, (_, index) => (
              <Row key={index}>{content(undefined, index)}</Row>
            ))}
          </ol>
        ) : error ? (
          <DataState message={error} action={errorAction} />
        ) : items.length === 0 ? (
          <DataState message={emptyText} />
        ) : (
          <ol className={styles.list} role="list">
            {items.map((item, index) => (
              <Row key={`${item.x}-${index}`} to={href?.(item.x)} hint={labelTitle?.(item.x)}>
                {content(item, index)}
              </Row>
            ))}
          </ol>
        )}
      </div>
    </TitleCard>
  );
}

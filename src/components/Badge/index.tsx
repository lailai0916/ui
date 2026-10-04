import { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import Icon from '../Icon/index.js';
import styles from './styles.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: string;
  count?: number;
  active?: boolean;
  hoverable?: boolean;
  className?: string;
  children?: ReactNode;
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

export default function Badge({
  icon,
  count,
  active,
  hoverable,
  className,
  children,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      data-lk="badge"
      className={clsx(
        styles.badge,
        variant !== 'neutral' && styles[variant],
        {
          [styles.badgeActive]: active,
          [styles.badgeHoverable]: hoverable,
        },
        className
      )}
    >
      {icon && <Icon icon={icon} className={styles.badgeIcon} />}
      {children !== undefined && <span className={styles.badgeLabel}>{children}</span>}
      {count !== undefined && <span className={styles.badgeCount}>{count}</span>}
    </span>
  );
}

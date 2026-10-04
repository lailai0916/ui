import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function Alert({
  action,
  children,
  className,
  icon,
  role,
  title,
  variant = 'info',
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      data-lk="alert"
      data-variant={variant}
      role={role ?? (variant === 'danger' || variant === 'warning' ? 'alert' : 'status')}
      className={clsx(styles.alert, styles[variant], className)}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.copy}>
        {title && <strong>{title}</strong>}
        {children}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

import type { TableHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type TableProps = TableHTMLAttributes<HTMLTableElement> & { wrapperClassName?: string };

export default function Table({ children, className, wrapperClassName, ...props }: TableProps) {
  return (
    <div data-lk="table-scroll" className={clsx(styles.scroll, wrapperClassName)}>
      <table {...props} data-lk="table" className={clsx(styles.table, className)}>
        {children}
      </table>
    </div>
  );
}

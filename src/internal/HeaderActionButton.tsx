import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import Hint from '../components/Hint/index.js';
import styles from './header-action.module.css';

type HeaderActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  kind: 'language' | 'theme';
};

export const HeaderActionButton = forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  function HeaderActionButton(
    { label, kind, className, children, type = 'button', ...props },
    ref
  ) {
    return (
      <Hint label={label} data-lk="action-hint">
        <button
          {...props}
          ref={ref}
          type={type}
          data-lk={`${kind}-button`}
          className={clsx(styles.button, kind === 'language' && styles.language, className)}
          aria-label={label}
        >
          {children}
        </button>
      </Hint>
    );
  }
);

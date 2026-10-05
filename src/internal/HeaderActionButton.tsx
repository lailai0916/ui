import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import Hint from '../components/Hint/index.js';
import styles from './header-action.module.css';

type HeaderActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  kind?: 'language' | 'theme';
  hint?: boolean;
};

export const HeaderActionButton = forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  function HeaderActionButton(
    { label, kind, className, children, type = 'button', title, hint = true, ...props },
    ref
  ) {
    return (
      <Hint label={title ?? label} disabled={!hint} data-lk="action-hint">
        <button
          {...props}
          ref={ref}
          type={type}
          data-lk={kind ? `${kind}-button` : 'button'}
          className={clsx(styles.button, kind === 'language' && styles.language, className)}
          aria-label={label}
        >
          {children}
        </button>
      </Hint>
    );
  }
);

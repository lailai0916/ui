import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import Button from '../Button/index.js';
import Hint from '../Hint/index.js';
import styles from './styles.module.css';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'sm' | 'md';
  hint?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, label, size = 'md', title, hint = true, ...props },
  ref
) {
  return (
    <Hint label={title ?? label} disabled={!hint}>
      <Button
        {...props}
        ref={ref}
        variant="ghost"
        size={size}
        className={clsx(styles.button, styles[size], className)}
        aria-label={label}
      >
        {children}
      </Button>
    </Hint>
  );
});

export default IconButton;

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { HeaderActionButton } from '../../internal/HeaderActionButton.js';
import Button from '../Button/index.js';
import Hint from '../Hint/index.js';
import styles from './styles.module.css';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'header';
  hint?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, label, size = 'md', variant = 'ghost', title, hint = true, ...props },
  ref
) {
  if (variant === 'header') {
    return (
      <HeaderActionButton
        {...props}
        ref={ref}
        className={className}
        label={label}
        title={title}
        hint={hint}
      >
        {children}
      </HeaderActionButton>
    );
  }

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

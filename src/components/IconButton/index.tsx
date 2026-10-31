import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { HeaderActionButton } from '../../internal/HeaderActionButton.js';
import Hint from '../Hint/index.js';
import '../../internal/icon-button.css';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'ghost' | 'header';
  hint?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    children,
    className,
    label,
    size = 'md',
    variant = 'ghost',
    type = 'button',
    title,
    hint = true,
    ...props
  },
  ref
) {
  if (variant === 'header') {
    return (
      <HeaderActionButton
        {...props}
        ref={ref}
        type={type}
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
      <button
        {...props}
        ref={ref}
        type={type}
        data-lk="button"
        data-lk-icon-button={size}
        className={className}
        aria-label={label}
      >
        {children}
      </button>
    </Hint>
  );
});

export default IconButton;

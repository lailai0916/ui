import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
};

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'small' | 'medium';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className = '', size = 'medium', type = 'button', variant = 'primary', ...props },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`lui-button lui-button--${variant} lui-button--${size} ${className}`.trim()}
    >
      {children}
    </button>
  );
});

export function IconButton({
  children,
  className = '',
  label,
  size = 'medium',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`lui-icon-button lui-icon-button--${size} ${className}`.trim()}
      aria-label={label}
      title={props.title ?? label}
    >
      {children}
    </button>
  );
}

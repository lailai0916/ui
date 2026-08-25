import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function Button({
  children,
  className = '',
  size = 'medium',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`lui-button lui-button--${variant} lui-button--${size} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function IconButton({ className = '', label, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`lui-icon-button ${className}`.trim()}
      aria-label={label}
      title={props.title ?? label}
    />
  );
}

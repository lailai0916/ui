import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { Link, type LinkProps } from '../../provider.js';
import Hint from '../Hint/index.js';
import styles from './styles.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  active?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'secondary',
    size = 'md',
    rounded = false,
    active,
    fullWidth = false,
    leftIcon,
    type = 'button',
    className,
    title,
    ...rest
  },
  ref
) {
  const button = (
    <button
      ref={ref}
      type={type}
      data-lk="button"
      aria-pressed={active}
      className={clsx(
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        rounded && styles.rounded,
        active && styles.active,
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {leftIcon != null && <span className={styles.icon}>{leftIcon}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
    </button>
  );
  return title ? <Hint label={title}>{button}</Hint> : button;
});

export default Button;

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
};

export function ButtonLink({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  rounded,
  fullWidth,
  leftIcon,
  title,
  ...props
}: ButtonLinkProps) {
  const link = (
    <Link
      {...props}
      data-lk="button"
      className={clsx(
        styles.button,
        styles.buttonLink,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        rounded && styles.rounded,
        fullWidth && styles.fullWidth,
        className
      )}
    >
      {leftIcon != null && <span className={styles.icon}>{leftIcon}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
    </Link>
  );
  return title ? <Hint label={title}>{link}</Hint> : link;
}

import { forwardRef, type AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = '#main-content', className, ...props },
  ref
) {
  return (
    <a
      {...props}
      ref={ref}
      href={href}
      data-lk="skip-link"
      className={clsx(styles.link, className)}
    />
  );
});

export default SkipLink;

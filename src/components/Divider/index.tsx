import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type DividerProps = Omit<ComponentPropsWithoutRef<'hr'>, 'children' | 'aria-orientation'> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative = false, className, role, ...props },
  ref
) {
  return (
    <hr
      {...props}
      ref={ref}
      data-lk="divider"
      data-orientation={orientation}
      role={decorative ? 'presentation' : role}
      aria-hidden={decorative ? true : props['aria-hidden']}
      aria-orientation={decorative ? undefined : orientation}
      className={clsx(styles.divider, className)}
    />
  );
});

export default Divider;

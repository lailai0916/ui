import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { PageContainer } from '../Layout/index.js';
import styles from './styles.module.css';

export type SiteHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  brand: ReactNode;
  mobileAction?: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  position?: 'sticky' | 'fixed' | 'static';
  width?: number;
  fullWidth?: boolean;
};

export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(function SiteHeader(
  {
    brand,
    mobileAction,
    navigation,
    actions,
    position = 'sticky',
    width,
    fullWidth = false,
    className,
    ...props
  },
  ref
) {
  return (
    <header
      {...props}
      ref={ref}
      data-lk="site-header"
      data-position={position}
      className={clsx(styles.header, fullWidth && styles.fullWidth, className)}
    >
      <PageContainer
        data-lk="header-inner"
        width={fullWidth ? undefined : width}
        className={clsx(styles.inner, navigation == null && styles.withoutNavigation)}
      >
        <div data-lk="header-start" className={styles.start}>
          {mobileAction != null && (
            <div data-lk="header-mobile-action" className={styles.mobileAction}>
              {mobileAction}
            </div>
          )}
          <div data-lk="header-brand" className={styles.brand}>
            {brand}
          </div>
        </div>
        {navigation != null && (
          <div data-lk="header-navigation" className={styles.navigation}>
            {navigation}
          </div>
        )}
        {actions != null && (
          <div data-lk="header-actions" className={styles.actions}>
            {actions}
          </div>
        )}
      </PageContainer>
    </header>
  );
});

export default SiteHeader;

import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Heading, type HeadingProps } from '../../provider.js';
import styles from './styles.module.css';

export type SectionHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: ReactNode;
  titleId?: string;
  headingAs?: HeadingProps['as'];
  aside?: ReactNode;
};

export default function SectionHeader({
  title,
  titleId,
  headingAs = 'h2',
  aside,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <header {...props} data-lk="section-header" className={clsx(styles.header, className)}>
      <Heading as={headingAs} id={titleId} className={styles.title}>
        {title}
      </Heading>
      {aside != null && (
        <div data-lk="section-aside" className={styles.aside}>
          {aside}
        </div>
      )}
    </header>
  );
}

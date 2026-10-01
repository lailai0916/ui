import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useLaikit } from '../../provider.js';
import Icon from '../Icon/index.js';
import styles from './styles.module.css';

export interface QuoteProps {
  /** Quoted body text or rich nodes. */
  children: ReactNode;
  /** Person being quoted; rendered after an em-dash. */
  author?: string;
  /** Optional source / event / publication, appended after a middot. */
  source?: string;
  className?: string;
}

export default function Quote({ children, author, source, className }: QuoteProps) {
  const { messages } = useLaikit();
  const hasAttribution = !!(author || source);
  return (
    <figure className={clsx(styles.quote, className)}>
      <Icon icon="lucide:quote" width={22} height={22} className={styles.icon} aria-hidden="true" />
      <blockquote className={styles.body}>{children}</blockquote>
      {hasAttribution && (
        <figcaption className={styles.attribution}>
          <span aria-hidden="true">{messages.quoteAttributionDash}</span>
          {author && <span className={styles.author}>{author}</span>}
          {author && source && (
            <span className={styles.separator} aria-hidden="true">
              ·
            </span>
          )}
          {source && <span>{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}

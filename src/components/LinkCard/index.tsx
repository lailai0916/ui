import type { ReactNode } from 'react';
import clsx from 'clsx';
import Card from '../Card/index.js';
import Hint from '../Hint/index.js';
import IconBlock from '../IconBlock/index.js';
import Icon from '../Icon/index.js';
import FallbackImage from '../FallbackImage/index.js';
import styles from './styles.module.css';

export type LinkCardLinkProps = { to: string; href?: never } | { href: string; to?: never };

export type LinkCardProps = LinkCardLinkProps & {
  title: string;
  description?: string;
  image?: string;
  fallbackIcon?: string;
  /** 'icon' = small centered glyph (e.g. favicon); 'avatar' = fills the block (e.g. profile photo). */
  imageVariant?: 'icon' | 'avatar';
  /** Replace the default image and fallback inside the existing icon block. */
  imageSlot?: ReactNode;
};

const ICON_BOX_SIZE = 48;
const FALLBACK_ICON_SIZE = 24;

export default function LinkCard({
  title,
  description,
  image,
  fallbackIcon,
  imageVariant = 'icon',
  imageSlot,
  ...linkProps
}: LinkCardProps) {
  return (
    <Card {...linkProps} className={styles.linkCard} wrapperClassName={styles.linkCardWrap}>
      <IconBlock variant="muted" size={ICON_BOX_SIZE} className={styles.imageBlock}>
        {imageSlot ?? (
          <FallbackImage
            src={image}
            alt={title}
            fit={imageVariant === 'avatar' ? 'cover' : 'contain'}
            className={clsx(styles.imageSlot, imageVariant === 'avatar' && styles.imageAvatar)}
            fallback={
              fallbackIcon && (
                <Icon
                  icon={fallbackIcon}
                  width={FALLBACK_ICON_SIZE}
                  height={FALLBACK_ICON_SIZE}
                  aria-hidden="true"
                />
              )
            }
          />
        )}
      </IconBlock>
      <div className={styles.body}>
        <Hint label={title} onlyWhenTruncated>
          <h3 className={styles.title}>{title}</h3>
        </Hint>
        {description && (
          <Hint label={description} onlyWhenTruncated>
            <p className={styles.description}>{description}</p>
          </Hint>
        )}
      </div>
    </Card>
  );
}

import type { ReactNode } from 'react';
import clsx from 'clsx';
import Card from '../Card/index.js';
import Hint from '../Hint/index.js';
import IconBlock from '../IconBlock/index.js';
import Icon from '../Icon/index.js';
import { useImageStatus } from '../../hooks/useImageStatus.js';
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
  const { imgRef, status, onLoad, onError } = useImageStatus(imageSlot == null ? image : undefined);
  const shouldLoadImage = !!image && status !== 'error';
  const imageLoaded = status === 'loaded';

  return (
    <Card {...linkProps} className={styles.linkCard} wrapperClassName={styles.linkCardWrap}>
      <IconBlock variant="muted" size={ICON_BOX_SIZE} className={styles.imageBlock}>
        {imageSlot ?? (
          <>
            {fallbackIcon && (
              <Icon
                icon={fallbackIcon}
                width={FALLBACK_ICON_SIZE}
                height={FALLBACK_ICON_SIZE}
                className={imageLoaded ? styles.fallbackIconHidden : styles.fallbackIcon}
                aria-hidden="true"
              />
            )}
            {shouldLoadImage && (
              <img
                ref={imgRef}
                src={image}
                alt={title}
                className={clsx(
                  imageVariant === 'avatar' ? styles.imageAvatar : styles.image,
                  imageLoaded ? styles.imageLoaded : styles.imageLoading
                )}
                loading="lazy"
                decoding="async"
                onLoad={onLoad}
                onError={onError}
              />
            )}
          </>
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

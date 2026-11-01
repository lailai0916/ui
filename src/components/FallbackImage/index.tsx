import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { useImageStatus } from '../../hooks/useImageStatus.js';
import styles from './styles.module.css';

type ImageAttributes = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'loading'> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type FallbackImageProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string | null;
  alt?: string;
  fallback?: ReactNode;
  fit?: 'contain' | 'cover';
  loading?: 'eager' | 'lazy';
  imageProps?: ImageAttributes;
};

export default function FallbackImage({
  src,
  alt = '',
  fallback,
  fit = 'cover',
  loading = 'lazy',
  imageProps,
  className,
  ...props
}: FallbackImageProps) {
  const { imgRef, status, onLoad, onError } = useImageStatus(src ?? undefined);
  return (
    <span
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      data-lk="fallback-image"
      {...props}
      data-image-status={status}
      className={clsx(styles.imageSlot, fit === 'contain' && styles.contain, className)}
    >
      <span
        className={clsx(styles.fallback, status === 'loaded' && styles.hidden)}
        aria-hidden="true"
      >
        {fallback}
      </span>
      {src && status !== 'error' && (
        <img
          {...imageProps}
          ref={imgRef}
          src={src}
          alt=""
          loading={loading}
          decoding={imageProps?.decoding ?? 'async'}
          className={clsx(
            styles.image,
            status === 'loaded' && styles.loaded,
            imageProps?.className
          )}
          onLoad={(event) => {
            onLoad();
            imageProps?.onLoad?.(event);
          }}
          onError={(event) => {
            onError();
            imageProps?.onError?.(event);
          }}
        />
      )}
    </span>
  );
}

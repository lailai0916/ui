import type { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import FallbackImage from '../FallbackImage/index.js';
import styles from './styles.module.css';

export type AvatarProps = {
  alt: string;
  name: string;
  size?: number | string;
  src?: string | null;
  fallback?: ReactNode;
  loading?: 'eager' | 'lazy';
  className?: string;
  style?: CSSProperties;
};

export function Avatar({
  alt,
  name,
  size = 36,
  src,
  fallback,
  loading,
  className,
  style,
}: AvatarProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? '?';
  return (
    <FallbackImage
      data-lk="avatar"
      src={src}
      alt={alt}
      fallback={fallback ?? initial}
      loading={loading}
      className={clsx(styles.avatar, className)}
      style={{
        width: size,
        height: size,
        fontSize: typeof size === 'number' ? size * 0.42 : `calc(${size} * 0.42)`,
        ...style,
      }}
    />
  );
}

export default Avatar;

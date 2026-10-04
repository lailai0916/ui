import { type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { Link } from '../../provider.js';
import clsx from 'clsx';
import styles from './styles.module.css';

export type BaseCardProps = {
  as?: 'div' | 'article' | 'section';
  children: ReactNode;
  padding?: CSSProperties['padding'];
  style?: CSSProperties;
  className?: string;
  wrapperClassName?: string;
};

export type StaticCardProps = BaseCardProps & {
  to?: never;
  href?: never;
};

export type LinkedCardProps = BaseCardProps &
  Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'style'> &
  (
    | {
        to: string;
        href?: never;
      }
    | {
        href: string;
        to?: never;
      }
  );

export type CardProps = StaticCardProps | LinkedCardProps;

function CardSurface({
  as: Tag = 'div',
  children,
  padding,
  style,
  className,
}: Pick<CardProps, 'as' | 'children' | 'padding' | 'style' | 'className'>) {
  return (
    <Tag
      className={clsx(styles.card, className)}
      style={
        padding == null
          ? style
          : ({
              ...style,
              // A bare number would land as an invalid `--card-padding: 16`
              // (custom properties skip React's px coercion), voiding the rule.
              '--card-padding': typeof padding === 'number' ? `${padding}px` : padding,
            } as CSSProperties)
      }
    >
      {children}
    </Tag>
  );
}

export default function Card({
  as,
  children,
  padding,
  style,
  className,
  wrapperClassName,
  ...linkProps
}: CardProps) {
  if (!('to' in linkProps) && !('href' in linkProps)) {
    return (
      <CardSurface as={as} className={className} padding={padding} style={style}>
        {children}
      </CardSurface>
    );
  }

  return (
    <Link {...linkProps} className={clsx(styles.linkCard, wrapperClassName)}>
      <CardSurface as={as} className={className} padding={padding} style={style}>
        {children}
      </CardSurface>
    </Link>
  );
}

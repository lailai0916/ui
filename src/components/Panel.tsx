import type { HTMLAttributes, ReactNode } from 'react';

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: 'default' | 'muted';
  feature?: boolean;
};

export function Panel({
  children,
  className = '',
  feature = false,
  tone = 'default',
  ...props
}: PanelProps) {
  const classes = [
    'lui-panel',
    feature ? 'lui-panel--feature' : '',
    tone === 'muted' ? 'lui-panel--muted' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}

export function PanelHeader({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`lui-panel__header ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PanelBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`lui-panel__body ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PanelFooter({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`lui-panel__footer ${className}`.trim()}>
      {children}
    </div>
  );
}

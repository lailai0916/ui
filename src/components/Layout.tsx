import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: number;
};

type FlowProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gap?: number;
};

export function PageContainer({
  children,
  className = '',
  style,
  width,
  ...props
}: PageContainerProps) {
  return (
    <div
      {...props}
      className={`lui-page-container ${className}`.trim()}
      style={
        { ...style, '--lui-container-width': width ? `${width}px` : undefined } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function Stack({ children, className = '', gap, style, ...props }: FlowProps) {
  return (
    <div
      {...props}
      className={`lui-stack ${className}`.trim()}
      style={{ ...style, '--lui-stack-gap': gap ? `${gap}px` : undefined } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Cluster({ children, className = '', gap, style, ...props }: FlowProps) {
  return (
    <div
      {...props}
      className={`lui-cluster ${className}`.trim()}
      style={{ ...style, '--lui-cluster-gap': gap ? `${gap}px` : undefined } as CSSProperties}
    >
      {children}
    </div>
  );
}

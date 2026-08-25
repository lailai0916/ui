import type { ReactNode } from 'react';

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className="lui-empty-state">
      {icon && <div className="lui-empty-state__icon">{icon}</div>}
      <p className="lui-empty-state__title">{title}</p>
      <p className="lui-empty-state__description">{description}</p>
      {action}
    </div>
  );
}

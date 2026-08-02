import React from 'react';
import { cn } from '../../lib/cn';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  backButton?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  backButton,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle', className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        {backButton && <div>{backButton}</div>}
        <div>
          <h1 className="text-2xl font-extrabold text-text tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
};

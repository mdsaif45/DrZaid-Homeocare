import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface OverviewItemProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle: string;
  count?: number | string;
  onClick?: () => void;
}

export function OverviewItem({
  icon,
  iconBg = 'bg-info-subtle text-info-subtle-text',
  title,
  subtitle,
  count,
  onClick,
}: OverviewItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-border-strong',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconBg)}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text group-hover:text-primary-text truncate">
              {title}
            </p>
            {count !== undefined && (
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-bg-subtle text-text-muted">
                {count}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted truncate">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-text-subtle group-hover:text-text group-hover:translate-x-0.5 transition-transform duration-150 shrink-0 ml-2" />
    </div>
  );
}

export function OverviewCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface p-6 shadow-sm', className)}>
      <h3 className="text-base font-extrabold text-text mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

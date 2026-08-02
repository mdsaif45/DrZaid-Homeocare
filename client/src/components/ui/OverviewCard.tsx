import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface OverviewItemProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle: string;
  count?: number | string;
  onClick?: () => void;
}

export function OverviewItem({ icon, iconBg = 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400', title, subtitle, count, onClick }: OverviewItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
              {title}
            </p>
            {count !== undefined && (
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {count}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
    </div>
  );
}

export function OverviewCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors ${className}`}>
      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

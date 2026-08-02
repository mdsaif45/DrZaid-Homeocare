import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, wrapperClassName, children, ...props }, ref) => (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border bg-surface', wrapperClassName)}>
      <table ref={ref} className={cn('w-full text-left text-sm text-text border-collapse', className)} {...props}>
        {children}
      </table>
    </div>
  )
);
Table.displayName = 'Table';

export const TableHead = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-surface-sunken border-b border-border text-xs uppercase text-text-subtle font-semibold', className)} {...props} />
  )
);
TableHead.displayName = 'TableHead';

export const TableHeader = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn('px-4 py-3 font-semibold tracking-wider', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-border-subtle bg-surface', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  zebra?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, zebra = false, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'hover:bg-surface-hover',
        zebra && 'even:bg-bg-subtle',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-3.5 align-middle text-text', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

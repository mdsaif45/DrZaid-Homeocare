import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-info" />,
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    danger: <AlertCircle className="w-5 h-5 text-danger" />,
  };

  const variants = {
    info: 'bg-info-subtle text-info-subtle-text border-info-border',
    success: 'bg-success-subtle text-success-subtle-text border-success-border',
    warning: 'bg-warning-subtle text-warning-subtle-text border-warning-border',
    danger: 'bg-danger-subtle text-danger-subtle-text border-danger-border',
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold mb-1 leading-none">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <IconButton
          icon={<X className="w-4 h-4" />}
          aria-label="Dismiss alert"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="-mr-1 -mt-1 hover:bg-transparent"
        />
      )}
    </div>
  );
};

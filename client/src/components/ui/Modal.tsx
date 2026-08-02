import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-overlay backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={cn(
          'relative w-full rounded-xl bg-surface-raised text-text border border-border shadow-xl transition-[transform,opacity] duration-200 overflow-hidden',
          sizes[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex flex-col gap-1 pr-6">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-text">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-text-muted">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              icon={<X className="w-5 h-5" />}
              aria-label="Close modal"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

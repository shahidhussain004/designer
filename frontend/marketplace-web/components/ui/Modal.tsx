/**
 * Modal/Dialog Component
 * =======================
 * Accessible modal dialogs with focus trap and animations
 */

'use client';

import { announceToScreenReader, cn, lockBodyScroll, trapFocus } from '@/lib/design-system/utils';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title for accessibility */
  title: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Center modal vertically */
  centered?: boolean;
  /** Initial focus element ref */
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      children,
      isOpen,
      onClose,
      title,
      size = 'md',
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      centered = true,
      initialFocusRef,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const unlockBodyScroll = useRef<(() => void) | null>(null);

    const modalId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`);
    const titleId = `${modalId.current}-title`;
    const descriptionId = `${modalId.current}-description`;

    // Handle escape key
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    }, [closeOnEscape, onClose]);

    // Lock body scroll and manage focus
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        unlockBodyScroll.current = lockBodyScroll();
        document.addEventListener('keydown', handleKeyDown);

        // Focus initial element or modal
        setTimeout(() => {
          if (initialFocusRef?.current) {
            initialFocusRef.current.focus();
          } else {
            modalRef.current?.focus();
          }
        }, 0);

        // Announce to screen readers
        announceToScreenReader(`${title} dialog opened`);
      }

      return () => {
        if (isOpen) {
          unlockBodyScroll.current?.();
          document.removeEventListener('keydown', handleKeyDown);
          
          // Restore focus
          previousActiveElement.current?.focus();
        }
      };
    }, [isOpen, handleKeyDown, title, initialFocusRef]);

    // Trap focus within modal
    useEffect(() => {
      if (isOpen && modalRef.current) {
        const cleanup = trapFocus(modalRef.current);
        return cleanup;
      }
    }, [isOpen]);

    const handleBackdropClick = (event: React.MouseEvent) => {
      if (closeOnBackdrop && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const modalContent = (
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto',
          'animate-in fade-in-0 duration-200'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm',
            'animate-in fade-in-0 duration-200'
          )}
          aria-hidden="true"
        />

        {/* Modal positioning */}
        <div
          className={cn(
            'fixed inset-0 overflow-y-auto p-4',
            'flex min-h-full',
            centered ? 'items-center' : 'items-start pt-20',
            'justify-center'
          )}
          onClick={handleBackdropClick}
        >
          {/* Modal panel */}
          <div
            ref={(node) => {
              // Handle both refs
              (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            tabIndex={-1}
            className={cn(
              'relative w-full bg-white rounded-2xl shadow-2xl',
              'animate-in zoom-in-95 slide-in-from-bottom-4 duration-300',
              'focus:outline-none',
              sizes[size],
              size === 'full' && 'flex flex-col',
              className
            )}
            {...props}
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'absolute top-4 right-4 z-10',
                  'p-2 rounded-full',
                  'text-secondary-400 hover:text-secondary-600',
                  'hover:bg-secondary-100',
                  'focus:outline-none focus:ring-2 focus:ring-input-focus',
                  'transition-colors duration-200'
                )}
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {children}
          </div>
        </div>
      </div>
    );

    // Render in portal
    if (typeof window !== 'undefined') {
      return createPortal(modalContent, document.body);
    }

    return null;
  }
);

Modal.displayName = 'Modal';

// =============================================================================
// MODAL HEADER
// =============================================================================

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Modal title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-5 border-b border-secondary-200', className)}
        {...props}
      >
        {title && (
          <h2 className="text-xl font-semibold text-secondary-900">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-secondary-500">{subtitle}</p>
        )}
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

// =============================================================================
// MODAL BODY
// =============================================================================

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-5 flex-1 overflow-y-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

// =============================================================================
// MODAL FOOTER
// =============================================================================

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Align content */
  align?: 'left' | 'center' | 'right' | 'between';
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4 border-t border-secondary-200',
          'flex items-center gap-3',
          align === 'left' && 'justify-start',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
          align === 'between' && 'justify-between',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

// =============================================================================
// CONFIRMATION DIALOG
// =============================================================================

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Variant for styling */
  variant?: 'default' | 'danger';
  /** Loading state */
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <div className="p-6">
        {/* Icon */}
        <div className={cn(
          'mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4',
          variant === 'danger' ? 'bg-error-100' : 'bg-primary-100'
        )}>
          {variant === 'danger' ? (
            <svg className="w-6 h-6 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          {description && (
            <p className="text-secondary-500">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg font-medium',
              'border border-secondary-300 text-secondary-700',
              'hover:bg-secondary-50 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-input-focus',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg font-medium text-white',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'danger'
                ? 'bg-error-500 hover:bg-error-600 focus:ring-error-500'
                : 'bg-primary-500 hover:bg-primary-600 focus:ring-input-focus',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;

/**
 * Alert/Toast Component
 * ======================
 * Notification alerts with various styles and auto-dismiss
 */

'use client';

import React, { forwardRef, useState, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// ALERT COMPONENT
// =============================================================================

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert variant */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Dismissible */
  dismissible?: boolean;
  /** Dismiss callback */
  onDismiss?: () => void;
}

const alertStyles = {
  info: {
    container: 'bg-info-50 border-info-200 text-info-800',
    icon: 'text-info-500',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  success: {
    container: 'bg-success-50 border-success-200 text-success-800',
    icon: 'text-success-500',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    container: 'bg-warning-50 border-warning-200 text-warning-800',
    icon: 'text-warning-500',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    container: 'bg-error-50 border-error-200 text-error-800',
    icon: 'text-error-500',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const styles = alertStyles[variant];

    const handleDismiss = () => {
      setIsDismissed(true);
      onDismiss?.();
    };

    if (isDismissed) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 p-4 rounded-lg border',
          styles.container,
          className
        )}
        {...props}
      >
        {/* Icon */}
        {showIcon && (
          <svg
            className={cn('w-5 h-5 shrink-0 mt-0.5', styles.icon)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={styles.iconPath}
            />
          </svg>
        )}

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className={cn('text-sm', title && 'opacity-90')}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              'shrink-0 p-1 -mr-2 -mt-1 rounded',
              'opacity-60 hover:opacity-100',
              'focus:outline-none focus:ring-2 focus:ring-current',
              'transition-opacity'
            )}
            aria-label="Dismiss alert"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// =============================================================================
// TOAST COMPONENT
// =============================================================================

export interface ToastData {
  id: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps extends Omit<ToastData, 'duration'> {
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  variant,
  title,
  message,
  action,
  onDismiss,
}) => {
  const styles = alertStyles[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg border bg-white',
        'animate-in slide-in-from-right-full fade-in-0 duration-300',
        'max-w-sm w-full'
      )}
    >
      {/* Icon */}
      <svg
        className={cn('w-5 h-5 shrink-0 mt-0.5', styles.icon)}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={styles.iconPath}
        />
      </svg>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium text-secondary-900">{title}</p>
        )}
        <p className={cn('text-sm text-secondary-600', title && 'mt-1')}>
          {message}
        </p>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className={cn(
          'shrink-0 p-1 rounded',
          'text-secondary-400 hover:text-secondary-600',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'transition-colors'
        )}
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// =============================================================================
// TOAST PROVIDER & HOOK
// =============================================================================

interface ToastContextValue {
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  toast: {
    info: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    success: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    warning: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
    error: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) => string;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  /** Toast container position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Default toast duration (ms) */
  defaultDuration?: number;
  /** Maximum toasts to show */
  maxToasts?: number;
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  defaultDuration = 5000,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration ?? defaultDuration;

    setToasts(prev => {
      const newToasts = [...prev, { ...toast, id }];
      // Limit max toasts
      return newToasts.slice(-maxToasts);
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [defaultDuration, maxToasts, removeToast]);

  const toast = {
    info: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) =>
      addToast({ variant: 'info', message, ...options }),
    success: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) =>
      addToast({ variant: 'success', message, ...options }),
    warning: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) =>
      addToast({ variant: 'warning', message, ...options }),
    error: (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'message'>>) =>
      addToast({ variant: 'error', message, ...options }),
  };

  const contextValue: ToastContextValue = {
    addToast,
    removeToast,
    toast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div
            className={cn(
              'fixed z-[100] flex flex-col gap-2',
              positionStyles[position]
            )}
            aria-live="polite"
            aria-label="Notifications"
          >
            {toasts.map(t => (
              <Toast key={t.id} {...t} onDismiss={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export default Alert;

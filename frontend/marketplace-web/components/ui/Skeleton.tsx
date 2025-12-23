/**
 * Skeleton / Loading Components
 * ==============================
 * Loading placeholders with shimmer animation
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// SKELETON BASE
// =============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation style */
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animation = 'shimmer', ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'bg-secondary-200 rounded',
          animation === 'pulse' && 'animate-pulse',
          animation === 'shimmer' && [
            'relative overflow-hidden',
            'before:absolute before:inset-0',
            'before:-translate-x-full',
            'before:animate-[shimmer_2s_infinite]',
            'before:bg-gradient-to-r',
            'before:from-transparent before:via-white/60 before:to-transparent',
          ],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// =============================================================================
// SKELETON TEXT
// =============================================================================

export interface SkeletonTextProps extends SkeletonProps {
  /** Number of lines */
  lines?: number;
  /** Last line width */
  lastLineWidth?: 'full' | '3/4' | '2/3' | '1/2' | '1/3' | '1/4';
}

const widthClasses = {
  full: 'w-full',
  '3/4': 'w-3/4',
  '2/3': 'w-2/3',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '1/4': 'w-1/4',
};

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  className,
  lines = 3,
  lastLineWidth = '2/3',
  animation,
  ...props
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          animation={animation}
          className={cn(
            'h-4',
            index === lines - 1 ? widthClasses[lastLineWidth] : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

// =============================================================================
// SKELETON AVATAR
// =============================================================================

export interface SkeletonAvatarProps extends SkeletonProps {
  /** Size of avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  className,
  size = 'md',
  animation,
  ...props
}) => {
  return (
    <Skeleton
      animation={animation}
      className={cn('rounded-full', avatarSizes[size], className)}
      {...props}
    />
  );
};

// =============================================================================
// SKELETON BUTTON
// =============================================================================

export interface SkeletonButtonProps extends SkeletonProps {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
}

const buttonSizes = {
  sm: 'h-8 w-20',
  md: 'h-10 w-24',
  lg: 'h-12 w-32',
};

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  className,
  size = 'md',
  fullWidth = false,
  animation,
  ...props
}) => {
  return (
    <Skeleton
      animation={animation}
      className={cn(
        'rounded-lg',
        fullWidth ? 'w-full' : buttonSizes[size].split(' ')[1],
        buttonSizes[size].split(' ')[0],
        className
      )}
      {...props}
    />
  );
};

// =============================================================================
// SKELETON CARD
// =============================================================================

export interface SkeletonCardProps extends SkeletonProps {
  /** Show image placeholder */
  hasImage?: boolean;
  /** Number of text lines */
  textLines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className,
  hasImage = true,
  textLines = 3,
  animation,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-secondary-200 overflow-hidden',
        className
      )}
      {...props}
    >
      {hasImage && (
        <Skeleton animation={animation} className="h-48 w-full rounded-none" />
      )}
      <div className="p-4 space-y-4">
        <Skeleton animation={animation} className="h-6 w-3/4" />
        <SkeletonText animation={animation} lines={textLines} />
        <div className="flex gap-2">
          <SkeletonButton animation={animation} size="sm" />
          <SkeletonButton animation={animation} size="sm" />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SKELETON TABLE
// =============================================================================

export interface SkeletonTableProps extends SkeletonProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  className,
  rows = 5,
  columns = 4,
  animation,
  ...props
}) => {
  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-secondary-200 bg-secondary-50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={`header-${i}`}
            animation={animation}
            className="h-4 flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 p-4 border-b border-secondary-100"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              animation={animation}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// SPINNER
// =============================================================================

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Size of spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color */
  color?: 'primary' | 'secondary' | 'white' | 'current';
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const spinnerColors = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  white: 'text-white',
  current: 'text-current',
};

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  color = 'primary',
  ...props
}) => {
  return (
    <svg
      className={cn(
        'animate-spin',
        spinnerSizes[size],
        spinnerColors[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// =============================================================================
// LOADING OVERLAY
// =============================================================================

export interface LoadingOverlayProps {
  /** Is loading */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Blur background */
  blur?: boolean;
  /** Full screen */
  fullScreen?: boolean;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  blur = true,
  fullScreen = false,
  children,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', fullScreen && 'min-h-screen')}>
      {children}
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'bg-white/80 z-50',
          blur && 'backdrop-blur-sm'
        )}
        role="alert"
        aria-busy="true"
        aria-label={message || 'Loading'}
      >
        <Spinner size="lg" />
        {message && (
          <p className="mt-4 text-sm font-medium text-secondary-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Skeleton;

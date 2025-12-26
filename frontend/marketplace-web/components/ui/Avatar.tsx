/**
 * Avatar Component
 * =================
 * User avatars with image, initials, or icon fallbacks
 */

import React, { forwardRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/design-system/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** User name for initials fallback */
  name?: string;
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Shape variant */
  shape?: 'circle' | 'square';
  /** Online/offline status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-secondary-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
};

/**
 * Generate initials from name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate consistent color from name
 */
function getColorFromName(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500',
    'bg-info-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = '',
      name = '',
      size = 'md',
      shape = 'circle',
      status,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const showImage = src && !imageError;
    const showInitials = !showImage && name;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0',
          'font-medium text-white',
          avatarSizes[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          !showImage && (showInitials ? getColorFromName(name) : 'bg-secondary-200'),
          className
        )}
        role="img"
        aria-label={alt || name || 'User avatar'}
        {...props}
      >
        {/* Image */}
        {showImage && (
          <Image
            src={src}
            alt={alt || name}
            fill
            sizes={`(max-width: 768px) ${avatarSizes[size].split(' ')[0].replace('w-', '')}rem, ${avatarSizes[size].split(' ')[0].replace('w-', '')}rem`}
            className={cn(
              'object-cover',
              shape === 'circle' ? 'rounded-full' : 'rounded-lg'
            )}
            onError={() => setImageError(true)}
          />
        )}

        {/* Initials fallback */}
        {showInitials && !showImage && (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}

        {/* Icon fallback */}
        {!showImage && !showInitials && (
          <svg
            className="w-1/2 h-1/2 text-secondary-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
              statusSizes[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// =============================================================================
// AVATAR GROUP
// =============================================================================

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show */
  max?: number;
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = 'md', children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleAvatars = max ? childArray.slice(0, max) : childArray;
    const remainingCount = childArray.length - visibleAvatars.length;

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        role="group"
        aria-label={`Group of ${childArray.length} users`}
        {...props}
      >
        {visibleAvatars.map((child, index) => (
          <div
            key={index}
            className="ring-2 ring-white rounded-full">
            {React.isValidElement<AvatarProps>(child)
              ? React.cloneElement(child, { size })
              : child}
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className={cn(
              'inline-flex items-center justify-center shrink-0 rounded-full',
              'bg-secondary-100 text-secondary-600 font-medium ring-2 ring-white',
              avatarSizes[size]
            )}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;

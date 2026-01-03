/**
 * Brand & Logo Components
 * ========================
 * Professional SVG-based logos and brand assets
 */

import { cn } from '@/lib/design-system/utils';
import React, { forwardRef } from 'react';

// =============================================================================
// LOGO COMPONENT
// =============================================================================

export interface LogoProps extends React.SVGAttributes<SVGElement> {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Logo variant */
  variant?: 'full' | 'icon' | 'wordmark';
  /** Color theme */
  theme?: 'default' | 'white' | 'dark';
  /** Scale multiplier applied only to full/wordmark variants */
  fullScale?: number;
}

const logoSizes = {
  xs: { width: 80, height: 24, iconSize: 24 },
  sm: { width: 120, height: 32, iconSize: 32 },
  md: { width: 160, height: 40, iconSize: 40 },
  lg: { width: 200, height: 48, iconSize: 48 },
  xl: { width: 280, height: 64, iconSize: 64 },
};

export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, size = 'md', variant = 'full', theme = 'default', fullScale = 1, ...props }, ref) => {
    const dimensions = logoSizes[size];
    
    const colors = {
      default: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        text: '#0F172A',
      },
      white: {
        primary: '#FFFFFF',
        secondary: '#E2E8F0',
        text: '#FFFFFF',
      },
      dark: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        text: '#F8FAFC',
      },
    };

    const color = colors[theme];

    // Resolve file names for SVGs based on theme (use reverse variants for white theme)
    const logoFiles = {
      icon: theme === 'white' ? '/logo-icon-reverse.svg' : '/logo-icon.svg',
      full: theme === 'white' ? '/logo-designer-reverse.svg' : '/logo-designer.svg',
    };

    // Icon-only variant: embed the brand SVG from the public folder
    if (variant === 'icon') {
      return (
        <svg
          ref={ref}
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox={`0 0 ${dimensions.iconSize} ${dimensions.iconSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('flex-shrink-0', className)}
          aria-label="Designer Marketplace"
          role="img"
          {...props}
        >
          <image
            href={logoFiles.icon}
            x="0"
            y="0"
            width={dimensions.iconSize}
            height={dimensions.iconSize}
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      );
    }

    // Wordmark-only variant
    if (variant === 'wordmark') {
      const w = Math.round(dimensions.width * fullScale);
      const h = Math.round(dimensions.height * fullScale);
      return (
        <svg
          ref={ref}
          width={w}
          height={h}
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('flex-shrink-0', className)}
          aria-label="Designer Marketplace"
          role="img"
          {...props}
        >
          <g transform={`scale(${fullScale})`}>
            <text
              x="0"
              y="32"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="24"
              fontWeight="700"
              fill={color.text}
            >
              Designer
            </text>
          </g>
        </svg>
      );
    }

    // Full logo (icon + wordmark) — allow scaling via fullScale without changing icon behavior
    const fullW = Math.round(dimensions.width * fullScale);
    const fullH = Math.round(dimensions.height * fullScale);
    return (
      <svg
        ref={ref}
        width={fullW}
        height={fullH}
        viewBox="0 0 200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('flex-shrink-0', className)}
        aria-label="Designer Marketplace"
        role="img"
        {...props}
      >
        <image
          href={logoFiles.full}
          x="0"
          y="0"
          width={200}
          height={48}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    );
  }
);

Logo.displayName = 'Logo';

// =============================================================================
// ICON COMPONENTS
// =============================================================================

export interface IconProps extends React.SVGAttributes<SVGElement> {
  /** Size in pixels or preset */
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Stroke width */
  strokeWidth?: number;
}

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const getIconSize = (size: number | string): number => {
  if (typeof size === 'number') return size;
  return iconSizes[size as keyof typeof iconSizes] || 20;
};

// Base icon wrapper
const createIcon = (
  name: string,
  paths: React.ReactNode
) => {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ className, size = 'md', strokeWidth = 2, ...props }, ref) => {
      const iconSize = getIconSize(size);
      
      return (
        <svg
          ref={ref}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('flex-shrink-0', className)}
          aria-hidden="true"
          {...props}
        >
          {paths}
        </svg>
      );
    }
  );
  
  Icon.displayName = name;
  return Icon;
};

// Navigation Icons
export const IconHome = createIcon('IconHome', (
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>
));

export const IconSearch = createIcon('IconSearch', (
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
));

export const IconBell = createIcon('IconBell', (
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
));

export const IconMenu = createIcon('IconMenu', (
  <>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
));

export const IconClose = createIcon('IconClose', (
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
));

// User Icons
export const IconUser = createIcon('IconUser', (
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
));

export const IconUsers = createIcon('IconUsers', (
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
));

export const IconSettings = createIcon('IconSettings', (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>
));

// Action Icons
export const IconPlus = createIcon('IconPlus', (
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
));

export const IconMinus = createIcon('IconMinus', (
  <line x1="5" y1="12" x2="19" y2="12" />
));

export const IconEdit = createIcon('IconEdit', (
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>
));

export const IconTrash = createIcon('IconTrash', (
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
));

export const IconDownload = createIcon('IconDownload', (
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>
));

export const IconUpload = createIcon('IconUpload', (
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>
));

// Status Icons
export const IconCheck = createIcon('IconCheck', (
  <polyline points="20 6 9 17 4 12" />
));

export const IconCheckCircle = createIcon('IconCheckCircle', (
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>
));

export const IconAlertCircle = createIcon('IconAlertCircle', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
));

export const IconAlertTriangle = createIcon('IconAlertTriangle', (
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>
));

export const IconInfo = createIcon('IconInfo', (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
));

// Commerce Icons
export const IconShoppingCart = createIcon('IconShoppingCart', (
  <>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </>
));

export const IconHeart = createIcon('IconHeart', (
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
));

export const IconStar = createIcon('IconStar', (
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
));

export const IconCreditCard = createIcon('IconCreditCard', (
  <>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </>
));

// Communication Icons
export const IconMail = createIcon('IconMail', (
  <>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </>
));

export const IconMessageCircle = createIcon('IconMessageCircle', (
  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
));

export const IconSend = createIcon('IconSend', (
  <>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </>
));

// Direction Icons
export const IconChevronDown = createIcon('IconChevronDown', (
  <polyline points="6 9 12 15 18 9" />
));

export const IconChevronUp = createIcon('IconChevronUp', (
  <polyline points="18 15 12 9 6 15" />
));

export const IconChevronLeft = createIcon('IconChevronLeft', (
  <polyline points="15 18 9 12 15 6" />
));

export const IconChevronRight = createIcon('IconChevronRight', (
  <polyline points="9 18 15 12 9 6" />
));

export const IconArrowRight = createIcon('IconArrowRight', (
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </>
));

export const IconArrowLeft = createIcon('IconArrowLeft', (
  <>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </>
));

export const IconExternalLink = createIcon('IconExternalLink', (
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>
));

// Misc Icons
export const IconCalendar = createIcon('IconCalendar', (
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>
));

export const IconClock = createIcon('IconClock', (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
));

export const IconFilter = createIcon('IconFilter', (
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
));

export const IconGrid = createIcon('IconGrid', (
  <>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </>
));

export const IconList = createIcon('IconList', (
  <>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </>
));

export const IconImage = createIcon('IconImage', (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </>
));

export const IconFile = createIcon('IconFile', (
  <>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </>
));

export const IconFolder = createIcon('IconFolder', (
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
));

export const IconEye = createIcon('IconEye', (
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>
));

export const IconEyeOff = createIcon('IconEyeOff', (
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>
));

export const IconLock = createIcon('IconLock', (
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
));

export const IconUnlock = createIcon('IconUnlock', (
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </>
));

export const IconShare = createIcon('IconShare', (
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>
));

export const IconCopy = createIcon('IconCopy', (
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>
));

export const IconRefresh = createIcon('IconRefresh', (
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>
));

export const IconLogout = createIcon('IconLogout', (
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </>
));

// Social Icons
export const IconGithub = createIcon('IconGithub', (
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
));

export const IconTwitter = createIcon('IconTwitter', (
  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
));

export const IconLinkedin = createIcon('IconLinkedin', (
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </>
));

export default Logo;

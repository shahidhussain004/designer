/**
 * Design System Tokens
 * =====================
 * Centralized design tokens for Designer Marketplace
 * Based on 4px/8px grid system, WCAG 2.1 AA compliant colors
 * 
 * Usage:
 * import { colors, spacing, typography } from '@/lib/design-system/tokens';
 */

// =============================================================================
// COLOR PALETTE
// All colors meet WCAG 2.1 AA contrast requirements (4.5:1 for text)
// =============================================================================

export const colors = {
  // Primary Brand Colors - Blue
  primary: {
    50: '#EFF6FF',   // Lightest - backgrounds
    100: '#DBEAFE',  // Light backgrounds
    200: '#BFDBFE',  // Borders, hover states
    300: '#93C5FD',  // Disabled states
    400: '#60A5FA',  // Icons
    500: '#3B82F6',  // Default brand color
    600: '#2563EB',  // Primary buttons, links (AA compliant on white)
    700: '#1D4ED8',  // Hover states
    800: '#1E40AF',  // Active states
    900: '#1E3A8A',  // Text on light backgrounds
    950: '#172554',  // Darkest - headers
  },

  // Secondary Colors - Slate/Gray
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',   // Body text (AA compliant)
    700: '#334155',   // Headings
    800: '#1E293B',   // Strong text
    900: '#0F172A',   // Maximum contrast
    950: '#020617',
  },

  // Success - Green (for positive actions, success states)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',   // Success badges
    600: '#16A34A',   // Success buttons (AA compliant)
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning - Amber (for caution, pending states)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',   // Warning badges
    600: '#D97706',   // Warning buttons (use with dark text)
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error - Red (for destructive actions, errors)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',   // Error badges
    600: '#DC2626',   // Error buttons (AA compliant)
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info - Cyan (for informational content)
  info: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',   // Info buttons (AA compliant)
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // Neutral backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    inverse: '#0F172A',
  },

  // Text colors
  text: {
    primary: '#0F172A',     // 21:1 contrast on white
    secondary: '#475569',   // 7.1:1 contrast on white (AA compliant)
    tertiary: '#64748B',    // 4.6:1 contrast on white (AA compliant)
    disabled: '#94A3B8',    // Use only for disabled text with indicators
    inverse: '#FFFFFF',     // For dark backgrounds
    link: '#2563EB',        // 4.5:1 contrast on white
    linkHover: '#1D4ED8',
  },

  // Border colors
  border: {
    light: '#E2E8F0',
    default: '#CBD5E1',
    strong: '#94A3B8',
    focus: '#2563EB',       // Focus rings
  },

  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },
} as const;

// =============================================================================
// SPACING SYSTEM
// Based on 4px base unit (rem values for accessibility)
// =============================================================================

export const spacing = {
  // Base unit: 4px = 0.25rem
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px - minimum touch target
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// =============================================================================
// TYPOGRAPHY
// System font stack with fallbacks
// =============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
  },

  // Font sizes with line heights
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],           // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],       // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],          // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],       // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],        // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
    '5xl': ['3rem', { lineHeight: '1' }],              // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],           // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],            // 72px
    '8xl': ['6rem', { lineHeight: '1' }],              // 96px
    '9xl': ['8rem', { lineHeight: '1' }],              // 128px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// =============================================================================
// SHADOWS
// Elevation system for depth
// =============================================================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Focus rings for accessibility
  focusRing: '0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB',
  focusRingError: '0 0 0 2px #FFFFFF, 0 0 0 4px #DC2626',
} as const;

// =============================================================================
// BORDER RADIUS
// Consistent roundness
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',     // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Pill shape
} as const;

// =============================================================================
// TRANSITIONS
// Smooth animations
// =============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    default: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// =============================================================================
// BREAKPOINTS
// Responsive design
// =============================================================================

export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const;

// =============================================================================
// Z-INDEX SCALE
// Layering system
// =============================================================================

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',      // Default elements
  20: '20',      // Dropdowns
  30: '30',      // Fixed elements
  40: '40',      // Modals backdrop
  50: '50',      // Modals
  60: '60',      // Popovers
  70: '70',      // Tooltips
  80: '80',      // Notifications
  90: '90',      // Maximum
  100: '100',    // Critical overlays
} as const;

// =============================================================================
// COMPONENT SIZES
// Consistent sizing for buttons, inputs, etc.
// =============================================================================

export const componentSizes = {
  // Button/Input heights (including padding)
  xs: '1.75rem',    // 28px
  sm: '2rem',       // 32px
  md: '2.5rem',     // 40px
  lg: '2.75rem',    // 44px - minimum touch target
  xl: '3rem',       // 48px
  
  // Icon sizes
  icon: {
    xs: '0.875rem', // 14px
    sm: '1rem',     // 16px
    md: '1.25rem',  // 20px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  
  // Avatar sizes
  avatar: {
    xs: '1.5rem',   // 24px
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
    xl: '4rem',     // 64px
    '2xl': '5rem',  // 80px
  },
} as const;

// =============================================================================
// ACCESSIBILITY
// Focus and interactive state helpers
// =============================================================================

export const accessibility = {
  // Minimum touch target size (WCAG 2.5.5)
  minTouchTarget: '44px',
  
  // Minimum contrast ratios
  contrastRatio: {
    normal: 4.5,  // Normal text
    large: 3,     // Large text (18px+ or 14px bold)
    ui: 3,        // UI components and graphics
  },
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const designTokens = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
  breakpoints,
  zIndex,
  componentSizes,
  accessibility,
} as const;

export default designTokens;

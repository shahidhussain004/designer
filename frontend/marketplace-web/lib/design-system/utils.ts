/**
 * Utility Functions for Design System
 * ====================================
 * Helper functions for class merging, accessibility, and component styling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate unique ID for accessibility
 */
export function generateId(prefix: string = 'dm'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Focus trap for modals and dialogs
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Format keyboard shortcut for display
 */
export function formatKeyboardShortcut(keys: string[]): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  
  return keys.map(key => {
    switch (key.toLowerCase()) {
      case 'ctrl':
      case 'control':
        return isMac ? '⌘' : 'Ctrl';
      case 'alt':
        return isMac ? '⌥' : 'Alt';
      case 'shift':
        return isMac ? '⇧' : 'Shift';
      case 'enter':
        return isMac ? '↵' : 'Enter';
      case 'escape':
      case 'esc':
        return 'Esc';
      case 'backspace':
        return isMac ? '⌫' : 'Backspace';
      case 'delete':
        return isMac ? '⌦' : 'Del';
      case 'arrowup':
        return '↑';
      case 'arrowdown':
        return '↓';
      case 'arrowleft':
        return '←';
      case 'arrowright':
        return '→';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }).join(isMac ? '' : ' + ');
}

/**
 * Check color contrast ratio
 * Returns contrast ratio between two colors
 */
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => {
      const value = parseInt(x, 16) / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    }) || [0, 0, 0];
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 */
export function meetsContrastRequirement(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lock body scroll (for modals)
 */
export function lockBodyScroll(): () => void {
  const scrollY = window.scrollY;
  const body = document.body;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';

  return () => {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    window.scrollTo(0, scrollY);
  };
}

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = getViewport();
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= viewport.height + threshold &&
    rect.right <= viewport.width + threshold
  );
}

/**
 * Component variant helper
 * Creates type-safe variant classes for components
 */
export type VariantProps<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K];
};

export function createVariants<T extends Record<string, Record<string, string>>>(
  variants: T
) {
  return (props: VariantProps<T>): string => {
    return Object.entries(props)
      .map(([key, value]) => {
        if (value && variants[key] && variants[key][value as string]) {
          return variants[key][value as string];
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };
}

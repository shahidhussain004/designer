/**
 * Tabs Component
 * ===============
 * Accessible tabbed interface with keyboard navigation
 */

'use client';

import React, { forwardRef, useState, useRef, useCallback, createContext, useContext } from 'react';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// CONTEXT
// =============================================================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'default' | 'pills' | 'underline';
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// =============================================================================
// TABS CONTAINER
// =============================================================================

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently active tab */
  value?: string;
  /** Default active tab */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Visual variant */
  variant?: 'default' | 'pills' | 'underline';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      children,
      value,
      defaultValue,
      onChange,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const activeTab = value ?? internalValue;

    const setActiveTab = useCallback((id: string) => {
      if (!value) {
        setInternalValue(id);
      }
      onChange?.(id);
    }, [value, onChange]);

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size, orientation }}>
        <div
          ref={ref}
          className={cn(
            orientation === 'vertical' && 'flex gap-4',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// =============================================================================
// TAB LIST
// =============================================================================

export type TabListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, orientation } = useTabsContext();
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const tabs = listRef.current?.querySelectorAll('[role="tab"]:not([disabled])');
      if (!tabs) return;

      const tabArray = Array.from(tabs) as HTMLElement[];
      const currentIndex = tabArray.findIndex(tab => tab === document.activeElement);

      let nextIndex = currentIndex;

      const isHorizontal = orientation === 'horizontal';

      switch (event.key) {
        case 'ArrowRight':
          if (isHorizontal) {
            nextIndex = currentIndex < tabArray.length - 1 ? currentIndex + 1 : 0;
          }
          break;
        case 'ArrowLeft':
          if (isHorizontal) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabArray.length - 1;
          }
          break;
        case 'ArrowDown':
          if (!isHorizontal) {
            nextIndex = currentIndex < tabArray.length - 1 ? currentIndex + 1 : 0;
          }
          break;
        case 'ArrowUp':
          if (!isHorizontal) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabArray.length - 1;
          }
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabArray.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        event.preventDefault();
        tabArray[nextIndex].focus();
        tabArray[nextIndex].click();
      }
    };

    return (
      <div
        ref={(node) => {
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          variant === 'default' && [
            'border-b border-secondary-200',
            orientation === 'vertical' && 'border-b-0 border-r',
          ],
          variant === 'pills' && 'bg-secondary-100 p-1 rounded-lg gap-1',
          variant === 'underline' && 'gap-8 border-b border-secondary-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

// =============================================================================
// TAB
// =============================================================================

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tab identifier */
  value: string;
  /** Icon */
  icon?: React.ReactNode;
}

const tabSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, icon, children, disabled, ...props }, ref) => {
    const { activeTab, setActiveTab, variant, size } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${value}`}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          tabSizes[size],
          // Default variant
          variant === 'default' && [
            'relative -mb-px border-b-2',
            isActive
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300',
          ],
          // Pills variant
          variant === 'pills' && [
            'rounded-md',
            isActive
              ? 'bg-white text-secondary-900 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-900 hover:bg-white/50',
          ],
          // Underline variant
          variant === 'underline' && [
            'relative pb-3',
            isActive
              ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500'
              : 'text-secondary-500 hover:text-secondary-700',
          ],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

// =============================================================================
// TAB PANEL
// =============================================================================

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel identifier (must match Tab value) */
  value: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        aria-labelledby={value}
        tabIndex={0}
        className={cn(
          'focus:outline-none',
          'animate-in fade-in-0 duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

export default Tabs;

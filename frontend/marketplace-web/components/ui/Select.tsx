/**
 * Select Component
 * =================
 * Accessible dropdown select with search and multi-select support
 */

'use client';

import { cn } from '@/lib/design-system/utils';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of options */
  options: SelectOption[];
  /** Current value(s) */
  value?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Multiple selection mode */
  multiple?: boolean;
  /** Enable search/filter */
  searchable?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Custom no options message */
  noOptionsMessage?: string;
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-5 text-lg',
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      helperText,
      error,
      multiple = false,
      searchable = false,
      disabled = false,
      required = false,
      size = 'md',
      fullWidth = false,
      noOptionsMessage = 'No options found',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    
    const selectId = useRef(`select-${Math.random().toString(36).substr(2, 9)}`);
    const labelId = `${selectId.current}-label`;
    const helperId = `${selectId.current}-helper`;
    const listboxId = `${selectId.current}-listbox`;

    // Normalize value to array (memoized so it doesn't change reference each render)
    const selectedValues: string[] = React.useMemo(() =>
      multiple
        ? (Array.isArray(value) ? value : value ? [value] : [])
        : (value ? [value as string] : []),
      // depend on value and multiple only
      [value, multiple]
    );

    // Filter options based on search
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get display text
    const displayText = selectedValues.length > 0
      ? selectedValues
          .map(v => options.find(o => o.value === v)?.label)
          .filter(Boolean)
          .join(', ')
      : '';

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = useCallback((optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchQuery('');
      }
    }, [multiple, selectedValues, onChange]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex >= 0) {
            const option = filteredOptions[highlightedIndex];
            if (option && !option.disabled) {
              handleSelect(option.value);
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Home':
          event.preventDefault();
          setHighlightedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
        case 'Tab':
          setIsOpen(false);
          setSearchQuery('');
          break;
      }
    }, [disabled, isOpen, highlightedIndex, filteredOptions, handleSelect]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      onChange?.(multiple ? [] : '');
    };

    return (
      <div
        ref={ref}
        className={cn('relative', fullWidth && 'w-full', className)}
        {...props}
      >
        {/* Label */}
        {label && (
          <label
            id={labelId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
            {required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Select button */}
        <div ref={containerRef}>
          <button
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={helperText || error ? helperId : undefined}
            aria-invalid={!!error}
            aria-required={required}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full flex items-center justify-between',
              'bg-white border rounded-lg transition-all duration-200',
              'focus:outline-none',
              sizes[size],
              error
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
                : 'border-secondary-300 hover:border-secondary-400',
              disabled && 'bg-secondary-50 text-secondary-500 cursor-not-allowed',
              isOpen && 'ring-2 ring-primary-500 border-primary-500'
            )}
          >
            <span className={cn(
              'truncate',
              !displayText && 'text-secondary-400'
            )}>
              {displayText || placeholder}
            </span>

            <div className="flex items-center gap-1 ml-2">
              {/* Clear button */}
              {selectedValues.length > 0 && !disabled && (
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="p-1 hover:bg-secondary-100 rounded transition-colors"
                  aria-label="Clear selection"
                >
                  <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              )}

              {/* Chevron */}
              <svg
                className={cn(
                  'w-5 h-5 text-secondary-400 transition-transform',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              className={cn(
                'absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg',
                'animate-in fade-in-0 zoom-in-95 duration-200'
              )}
            >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-secondary-200">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={cn(
                      'w-full px-3 py-2 text-sm',
                      'border border-secondary-300 rounded-md',
                      'focus:outline-none'
                    )}
                  />
                </div>
              )}

              {/* Options list */}
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={labelId}
                aria-multiselectable={multiple}
                className="max-h-60 overflow-auto py-1"
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedValues.includes(option.value);
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={cn(
                          'px-4 py-2 cursor-pointer flex items-center gap-2',
                          'transition-colors duration-100',
                          isSelected && 'bg-primary-50 text-primary-700',
                          isHighlighted && !isSelected && 'bg-secondary-100',
                          option.disabled && 'text-secondary-400 cursor-not-allowed'
                        )}
                      >
                        {/* Checkbox for multi-select */}
                        {multiple && (
                          <span
                            className={cn(
                              'w-4 h-4 flex items-center justify-center',
                              'border rounded transition-colors',
                              isSelected
                                ? 'bg-primary-500 border-primary-500 text-white'
                                : 'border-secondary-300'
                            )}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                        )}

                        {/* Icon */}
                        {option.icon && <span className="shrink-0">{option.icon}</span>}

                        {/* Label */}
                        <span className="truncate">{option.label}</span>

                        {/* Checkmark for single select */}
                        {!multiple && isSelected && (
                          <svg className="w-5 h-5 ml-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-3 text-sm text-secondary-500 text-center">
                    {noOptionsMessage}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Helper text / Error */}
        {(helperText || error) && (
          <p
            id={helperId}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-error-500' : 'text-secondary-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

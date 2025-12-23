/**
 * Navigation Component
 * =====================
 * Professional navigation bar with responsive design
 */

'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/design-system/utils';
import { Avatar } from './Avatar';
import { Button } from './Button';

// =============================================================================
// NAVBAR
// =============================================================================

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo or brand element */
  logo?: React.ReactNode;
  /** Navigation items */
  items?: NavItem[];
  /** User info for avatar menu */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  /** Actions in the navbar */
  actions?: React.ReactNode;
  /** Sticky behavior */
  sticky?: boolean;
  /** Transparent on top */
  transparent?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: Omit<NavItem, 'children'>[];
  badge?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      items = [],
      user,
      actions,
      sticky = true,
      transparent = false,
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
      <nav
        ref={ref}
        className={cn(
          'w-full z-sticky',
          sticky && 'sticky top-0',
          transparent && !scrolled
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md border-b border-secondary-200',
          'transition-all duration-300',
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              {logo || (
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <span className="font-semibold text-lg text-secondary-900">
                    Designer
                  </span>
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {items.map((item) => (
                <NavbarItem key={item.href} item={item} isActive={isActive(item.href)} />
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {actions}
              
              {user && (
                <UserMenu user={user} />
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200">
            <div className="px-4 py-3 space-y-1">
              {items.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </nav>
    );
  }
);

Navbar.displayName = 'Navbar';

// =============================================================================
// NAVBAR ITEM (Desktop)
// =============================================================================

interface NavbarItemProps {
  item: NavItem;
  isActive: boolean;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ item, isActive }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (item.children && item.children.length > 0) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
            'transition-colors duration-200',
            isActive
              ? 'text-primary-600 bg-primary-50'
              : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
          )}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          {item.label}
          <svg
            className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                onClick={() => setDropdownOpen(false)}
              >
                {child.icon && <span className="w-4 h-4">{child.icon}</span>}
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
        'transition-colors duration-200',
        isActive
          ? 'text-primary-600 bg-primary-50'
          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
      )}
    >
      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
      {item.label}
      {item.badge && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

// =============================================================================
// MOBILE NAV ITEM
// =============================================================================

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, isActive, onNavigate }) => {
  const [expanded, setExpanded] = useState(false);

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium',
            'transition-colors duration-200',
            isActive
              ? 'text-primary-600 bg-primary-50'
              : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="w-5 h-5">{item.icon}</span>}
            {item.label}
          </span>
          <svg
            className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
              >
                {child.icon && <span className="w-4 h-4">{child.icon}</span>}
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
        'transition-colors duration-200',
        isActive
          ? 'text-primary-600 bg-primary-50'
          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
      )}
    >
      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
      {item.label}
    </Link>
  );
};

// =============================================================================
// USER MENU
// =============================================================================

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar src={user.avatar} name={user.name} size="sm" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-secondary-100">
            <p className="text-sm font-medium text-secondary-900">{user.name}</p>
            <p className="text-xs text-secondary-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
          
          <div className="border-t border-secondary-100 py-1">
            <button
              type="button"
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

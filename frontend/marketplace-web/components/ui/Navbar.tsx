'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

// =============================================================================
// NAVIGATION DATA
// =============================================================================

const navigation: NavItem[] = [
  { label: 'Browse Projects', href: '/projects' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Talents', href: '/talents' },
  {
    label: 'Learn',
    href: '#',
    children: [
      { label: 'Courses', href: '/courses', description: 'Master new skills' },
      { label: 'Tutorials', href: '/tutorials', description: 'Step-by-step guides' },
      { label: 'Resources', href: '/resources', description: 'Articles & insights' },
    ],
  },
  { label: 'Design Studio', href: '/design-studio' },
];

// =============================================================================
// DROPDOWN COMPONENT
// =============================================================================

const NavDropdown: React.FC<{
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({ item, isOpen, onToggle, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        {item.label}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && item.children && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="block text-sm font-medium text-gray-900">{child.label}</span>
              {child.description && (
                <span className="block text-xs text-gray-500 mt-0.5">{child.description}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MOBILE MENU COMPONENT
// =============================================================================

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}> = ({ isOpen, onClose, pathname }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image src="/logo-designer.png" alt="Designer" width={140} height={32} className="object-contain" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div className="space-y-1">
                  <span className="block px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`block px-3 py-2 text-base rounded-lg transition-colors ${
                        pathname === child.href
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-3 py-2 text-base rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        {/* Mobile CTA buttons */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-3">
          <Link
            href="/auth/login"
            onClick={onClose}
            className="block w-full px-4 py-2.5 text-center text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            onClick={onClose}
            className="block w-full px-4 py-2.5 text-center text-white font-medium bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN NAVBAR COMPONENT
// =============================================================================

export const Navbar: React.FC<NavbarProps> = ({ className: _className }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                src="/logo-designer.png" 
                alt="Designer Marketplace" 
                width={160} 
                height={36} 
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navigation.map((item) =>
                item.children ? (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isOpen={openDropdown === item.label}
                    onToggle={() => handleDropdownToggle(item.label)}
                    onClose={() => setOpenDropdown(null)}
                  />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;

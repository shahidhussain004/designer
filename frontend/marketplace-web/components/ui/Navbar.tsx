'use client';

import { authService } from '@/lib/auth';
import { useAuth } from '@/lib/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
// USER DROPDOWN COMPONENT
// =============================================================================

type User = { id?: number | string; fullName?: string; username?: string; email?: string; role?: string };

const UserDropdown: React.FC<{
  user: User;
  onLogout: () => void;
  onClose: () => void;
}> = ({ user, onLogout, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const getInitials = () => user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U';
  const getRoleColor = (role?: string) => {
    if (!role) return 'bg-secondary-100 text-secondary-700';
    if (role.toLowerCase().includes('freelancer')) return 'bg-blue-100 text-blue-700';
    if (role.toLowerCase().includes('client')) return 'bg-purple-100 text-purple-700';
    if (role.toLowerCase().includes('admin')) return 'bg-red-100 text-red-700';
    return 'bg-primary-100 text-primary-700';
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors rounded-lg hover:bg-secondary-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {getInitials()}
        </div>
        <span className="hidden sm:inline text-secondary-900">{user.fullName || user.username}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-secondary-100 py-1 z-50 animate-fade-in overflow-hidden">
          {/* User Info Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-secondary-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-secondary-900 truncate">{user.fullName || user.username}</p>
              <p className="text-xs text-secondary-500 truncate">{user.email}</p>
              {user.role && (
                <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* Main Menu Items */}
          <nav className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-secondary-500 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>View Profile</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-secondary-500 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* Divider */}
          <div className="h-px bg-secondary-100" />

          {/* Settings & Support */}
          <nav className="py-2">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-secondary-500 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Account Settings</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-secondary-500 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help & Support</span>
            </Link>
          </nav>

          {/* Divider */}
          <div className="h-px bg-secondary-100" />

          {/* Logout */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-error-500 group-hover:text-error-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors rounded-lg hover:bg-secondary-50"
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
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-secondary-100 py-2 z-50 animate-fade-in">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block px-4 py-3 hover:bg-secondary-50 transition-colors"
            >
              <span className="block text-sm font-medium text-secondary-900">{child.label}</span>
              {child.description && (
                <span className="block text-xs text-secondary-500 mt-0.5">{child.description}</span>
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
  user: User | null;
  loading: boolean;
  onLogout: () => void;
  authInitialized: boolean;
  currentUser: User | null;
}> = ({ isOpen, onClose, pathname, user, loading, onLogout, authInitialized, currentUser }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Menu panel with flex layout for proper scrolling */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-secondary-100 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center">
            <div style={{ position: 'relative', width: '160px', height: '54px' }}>
              <Image
                src="/logo-designer.png"
                alt="Designer"
                fill
                sizes="160px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-secondary-500 hover:text-secondary-700 rounded-lg hover:bg-secondary-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="space-y-1">
                    <span className="block px-3 py-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
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
                            : 'text-secondary-700 hover:bg-secondary-50'
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
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Info Section - Scrollable with navigation */}
          {authInitialized && currentUser && (
            <div className="px-4 py-4 border-t border-secondary-100">
              <div className="px-4 py-3 bg-gradient-to-br from-primary-50 to-primary-25 rounded-lg border border-primary-100 mb-4">
                <p className="text-sm font-semibold text-secondary-900">{currentUser.fullName || currentUser.username}</p>
                <p className="text-xs text-secondary-600 mt-1">{currentUser.email}</p>
                {currentUser.role && (
                  <p className="text-xs text-primary-600 font-medium mt-2 bg-white bg-opacity-60 px-2 py-1 rounded w-fit">
                    {currentUser.role}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2.5 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2.5 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2.5 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at Bottom */}
        <div className="border-t border-secondary-100 p-4 flex-shrink-0 bg-secondary-50">
          {authInitialized && currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-error-600 font-medium border border-error-300 rounded-lg hover:bg-error-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full px-4 py-2.5 text-center text-secondary-700 font-medium border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
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
          )}
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
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize auth from storage on mount
  useEffect(() => {
    // Check if user is in storage immediately
    const storedUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    if (storedUser && isAuthenticated) {
      setCurrentUser(storedUser);
    }
    setAuthInitialized(true);
  }, []);

  // Update currentUser when context user changes
  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    }
  }, [user, loading]);

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    refreshUser();
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-secondary-100">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div style={{ position: 'relative', width: '160px', height: '54px' }}>
                <Image
                  src="/logo-designer.png"
                  alt="Designer Marketplace"
                  fill
                  priority
                  sizes="160px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
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
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {authInitialized && currentUser ? (
                <UserDropdown
                  user={currentUser}
                  onLogout={handleLogout}
                  onClose={() => {}}
                />
              ) : authInitialized ? (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-secondary-500 hover:text-secondary-700 rounded-lg hover:bg-secondary-100"
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
        user={user}
        loading={loading}
        onLogout={handleLogout}
        authInitialized={authInitialized}
        currentUser={currentUser}
      />
    </>
  );
};

export default Navbar;

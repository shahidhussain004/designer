'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FluidAccountDropdown } from './fluid-account-dropdown';
import { FluidNotificationsDropdown } from './fluid-notifications-dropdown';
import './navbar.css';

// =============================================================================
// NAVBAR
// =============================================================================

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

export const Navbar = ({ className: _className }: NavbarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Left Section: Logo + Nav Links */}
        <div className="navbar-left">
          <Link href="/" className="navbar-brand">
            <span>Designer Marketplace</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link
                href="/jobs"
                className={`nav-item ${isActive('/jobs') ? 'nav-item-active' : ''}`}
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/courses"
                className={`nav-item ${isActive('/courses') ? 'nav-item-active' : ''}`}
              >
                Courses
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Notifications + Account */}
        <div className="navbar-right">
          <FluidNotificationsDropdown />
          <FluidAccountDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

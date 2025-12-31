'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import AnimatedButton from './AnimatedButton';
import { FluidLogo, FluidNavLinks } from './FluidHeader';
import { FluidNotificationsDropdown } from './FluidNotificationsDropdown';
import './styles/navbar.css';

// =============================================================================
// NAVBAR
// =============================================================================

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

export const Navbar = ({ className: _className }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Left Section: Logo + Nav Links */}
        <div className="navbar-left">
          <FluidLogo />
          <FluidNavLinks pathname={pathname} />
        </div>

        {/* Right Section: Notifications + Account */}
        <div className="navbar-right">
          <FluidNotificationsDropdown />
          <Link href="/auth/login" className="text-gray-200 hover:text-white transition-colors">Login</Link>
          <Link href="/get-started">
            <AnimatedButton variant="slim" className="border border-white/20 text-white px-4 py-2 rounded-md bg-transparent hover:bg-white/6 transition-colors">
              <span className="flex items-center">Sign Up</span>
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

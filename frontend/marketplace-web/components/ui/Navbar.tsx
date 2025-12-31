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
          <Link href="/auth/login" className="hover:text-pink-300 transition-colors">Login</Link>
          <Link href="/get-started">
            <AnimatedButton variant="slim" className="bg-white text-black hover:bg-gray-100">
              <span className="flex items-center">Sign Up</span>
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

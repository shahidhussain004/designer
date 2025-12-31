'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { FluidAccountDropdown } from './FluidAccountDropdown';
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
          <FluidAccountDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

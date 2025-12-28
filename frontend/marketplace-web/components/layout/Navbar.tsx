'use client';

import { FluidAccountDropdown } from '@/components/ui/fluid-account-dropdown';
import { FluidNotificationsDropdown } from '@/components/ui/fluid-notifications-dropdown';
import { FluidLogo, FluidNavLinks } from '@/components/ui/FluidHeader';
import { usePathname } from 'next/navigation';
import './navbar.css';

// Nav items are provided by FluidNavLinks

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Left Section: Logo + Navigation Links */}
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
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FluidNotificationsDropdown } from '@/components/ui/fluid-notifications-dropdown';
import { FluidAccountDropdown } from '@/components/ui/fluid-account-dropdown';
import './navbar.css';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Courses', href: '/courses' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Left Section: Logo + Navigation Links */}
        <div className="navbar-left">
          <Link href="/" className="navbar-brand">
            Designer Marketplace
          </Link>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'nav-item-active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
}

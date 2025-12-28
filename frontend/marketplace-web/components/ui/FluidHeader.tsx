 'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Find Work', href: '/jobs' },
  { label: 'Hire Talent', href: '/talent' },
  { label: 'Courses', href: '/courses' },
  { label: 'Resources', href: '/resources' },

];

export const FluidLogo: React.FC = () => (
  <Link href="/" className="navbar-brand">
    <Image src="/logo-reverse-designer.png" alt="Designer Marketplace" width={160} height={36} className="object-contain" />
  </Link>
);

export const FluidNavLinks: React.FC<{ pathname?: string }> = ({ pathname = '/' }) => (
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
);

// Named exports only

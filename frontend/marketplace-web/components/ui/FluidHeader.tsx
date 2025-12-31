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
  { label: 'Hire Talent', href: '/talents' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Courses', href: '/courses' },
  { label: 'Resources', href: '/resources' },
  { label: 'Design Studio', href: '/design-studio' },
];

export const FluidLogo: React.FC = () => (
  <Link href="/" className="navbar-brand flex items-center">
    <Image src="/logo-reverse-designer.png" alt="Designer Marketplace" width={160} height={36} className="object-contain invert" />
  </Link>
);

export const FluidNavLinks: React.FC<{ pathname?: string }> = ({ pathname = '/' }) => (
  <ul className="nav-links flex gap-8">
    {navItems.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          className={`text-white hover:text-gray-200 transition-colors text-sm font-medium ${
            pathname === item.href ? 'border-b-2 border-white' : ''
          }`}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

// Named exports only

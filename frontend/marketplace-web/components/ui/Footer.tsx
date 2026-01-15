'use client';

import Link from 'next/link';
import React from 'react';
import { Logo } from './Icons';

// =============================================================================
// FOOTER DATA
// =============================================================================

const footerLinks = {
  forFreelancers: {
    title: 'For Freelancers',
    links: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Browse Projects', href: '/projects' },
      { label: 'Create Portfolio', href: '/portfolio' },
      { label: 'Skills Assessment', href: '/skills' },
      { label: 'Freelancer Resources', href: '/resources' },
    ],
  },
  forEmployers: {
    title: 'For Employers',
    links: [
      { label: 'Post a Job', href: '/jobs/create' },
      { label: 'Browse Talents', href: '/talents' },
      { label: 'Pricing Plans', href: '/pricing' },
      { label: 'Hiring Solutions', href: '/solutions' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
  },
  learn: {
    title: 'Learn',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Blog', href: '/resources' },
      { label: 'Design Studio', href: '/design-studio' },
      { label: 'Career Guide', href: '/career-guide' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partners', href: '/partners' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Security', href: '/security' },
    ],
  },
};

const socialLinks = [
  { 
    name: 'Twitter', 
    href: 'https://twitter.com', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  { 
    name: 'GitHub', 
    href: 'https://github.com', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  { 
    name: 'YouTube', 
    href: 'https://youtube.com', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  minimal?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, minimal = false, ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    if (minimal) {
      return (
        <footer
          ref={ref}
          className={`w-full bg-gray-900 py-6 ${className || ''}`}
          {...props}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                © {currentYear} Designer Marketplace. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    return (
      <footer
        ref={ref}
        className={`w-full bg-gray-900 ${className || ''}`}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
              <Link href="/" className="flex items-center gap-2 mb-4 justify-start">
                <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                  <Logo variant="icon" theme="white" size="lg" className="h-[40px] w-[40px]" />
                </div>
                <span className="hidden sm:inline text-lg font-extralight text-white">Designer</span>
              </Link>
              <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
                The premier platform connecting talented designers and developers with innovative companies worldwide.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={social.name ?? `social-${idx}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                    aria-label={social.name ?? 'social'}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter signup */}
          <div className="py-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-semibold text-white mb-1">Stay up to date</h3>
                <p className="text-sm text-gray-400">Get the latest jobs, tutorials, and platform updates.</p>
              </div>
              <form className="flex gap-3 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © {currentYear} Designer Marketplace. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Cookie Policy
                </Link>
                <Link href="/accessibility" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Accessibility
                </Link>
                <Link href="/design-system" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Design System
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;

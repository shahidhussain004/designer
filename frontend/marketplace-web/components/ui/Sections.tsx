'use client';

import Link from 'next/link';
import React from 'react';

// =============================================================================
// HERO SECTION
// =============================================================================

export interface HeroSectionProps {
  title: string | React.ReactNode;
  subtitle?: string;
  badge?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  ctaButton?: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
  variant?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  badge,
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  ctaButton,
  secondaryButton,
  variant = 'light',
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const isDark = variant === 'dark';

  return (
    <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600 mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              {badge}
            </div>
          )}
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={`mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              {subtitle}
            </p>
          )}

          {showSearch && (
            <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
              <div className="flex gap-3 p-2 bg-white rounded-xl border border-gray-200 shadow-lg">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full py-2 bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          )}

          {(ctaButton || secondaryButton) && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {ctaButton && (
                <Link
                  href={ctaButton.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  {ctaButton.label}
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
              {secondaryButton && (
                <Link
                  href={secondaryButton.href}
                  className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border transition-colors ${
                    isDark 
                      ? 'text-white border-gray-600 hover:bg-gray-800' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {secondaryButton.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// STATS SECTION
// =============================================================================

interface StatItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface StatsSectionProps {
  stats: StatItem[];
  variant?: 'light' | 'dark';
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, variant = 'dark' }) => {
  const isDark = variant === 'dark';
  
  return (
    <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {stat.icon && (
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg mb-4 ${isDark ? 'bg-primary-500/20' : 'bg-primary-100'}`}>
                  <span className="text-primary-500">{stat.icon}</span>
                </div>
              )}
              <div className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// FEATURE GRID SECTION
// =============================================================================

interface FeatureItem {
  title: string;
  description?: string;
  count?: string;
  icon?: React.ReactNode;
  href?: string;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  subtitle,
  features,
  columns = 4,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => {
            const content = (
              <div className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
                {feature.icon && (
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                {feature.count && (
                  <p className="text-sm text-gray-500 mt-1">{feature.count}</p>
                )}
                {feature.description && (
                  <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                )}
                {feature.href && (
                  <div className="mt-3 flex items-center text-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            );

            return feature.href ? (
              <Link key={index} href={feature.href}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// CTA SECTION
// =============================================================================

export interface CTASectionProps {
  title: string;
  description?: string;
  benefits?: string[];
  ctaButton: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
  variant?: 'primary' | 'dark';
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  benefits,
  ctaButton,
  secondaryButton,
  variant = 'dark',
}) => {
  const isDark = variant === 'dark';
  
  return (
    <section className={`py-16 lg:py-20 ${isDark ? 'bg-gray-900' : 'bg-primary-600'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-gray-300">
                {description}
              </p>
            )}
            {benefits && benefits.length > 0 && (
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={ctaButton.href}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {ctaButton.label}
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {secondaryButton && (
                <Link
                  href={secondaryButton.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {secondaryButton.label}
                </Link>
              )}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-square max-w-md mx-auto bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-xl flex items-center justify-center">
                <svg className="w-24 h-24 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// TRUSTED BY SECTION
// =============================================================================

interface CompanyLogo {
  name: string;
  logo?: string;
}

export interface TrustedBySectionProps {
  title?: string;
  companies: CompanyLogo[];
}

export const TrustedBySection: React.FC<TrustedBySectionProps> = ({
  title = 'Trusted by Industry Leaders',
  companies,
}) => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          {title}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
            >
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-gray-400">{company.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PAGE HEADER SECTION
// =============================================================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  variant?: 'light' | 'dark' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  variant = 'light',
  size = 'md',
  children,
}) => {
  const bgClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-700',
  };

  const textClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
    gradient: 'text-white',
  };

  const descClasses = {
    light: 'text-gray-600',
    dark: 'text-gray-300',
    gradient: 'text-primary-100',
  };

  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  return (
    <section className={`${bgClasses[variant]} ${sizeClasses[size]}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl lg:text-4xl font-bold ${textClasses[variant]}`}>
          {title}
        </h1>
        {description && (
          <p className={`mt-2 text-lg ${descClasses[variant]} max-w-2xl`}>
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
};

// =============================================================================
// SECTION CONTAINER
// =============================================================================

export interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <section id={id} className={`py-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

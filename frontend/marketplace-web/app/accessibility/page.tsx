 'use client'

import { PageLayout } from '@/components/ui';
import Link from 'next/link';

export default function AccessibilityPage() {
  const currentYear = new Date().getFullYear();

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-50 to-secondary-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
              Accessibility Commitment
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
            Accessible Design for Everyone
          </h1>
          <p className="text-xl text-secondary-700 leading-relaxed max-w-3xl">
            At Designer Marketplace, we believe that exceptional design must be accessible to all. Our platform is built with inclusive design principles at its core, ensuring that talent and opportunities are discoverable by everyone, regardless of ability.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* WCAG Compliance */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">WCAG 2.1 AA Compliance</h2>
              <p className="text-secondary-700 mb-4 leading-relaxed">
                Designer Marketplace is committed to meeting the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These internationally recognized guidelines ensure that our platform is perceivable, operable, understandable, and robust for all users.
              </p>
              <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                <p className="text-sm text-secondary-600 font-semibold mb-4">Our commitment includes:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-secondary-700">Keyboard navigation for all interactive elements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-secondary-700">Sufficient color contrast ratios (minimum 4.5:1 for text)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-secondary-700">Descriptive alt text for all images and visual content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-secondary-700">Accessible form inputs with clear labels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">Key Accessibility Features</h2>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                We&apos;ve implemented comprehensive accessibility features to ensure our design platform serves all professionals:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Screen Reader Support</h3>
                  <p className="text-sm text-secondary-600">
                    Full semantic HTML and ARIA landmarks enable screen readers to navigate our platform effectively. Portfolio galleries, project descriptions, and design specifications are all properly structured.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Keyboard Navigation</h3>
                  <p className="text-sm text-secondary-600">
                    Navigate our entire platform using only the keyboard. Tab through menus, access dropdowns, and interact with design tools without a mouse.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Color Blindness Support</h3>
                  <p className="text-sm text-secondary-600">
                    Our design system uses color in combination with patterns and icons to convey information, making the platform accessible to users with color vision deficiency.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Flexible Text Display</h3>
                  <p className="text-sm text-secondary-600">
                    Support for text resizing up to 200% without loss of functionality. Our responsive design ensures content remains accessible at all zoom levels.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Captions & Transcripts</h3>
                  <p className="text-sm text-secondary-600">
                    Video tutorials and design demonstrations include captions and full transcripts for users who are deaf or hard of hearing.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                  <h3 className="font-semibold text-secondary-900 mb-2">Motion & Animation Control</h3>
                  <p className="text-sm text-secondary-600">
                    We respect prefers-reduced-motion preferences. Animations can be disabled for users sensitive to motion or those with vestibular disorders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Excellence */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">Accessibility in Design Excellence</h2>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                True design excellence requires accessibility. Our design system embodies inclusive design principles:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-6 py-2">
                  <h3 className="font-semibold text-secondary-900 text-lg mb-2">Universal Design</h3>
                  <p className="text-secondary-700">
                    We design for the broadest range of users first, not as an afterthought. This approach benefits everyone—not just people with disabilities—by creating cleaner, more intuitive interfaces.
                  </p>
                </div>

                <div className="border-l-4 border-primary-500 pl-6 py-2">
                  <h3 className="font-semibold text-secondary-900 text-lg mb-2">Clear Visual Hierarchy</h3>
                  <p className="text-secondary-700">
                    Strategic use of typography, spacing, and contrast creates clear information architecture. Your designs are easier to understand and navigate for all users.
                  </p>
                </div>

                <div className="border-l-4 border-primary-500 pl-6 py-2">
                  <h3 className="font-semibold text-secondary-900 text-lg mb-2">Flexible Layouts</h3>
                  <p className="text-secondary-700">
                    Responsive design isn&apos;t just about screen sizes—it&apos;s about adapting to user needs. Our platform works seamlessly across all devices and assistive technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Freelancers & Companies */}
        <section className="mb-16 bg-secondary-50 rounded-lg px-6 py-8 border border-secondary-200">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Accessibility for All Users</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Freelancers */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0H10m2 0v2m0-2v-2m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                For Designers & Developers
              </h3>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Build and showcase accessible portfolios</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Access design resources and accessibility guides</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Collaborate with an inclusive professional community</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Discover projects that value accessibility</span>
                </li>
              </ul>
            </div>

            {/* Companies */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                For Hiring Companies
              </h3>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Access talent portfolios designed for all abilities</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Post opportunities that reach globally diverse talent</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Connect with designers committed to inclusive design</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Showcase corporate accessibility commitment</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accessibility Statement */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">Accessibility Statement</h2>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Designer Marketplace is committed to ensuring digital accessibility of its website and content. We are continually improving the user experience for everyone and applying relevant accessibility standards. We are taking precautions to maintain accessibility standards with a goal of providing great experience to all users.
              </p>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-blue-900 font-semibold mb-3">Report Accessibility Issues</p>
                <p className="text-sm text-blue-800 mb-4">
                  If you encounter accessibility barriers while using Designer Marketplace, please let us know. We&apos;re committed to addressing your concerns promptly.
                </p>
                <a 
                  href="/contact?subject=accessibility"
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
                >
                  Contact Support
                </a>
              </div>

              <div className="space-y-4">
                <p className="text-secondary-700">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:accessibility@designer-marketplace.com" className="text-primary-600 hover:underline">
                    accessibility@designer-marketplace.com
                  </a>
                </p>
                <p className="text-secondary-700">
                  <span className="font-semibold">Phone:</span>{' '}
                  <a href="tel:+1-800-DESIGN-1" className="text-primary-600 hover:underline">
                    +1-800-DESIGN-1
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources & Standards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Accessibility Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                WCAG 2.1 Quick Reference
              </h3>
              <p className="text-sm text-secondary-600">
                Official W3C guidelines for web content accessibility standards
              </p>
            </a>

            <a 
              href="https://www.section508.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Section 508 Standards
              </h3>
              <p className="text-sm text-secondary-600">
                U.S. federal accessibility standards for digital content
              </p>
            </a>

            <a 
              href="https://www.ableist.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Accessibility Resources
              </h3>
              <p className="text-sm text-secondary-600">
                Comprehensive guides and tools for building accessible experiences
              </p>
            </a>

            <a 
              href="https://www.a11y-101.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-secondary-50 border border-secondary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                A11y 101
              </h3>
              <p className="text-sm text-secondary-600">
                Educational resources on accessibility design and development
              </p>
            </a>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg px-8 py-12 border border-primary-200">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Join an Accessible Design Community</h2>
          <p className="text-secondary-700 mb-6 leading-relaxed">
            We believe accessible design is good design. By choosing Designer Marketplace, you&apos;re part of a community that values inclusion and excellence. Whether you&apos;re a freelancer showcasing your work or a company seeking talent, we provide an accessible platform that serves everyone.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold border-2 border-primary-600 hover:bg-secondary-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>

        {/* Footer Info */}
        <section className="pt-8 border-t border-secondary-200">
          <p className="text-sm text-secondary-600 mb-4">
            <span className="font-semibold">Last Updated:</span> {currentYear}
          </p>
          <p className="text-sm text-secondary-600 mb-4">
            <span className="font-semibold">Accessibility Assessment:</span> Regular audits and testing ensure continuous compliance and improvement of accessibility standards.
          </p>
          <p className="text-sm text-secondary-600">
            For more information about our accessibility practices or to provide feedback, please{' '}
            <Link href="/contact" className="text-primary-600 hover:underline font-semibold">
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
      </div>
    </PageLayout>
  );
}

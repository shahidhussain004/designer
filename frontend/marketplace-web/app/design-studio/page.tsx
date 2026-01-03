import { PageLayout } from '@/components/ui';
import { ArrowRight, Code, Layers, Lightbulb, Palette, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DesignStudioPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Design Studio</h1>
            <p className="text-xl text-gray-300 mb-8">
              Professional design services crafted for modern businesses. From brand identity to digital experiences, 
              we create solutions that resonate with your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-gray-400 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive design solutions tailored to elevate your brand and engage your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Brand Identity</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Crafting distinctive visual identities that capture your essence and create lasting impressions across all touchpoints.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Logo Design & Concepts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Visual Systems & Guidelines
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Brand Art Direction
                </li>
              </ul>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Digital Experiences</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Building immersive digital products with meticulous attention to interaction design and user experience.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Web & App Design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Interactive Prototypes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Motion Design
                </li>
              </ul>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Strategy & Insights</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Developing strategic frameworks that align creative vision with business objectives for maximum impact.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Research & User Analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Content Strategy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Market Positioning
                </li>
              </ul>
            </div>

            {/* Service Card 4 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Product Design</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Designing intuitive product experiences that balance beauty with functionality and user needs.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  UX & UI Design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Design Systems
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Usability Testing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Studio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring expertise, creativity, and dedication to every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Experienced designers and strategists dedicated to your project&apos;s success
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">
                Efficient processes that deliver results without compromising quality
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reliable Support</h3>
              <p className="text-gray-600">
                Ongoing partnership and support throughout your project lifecycle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Design?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s collaborate on a project that brings your vision to life with professional design excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Design Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A collaborative approach that ensures your vision becomes reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Discovery', 'Strategy', 'Design', 'Delivery'].map((step, index) => (
              <div key={step} className="relative">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{step}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {index === 0 && 'Understanding your needs, goals, and target audience'}
                    {index === 1 && 'Developing strategy and creative direction'}
                    {index === 2 && 'Creating beautiful, functional designs'}
                    {index === 3 && 'Delivering polished results and ongoing support'}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

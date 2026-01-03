'use client';

import { PageLayout } from '@/components/ui';
import { AlertCircle, CheckCircle2, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    performance: false,
    marketing: false,
  });

  const handlePreferenceChange = (category: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    alert('Your preferences have been saved.');
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl lg:text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Learn how we use cookies to enhance your experience on Designer Marketplace
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files stored on your device when you visit our website. They help us recognize you on 
              your next visit and enable essential functionality, improve performance, and deliver personalized content. We use 
              different types of cookies for different purposes as described in this policy.
            </p>
            <p className="text-gray-600">
              We respect your privacy and give you control over what cookies we use. You can accept or reject non-essential 
              cookies at any time by adjusting your preferences below.
            </p>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6 mb-8">
            {/* Necessary Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Strictly Necessary Cookies</h3>
                  <p className="text-sm text-gray-500 mb-4">Always Active</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Essential cookies that enable core functionality of the platform — sign-in, security features, user preferences, 
                and basic analytics. These cookies are always active because they&apos;re required for the site to function properly and 
                securely. Disabling them would prevent the site from working.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Examples of necessary cookies:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Authentication tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Session management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Security and fraud prevention
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    User preference settings
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.performance}
                      onChange={() => handlePreferenceChange('performance')}
                      className="w-5 h-5 border-gray-300 rounded text-primary-600"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Performance Cookies</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Performance cookies help us understand how visitors interact with our website. They collect data about page 
                load times, bounce rates, and which features are most used. This information is aggregated and does not identify 
                you personally. We use this data to improve site speed, reliability, and overall user experience.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Examples of performance cookies:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Google Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Page navigation tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Feature usage analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="w-5 h-5 border-gray-300 rounded text-primary-600"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Targeting & Marketing Cookies</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Targeting cookies enable personalized content, recommendations, and relevant promotions based on your browsing 
                activity and interests. They may be set by us or third-party partners. These cookies help us understand what you&apos;re 
                interested in and deliver more relevant content. Disabling them may reduce personalized features and targeted suggestions.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Examples of targeting cookies:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Personalized recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Social media integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Retargeting pixels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Advertising preferences
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookie Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Preferences</h2>
            
            <div className="space-y-4 mb-6">
              {/* Necessary Toggle (Disabled) */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Strictly Necessary</h4>
                  <p className="text-sm text-gray-500">Cannot be disabled</p>
                </div>
                <div className="w-12 h-7 bg-green-500 rounded-full flex items-center justify-end pr-1">
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Performance Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Performance Cookies</h4>
                  <p className="text-sm text-gray-500">Improve our services</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('performance')}
                  className={`w-12 h-7 rounded-full flex items-center transition-colors ${
                    preferences.performance ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.performance ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Marketing Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Targeting & Marketing</h4>
                  <p className="text-sm text-gray-500">Personalized content</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('marketing')}
                  className={`w-12 h-7 rounded-full flex items-center transition-colors ${
                    preferences.marketing ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Browser Controls</h3>
              <p className="text-sm text-blue-800">
                Most browsers allow you to control cookies through their settings. You can set your browser to refuse cookies 
                or alert you when cookies are being sent. However, blocking some types of cookies may impact your experience.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you share my cookie data with third parties?</h3>
                <p className="text-gray-600">
                  We only share aggregated, non-personally identifiable cookie data with trusted partners for analytics and marketing 
                  purposes. We never sell your personal data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long do cookies last?</h3>
                <p className="text-gray-600">
                  Different cookies have different lifespans. Session cookies are deleted when you close your browser. Persistent cookies 
                  remain for months or years depending on their purpose. You can delete all cookies from your browser at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I opt out of all cookies?</h3>
                <p className="text-gray-600">
                  You can opt out of non-essential cookies, but we cannot disable necessary cookies as they&apos;re required for the site to work. 
                  You can manage your preferences on this page or through your browser settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I delete cookies?</h3>
                <p className="text-gray-600">
                  You can clear cookies from your browser&apos;s settings or preferences. Instructions vary by browser, but typically you can find 
                  the option under &quot;Privacy&quot; or &quot;History&quot; settings. You can also use browser developer tools.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Cookie Policy?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about how we use cookies, please don&apos;t hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

import { PageLayout } from '@/components/ui'
import { Baby, Cookie, Eye, Lock, RefreshCw, Share2, Shield, UserCheck } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy',
}

const privacyData = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us when you create an account, update your profile, or communicate with other users. This includes your name, email address, profile information, and payment details.',
  },
  {
    icon: Shield,
    title: '2. How We Use Your Information',
    content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.',
  },
  {
    icon: Share2,
    title: '3. Information Sharing',
    content: 'We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, such as payment processing and data analytics.',
  },
  {
    icon: Lock,
    title: '4. Data Security',
    content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable.',
  },
  {
    icon: Cookie,
    title: '5. Cookies and Tracking',
    content: 'We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.',
  },
  {
    icon: UserCheck,
    title: '6. Your Rights',
    content: 'You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or ask us to delete your account.',
  },
  {
    icon: Baby,
    title: "7. Children's Privacy",
    content: 'Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.',
  },
  {
    icon: RefreshCw,
    title: '8. Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.',
  },
]

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-primary-400" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: January 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {privacyData.map((section, index) => {
              const IconComponent = section.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
                      <p className="text-gray-600">{section.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500">
                For questions about this privacy policy, please contact us at{' '}
                <a href="mailto:privacy@designer-marketplace.com" className="text-primary-600 hover:text-primary-700 font-medium">
                  privacy@designer-marketplace.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

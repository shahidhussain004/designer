import { PageLayout } from '@/components/ui'

export const metadata = {
  title: 'Terms of Service',
}

const termsData = [
  {
    title: '1. Acceptance of Terms',
    content: 'By using our services, you agree to these terms. If you do not agree, please do not use our platform.',
  },
  {
    title: '2. Use License',
    content: 'Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.',
  },
  {
    title: '3. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer.',
  },
  {
    title: '4. Freelancer and Client Responsibilities',
    content: 'Freelancers and clients must adhere to fair use policies and maintain professional conduct throughout all interactions.',
  },
  {
    title: '5. Payment Terms',
    content: 'Payments are processed through our payment provider and are subject to fees. All transactions are final unless otherwise stated.',
  },
  {
    title: '6. Dispute Resolution',
    content: 'Disputes will be handled through our internal mediation process. Both parties agree to cooperate in good faith.',
  },
  {
    title: '7. Termination',
    content: 'We may suspend or terminate accounts that violate these terms without prior notice.',
  },
  {
    title: '8. Changes to Terms',
    content: 'We reserve the right to update these terms; changes will be posted here with an updated revision date.',
  },
]

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: January 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {termsData.map((section, index) => (
              <div key={index} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
            
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <p className="text-sm text-gray-500">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:legal@designer-marketplace.com" className="text-primary-600 hover:text-primary-700">
                  legal@designer-marketplace.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

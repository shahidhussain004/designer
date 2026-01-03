import { PageLayout } from '@/components/ui';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <PageLayout>
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Get in touch with us! We would love to hear from you.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <ContactForm />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
            <div className="space-y-4">
              <p className="text-gray-700 text-lg">
                📧 Email: support@designer-marketplace.com
              </p>
              <p className="text-gray-700 text-lg">
                📞 Phone: +1 (555) 123-4567
              </p>
              <p className="text-gray-700 text-lg">
                🏢 Address: 123 Design Street, Creative City, CA 94000
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

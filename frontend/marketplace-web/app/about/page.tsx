import { PageLayout } from '@/components/ui'

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About Designer Marketplace</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Designer Marketplace connects businesses with top design and product talent. We make it
            simple to find, hire, and collaborate with experienced freelancers and teams who ship
            delightful user experiences.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe great design changes outcomes. Our mission is to empower organizations of
                every size to access curated, reliable design professionals — quickly and safely.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Post a brief or browse curated talent. Review portfolios, invite candidates to
                interview, and start your project with confidence. Our platform supports proposals,
                secure payments, and milestone tracking so teams can focus on work, not logistics.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We prioritize trust, transparency, and quality. Every freelancer is vetted and
                portfolios are reviewed to ensure a high bar for craftsmanship and communication.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">The Team</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Designer Marketplace was founded by product and design practitioners. Our small,
                distributed team focuses on building tools and workflows that remove friction from
                hiring and enable sustained collaboration between clients and creatives.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Hiring & Partnerships</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We partner with agencies, consultancies, and enterprises to provide customized
                talent solutions. If you&rsquo;re interested in a strategic partnership or embedded team,
                contact us at partnerships@designer-marketplace.com.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                For press, partnerships, or general inquiries, please reach out at support@designer-marketplace.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

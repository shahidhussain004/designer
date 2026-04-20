import { PageLayout } from '@/components/ui';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us — Designer Marketplace',
  description: 'Get in touch with our team for support, partnerships, press inquiries, or enterprise solutions.',
}

const channels = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.389-.88m2.269 2.268a3.765 3.765 0 010 2.528m-2.268 2.268a3.736 3.736 0 01-1.389.88 3.737 3.737 0 01-1.38.128m-5.597-5.597a3.736 3.736 0 00.128 1.38c.18.536.459 1.025.88 1.389m0 0a3.765 3.765 0 002.528 0m0 0a3.736 3.736 0 001.389-.88c.42-.364.7-.853.88-1.389M7.288 4.33l4.138 3.448M7.288 4.33a9.027 9.027 0 00-1.652 1.306A9.027 9.027 0 004.33 7.288M7.288 4.33a9.014 9.014 0 00-2.958 9.424M4.33 7.288l3.448 4.138M4.33 7.288A9.014 9.014 0 004.33 16.712M7.776 15.724a3.736 3.736 0 001.38.128m0 0a3.737 3.737 0 001.389-.88c.42-.364.7-.853.88-1.389m0 0a3.765 3.765 0 000-2.528m0 0a3.737 3.737 0 00-.88-1.389 3.736 3.736 0 00-1.389-.88M7.776 15.724l-3.446 4.138m3.446-4.138a9.014 9.014 0 009.424 0m-9.424 0a9.014 9.014 0 01-4.138-3.448m13.562 3.448a9.014 9.014 0 004.138-3.448" />
      </svg>
    ),
    label: 'General Support',
    description: 'Questions about your account, billing, or how the platform works.',
    contact: 'support@designermarket.io',
    cta: 'Email Support',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    label: 'Enterprise & Sales',
    description: 'Large team? Explore custom plans, embedded talent, and enterprise agreements.',
    contact: 'enterprise@designermarket.io',
    cta: 'Talk to Sales',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    label: 'Partnerships',
    description: 'Agency partnerships, platform integrations, and white-label enquiries.',
    contact: 'partners@designermarket.io',
    cta: 'Explore Partnerships',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    label: 'Press & Media',
    description: 'Interview requests, press access, spokesperson enquiries, and media assets.',
    contact: 'press@designermarket.io',
    cta: 'Press Enquiry',
    color: 'bg-amber-50 text-amber-600',
  },
]

const faqs = [
  {
    q: 'How quickly will I get a response?',
    a: 'Our support team typically replies within 4 business hours. Enterprise and partnership enquiries are escalated and usually receive a response within 1 business day.',
  },
  {
    q: 'I\'m a designer — who should I contact for account issues?',
    a: 'Use the form below or email support@designermarket.io. Make sure to include your account email so we can locate your profile quickly.',
  },
  {
    q: 'Can I request a platform demo?',
    a: 'Absolutely. Select "Enterprise & Sales" as your topic in the form below and mention you\'d like a live walkthrough. Our team will arrange a personalised demo.',
  },
  {
    q: 'How do I report a serious issue or a platform abuse?',
    a: 'For urgent or sensitive reports, email trust@designermarket.io directly. We treat all reports confidentially and investigate within 24 hours.',
  },
]

export default function ContactPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-gray-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Get in Touch
            </span>
            <h1 className="text-5xl font-bold mb-5 leading-tight">
              We&rsquo;d love to <span className="text-primary-400">hear from you.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Whether you have a question about your account, want to explore a partnership, or just want to say hello — our team is here.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Channels ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose the right channel</h2>
            <p className="text-gray-500 text-lg">Different teams, different enquiries — routed to the right people.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((ch) => (
              <div key={ch.label} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${ch.color}`}>
                  {ch.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{ch.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{ch.description}</p>
                <a href={`mailto:${ch.contact}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  {ch.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Office info ── */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 lg:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-500 mb-8">Fill in the form and we&rsquo;ll be in touch promptly.</p>
                <ContactForm />
              </div>
            </div>

            {/* Sidebar: office + office hours + social */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">London HQ</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">12 Worship Street<br />London, EC2A 2EL<br />United Kingdom</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">New York Office</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">340 Pine Street, Suite 800<br />San Francisco, CA 94104<br />United States</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Mon–Fri: 9:00 – 18:00 GMT<br />
                      Support available 24/7 for critical issues
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Urgent trust &amp; safety issues</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">For abuse reports, fraud, or account compromises that are time-sensitive:</p>
                <a href="mailto:trust@designermarket.io" className="text-primary-600 font-semibold text-sm hover:underline">
                  trust@designermarket.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
            <p className="text-gray-500">Quick answers before you reach out.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

import { PageLayout } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Partners — Designer Marketplace',
  description: 'Build together. Join the Designer Marketplace partner ecosystem — agency, technology, and enterprise partnerships that expand what creative work can achieve.',
}

const tiers = [
  {
    name: 'Agency Partner',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    tagline: 'For creative agencies and studios',
    description: 'Extend your team, fill capability gaps, and place talent in client projects — all through a platform purpose-built for design professionals. Agencies use Designer Marketplace to expand capacity without the overheads of full-time hiring.',
    highlights: [
      'White-label client portal for project delivery',
      'Priority access to vetted specialist talent',
      'Dedicated Partner Success Manager',
      'Agency dashboard with multi-client billing',
      'Volume discount on platform fees',
      'Co-marketing and case study opportunities',
    ],
    cta: 'Apply as Agency',
    color: 'bg-primary-600',
    lightColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
    borderColor: 'border-primary-200',
  },
  {
    name: 'Technology Partner',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    tagline: 'For SaaS platforms and developer tools',
    description: 'Integrate Designer Marketplace into your product, platform, or workflow. We offer a documented API, webhooks, and an official SDK for building deep integrations that add value for your mutual users.',
    highlights: [
      'Full REST API access with sandbox environment',
      'Official JS/Python SDK and integration templates',
      'Webhook events for real-time data sync',
      'Listed in our in-app integration marketplace',
      'Joint solution briefs and technical enablement',
      'Revenue sharing on referred business',
    ],
    cta: 'Explore Integration',
    color: 'bg-primary-600',
    lightColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
    borderColor: 'border-primary-200',
    featured: true,
  },
  {
    name: 'Enterprise Partner',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    tagline: 'For global organisations & consultancies',
    description: 'Embed Designer Marketplace as the design talent layer across your enterprise. For large organisations, management consultancies, and global brands who need a structured, scalable way to access world-class creative talent.',
    highlights: [
      'Custom SLA with guaranteed response times',
      'Dedicated account team and onboarding',
      'SSO, SCIM provisioning, and audit logs',
      'Custom contract terms and MSA',
      'Embedded compliance and procurement support',
      'Quarterly business reviews with product roadmap preview',
    ],
    cta: 'Talk to Enterprise',
    color: 'bg-secondary-900',
    lightColor: 'bg-secondary-50',
    iconColor: 'text-secondary-700',
    borderColor: 'border-secondary-200',
  },
]

const currentPartners = [
  { category: 'Design Tools', partners: ['Figma', 'Adobe Creative Cloud', 'Sketch', 'InVision', 'Framer'] },
  { category: 'Project Management', partners: ['Linear', 'Notion', 'Jira', 'Asana', 'Monday.com'] },
  { category: 'Communication', partners: ['Slack', 'Microsoft Teams', 'Loom', 'Zoom'] },
  { category: 'Payments & Finance', partners: ['Stripe', 'Wise', 'Deel', 'Remote.com'] },
]

const benefits = [
  {
    title: 'Qualified Referrals',
    description: 'Gain access to a curated network of companies and designers actively looking for the tools and services you offer.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Active Co-marketing',
    description: 'Joint campaigns, shared content, featured placement in newsletters, and sponsored slots in our community events.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
  },
  {
    title: 'Revenue Sharing',
    description: 'Earn a share of every successful subscription or project that originates from your referral or integration.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Product Influence',
    description: 'Partners receive early access to new features and a formal channel to shape our product roadmap based on shared customer needs.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
]

const process = [
  { step: '01', title: 'Submit Application', detail: 'Tell us about your business, your customers, and the kind of partnership you have in mind.' },
  { step: '02', title: 'Partnership Review', detail: 'Our partnerships team evaluates fit and alignment within 5 business days.' },
  { step: '03', title: 'Kick-off Call', detail: 'We align on goals, deliverables, technical requirements, and timelines in a 60-minute workshop.' },
  { step: '04', title: 'Go Live Together', detail: 'Launch your integration or co-marketing campaign. We support you every step of the way.' },
]

export default function PartnersPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-secondary-900 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-secondary-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Partner Programme
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Build better. <br />
              <span className="text-primary-400">Build together.</span>
            </h1>
            <p className="text-xl text-secondary-300 leading-relaxed mb-10 max-w-2xl">
              The best tools for creative professionals don&rsquo;t exist in isolation. We partner with agencies, platforms, and global organisations to create a more connected creative ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#partner-tiers" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                Explore Partnerships
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </a>
              <a href="mailto:partners@designermarket.io" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                Talk to Partnerships
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits strip ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Why Partner With Us</span>
            <h2 className="text-3xl font-bold text-secondary-900 mt-3 mb-3">Built to be mutually beneficial</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">We don&rsquo;t do partnerships for optics. Every arrangement is structured to create measurable value on both sides.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-secondary-900 mb-2">{b.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner Tiers ── */}
      <section id="partner-tiers" className="bg-secondary-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Partnership Tiers</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-4">Choose your partnership type</h2>
            <p className="text-secondary-600 max-w-xl mx-auto">Three structured programmes, each designed around a different kind of relationship.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl border-2 ${tier.featured ? 'border-primary-400 shadow-lg shadow-primary-50' : 'border-secondary-200'} overflow-hidden flex flex-col`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500" />
                )}
                <div className={`p-8 flex-1`}>
                  {tier.featured && (
                    <span className="inline-block text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full mb-4 border border-primary-200">
                      Most Popular
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-2xl ${tier.lightColor} ${tier.iconColor} flex items-center justify-center mb-5 border ${tier.borderColor}`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-1">{tier.name}</h3>
                  <p className="text-sm font-medium text-secondary-500 mb-4">{tier.tagline}</p>
                  <p className="text-secondary-600 text-sm leading-relaxed mb-6">{tier.description}</p>
                  <ul className="space-y-3">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-secondary-700">
                        <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-8 pb-8">
                  <a
                    href="mailto:partners@designermarket.io"
                    className={`block w-full text-center px-6 py-3 ${tier.color} text-white font-semibold rounded-xl transition-opacity hover:opacity-90 text-sm`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Partners ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Integration Ecosystem</span>
            <h2 className="text-3xl font-bold text-secondary-900 mt-3 mb-3">Works with the tools you already use</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">Designer Marketplace integrates natively with the platforms design and engineering teams depend on.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPartners.map(({ category, partners }) => (
              <div key={category} className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6">
                <h3 className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-4">{category}</h3>
                <ul className="space-y-2">
                  {partners.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                      <span className="text-sm text-secondary-700 font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-secondary-400 text-sm mt-8">
            Want your tool listed here?{' '}
            <a href="mailto:partners@designermarket.io" className="text-primary-600 font-semibold hover:underline">
              Apply as a Technology Partner
            </a>
          </p>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl font-bold text-secondary-900 mt-3 mb-3">Getting started is straightforward</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">We&rsquo;ve kept the process lean so you spend time building, not navigating procurement.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[-50%] h-px bg-secondary-200" />
                )}
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center mx-auto mb-4 text-sm relative z-10">
                  {s.step}
                </div>
                <h3 className="font-bold text-secondary-900 mb-2 text-sm">{s.title}</h3>
                <p className="text-secondary-500 text-xs leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-secondary-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to explore a partnership?</h2>
          <p className="text-secondary-300 text-lg mb-10 max-w-xl mx-auto">
            Our partnerships team reviews every application personally. Tell us what you&rsquo;re building and how we can grow together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:partners@designermarket.io" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
              Start the Conversation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <Link href="/press" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
              View Press Kit
            </Link>
          </div>
          <p className="text-secondary-500 text-sm mt-6">
            Or email us directly at <a href="mailto:partners@designermarket.io" className="text-secondary-300 hover:text-white transition-colors">partners@designermarket.io</a>
          </p>
        </div>
      </section>
    </PageLayout>
  )
}

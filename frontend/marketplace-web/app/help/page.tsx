import { PageLayout } from '@/components/ui'
import {
    ArrowRight,
    Award,
    Briefcase,
    CheckCircle,
    ChevronRight,
    CreditCard,
    FileText,
    LifeBuoy,
    MessageSquare,
    Search,
    Shield,
    Sparkles,
    User,
    Zap,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Help Center — Designer Marketplace',
  description:
    'Everything you need to get the most from Designer Marketplace — from your first proposal to your first payment.',
}

// =============================================================================
// DATA
// =============================================================================

const categories = [
  {
    icon: Sparkles,
    title: 'Getting Started',
    description:
      "New here? Set up your account, understand how the platform works, and take your first steps — whether you're hiring or for hire.",
    color: 'bg-primary-50 text-primary-600',
    borderColor: 'border-primary-100',
    articles: [
      'How to create your account',
      'Freelancer vs. Company — which account type do I need?',
      'How profile verification works',
      'Completing your onboarding checklist',
      'Platform overview: a guided tour',
    ],
    href: '#getting-started',
  },
  {
    icon: Briefcase,
    title: 'Finding Work & Posting Jobs',
    description:
      'Discover how freelancers find the right projects and how companies attract exceptional design talent.',
    color: 'bg-primary-50 text-primary-600',
    borderColor: 'border-primary-100',
    articles: [
      'How job and project listings work',
      'Filtering by skill, budget, and timeline',
      'Setting your availability and rate',
      'What makes a strong job brief?',
      'Understanding talent tiers and vetting',
    ],
    href: '#work-and-jobs',
  },
  {
    icon: FileText,
    title: 'Proposals & Contracts',
    description:
      'From writing a compelling proposal to signing a milestone-based contract — everything you need to close and start work cleanly.',
    color: 'bg-violet-50 text-violet-600',
    borderColor: 'border-violet-100',
    articles: [
      'How to write a proposal that gets accepted',
      'Understanding the milestone contract structure',
      'Requesting changes to scope mid-project',
      'What happens if a client declines a proposal?',
      'NDAs and IP ownership — your rights',
    ],
    href: '#proposals',
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    description:
      'Milestone payments, invoice generation, withdrawal options, and how we protect both sides of every transaction.',
    color: 'bg-success-50 text-success-600',
    borderColor: 'border-success-100',
    articles: [
      'How milestone escrow payments work',
      'Accepted payment methods for companies',
      'Withdrawal options and processing times',
      'Downloading invoices and tax documents',
      'Disputing a payment — step by step',
    ],
    href: '#payments',
  },
  {
    icon: User,
    title: 'Portfolio & Profile',
    description:
      'Build a portfolio that speaks for itself. Optimise your profile so the right opportunities find you.',
    color: 'bg-warning-50 text-warning-600',
    borderColor: 'border-warning-100',
    articles: [
      'Uploading and organising portfolio pieces',
      'Supported file types and size limits',
      'Writing a bio that converts',
      'Skills assessment — how it works',
      'Requesting a verified review from a client',
    ],
    href: '#portfolio',
  },
  {
    icon: Award,
    title: 'Courses & Learning',
    description:
      'Navigate the learning platform, earn certificates, and get the most from the design education resources.',
    color: 'bg-rose-50 text-rose-600',
    borderColor: 'border-rose-100',
    articles: [
      'How to enrol in a course',
      'Downloading your completion certificate',
      'Accessing premium content as a free member',
      'Recommending a course to a client or team',
      'Following instructors and saving course lists',
    ],
    href: '#courses',
  },
]

const popularArticles = [
  {
    title: 'How milestone escrow payments work',
    category: 'Payments & Billing',
    read: '3 min read',
    icon: CreditCard,
    iconColor: 'text-success-600',
    iconBg: 'bg-success-50',
  },
  {
    title: 'How to write a proposal that gets accepted',
    category: 'Proposals & Contracts',
    read: '5 min read',
    icon: FileText,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
  },
  {
    title: 'Uploading and organising portfolio pieces',
    category: 'Portfolio & Profile',
    read: '4 min read',
    icon: User,
    iconColor: 'text-warning-600',
    iconBg: 'bg-warning-50',
  },
  {
    title: 'How profile verification works',
    category: 'Getting Started',
    read: '2 min read',
    icon: Shield,
    iconColor: 'text-primary-600',
    iconBg: 'bg-primary-50',
  },
  {
    title: 'Disputing a payment — step by step',
    category: 'Payments & Billing',
    read: '6 min read',
    icon: CreditCard,
    iconColor: 'text-success-600',
    iconBg: 'bg-success-50',
  },
  {
    title: 'Understanding the milestone contract structure',
    category: 'Proposals & Contracts',
    read: '4 min read',
    icon: FileText,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
  },
]

const contactOptions = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Talk to a real person. Available Monday – Friday, 09:00 – 18:00 GMT.',
    cta: 'Start a Conversation',
    href: '/contact',
    color: 'bg-primary-600 hover:bg-primary-700 text-white',
    subtle: false,
  },
  {
    icon: LifeBuoy,
    title: 'Email Support',
    description: 'Prefer to write it out? We reply to every message, typically within 4 business hours.',
    cta: 'Email the Support Team',
    href: 'mailto:support@designermarket.io',
    color: 'bg-white hover:bg-secondary-50 text-secondary-900 border border-secondary-200',
    subtle: true,
  },
]

const systemStatus = [
  { service: 'Marketplace Platform', status: 'Operational' },
  { service: 'Payment Processing', status: 'Operational' },
  { service: 'Notifications & Messaging', status: 'Operational' },
  { service: 'File Uploads & Portfolio', status: 'Operational' },
]

// =============================================================================
// PAGE
// =============================================================================

export default function HelpCenterPage() {
  return (
    <PageLayout>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-secondary-900 text-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-sm text-primary-400 font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
            How can we help?
          </h1>
          <p className="text-lg text-secondary-400 max-w-2xl mx-auto mb-10">
            Answers to every question — from setting up your profile on day one to
            resolving a contract dispute. Designed to be clear, direct, and actually useful.
          </p>

          {/* Search Bar — UI only, ready for future integration */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search the Help Center…"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-secondary-500 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Payments', 'Proposals', 'Portfolio', 'Verification', 'Contracts'].map((tag) => (
              <span
                key={tag}
                className="text-sm text-secondary-400 border border-white/10 rounded-full px-3 py-1 hover:border-white/30 hover:text-secondary-300 cursor-pointer transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Popular Articles                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-secondary-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">Most read this week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => {
              const IconComponent = article.icon
              return (
                <a
                  key={index}
                  href={`/help?search=${encodeURIComponent(article.title)}`}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border border-secondary-100 hover:border-secondary-200 hover:bg-secondary-50 transition group text-left"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${article.iconBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${article.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-secondary-900 group-hover:text-primary-600 transition leading-snug">
                      {article.title}
                    </p>
                    <p className="text-xs text-secondary-400 mt-1">
                      {article.category} · {article.read}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 flex-shrink-0 mt-0.5 ml-auto transition" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Category Grid                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">Browse by topic</h2>
            <p className="text-secondary-500 max-w-xl">
              Every part of the platform, documented. Pick the area that applies to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl border ${category.borderColor} p-6 flex flex-col hover:shadow-md transition-shadow`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 w-11 h-11 ${category.color} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 text-base leading-snug">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-secondary-600 leading-relaxed mb-5">
                    {category.description}
                  </p>

                  {/* Article list */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {category.articles.map((article, i) => (
                      <li key={i}>
                        <a
                          href={category.href}
                          className="flex items-start gap-2 text-sm text-secondary-700 hover:text-primary-600 transition group"
                        >
                          <CheckCircle className="w-4 h-4 flex-shrink-0 text-secondary-300 group-hover:text-primary-400 mt-0.5 transition" />
                          <span className="leading-snug">{article}</span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* View all */}
                  <a
                    href={category.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
                  >
                    View all articles
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* System Status                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-y border-secondary-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-base font-semibold text-secondary-900 mb-1">Platform Status</h2>
              <p className="text-sm text-secondary-500">
                All systems are currently running normally.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {systemStatus.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success-500 flex-shrink-0" />
                  <span className="text-sm text-secondary-600">{item.service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Still Need Help                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">
              Still can't find what you need?
            </h2>
            <p className="text-secondary-500 max-w-lg mx-auto">
              Our support team is staffed by people who actually use the platform. No scripts,
              no runarounds — just clear answers from people who know the product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon
              const isMailto = option.href?.startsWith?.('mailto:')
              const commonClass = `flex flex-col items-center text-center p-8 rounded-xl font-medium transition ${option.color}`

              return isMailto ? (
                <a key={index} href={option.href} className={commonClass}>
                  <IconComponent className="w-7 h-7 mb-4" />
                  <span className="text-base font-semibold mb-1">{option.title}</span>
                  <span
                    className={`text-sm mb-5 font-normal ${option.subtle ? 'text-secondary-500' : 'text-white/80'}`}
                  >
                    {option.description}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                      option.subtle ? 'text-primary-600' : 'text-white'
                    }`}
                  >
                    {option.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              ) : (
                <Link key={index} href={option.href} className={commonClass}>
                  <IconComponent className="w-7 h-7 mb-4" />
                  <span className="text-base font-semibold mb-1">{option.title}</span>
                  <span
                    className={`text-sm mb-5 font-normal ${option.subtle ? 'text-secondary-500' : 'text-white/80'}`}
                  >
                    {option.description}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                      option.subtle ? 'text-primary-600' : 'text-white'
                    }`}
                  >
                    {option.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Trust note */}
          <p className="text-center text-sm text-secondary-400 mt-8">
            You can also browse our{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact page
            </Link>{' '}
            for press, enterprise, and partnership enquiries.
          </p>
        </div>
      </div>

    </PageLayout>
  )
}

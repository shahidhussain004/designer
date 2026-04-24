import { PageLayout } from '@/components/ui'
import {
    ArrowRight,
    BookOpen,
    Briefcase,
    CheckCircle,
    ChevronRight,
    Code2,
    DollarSign,
    Globe,
    Layers,
    Lightbulb,
    Palette,
    Rocket,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Career Guide — Designer Marketplace',
  description:
    'From your first freelance project to running your own studio — a practical, honest guide to building a design career on your own terms.',
}

// =============================================================================
// DATA
// =============================================================================

const careerPaths = [
  {
    icon: Palette,
    title: 'UI / UX Designer',
    description:
      'Shape how people experience digital products. Mastery ranges from wire-framing and user research through to interaction design and design systems.',
    tags: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    color: 'bg-violet-50 text-violet-600',
    borderColor: 'border-violet-100',
    tagColor: 'bg-violet-50 text-violet-700',
    demand: 'Very High',
    demandColor: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Palette,
    title: 'Brand & Visual Designer',
    description:
      'Define how organisations look, feel, and speak. Identity systems, typography, colour strategy, and the language of visual culture.',
    tags: ['Adobe Suite', 'Brand Strategy', 'Typography', 'Motion'],
    color: 'bg-rose-50 text-rose-600',
    borderColor: 'border-rose-100',
    tagColor: 'bg-rose-50 text-rose-700',
    demand: 'High',
    demandColor: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Code2,
    title: 'Creative Developer',
    description:
      'Sit at the intersection of design and engineering. Build the things designers dream up — interactive, animated, and technically precise.',
    tags: ['React', 'Three.js', 'GSAP', 'WebGL'],
    color: 'bg-primary-50 text-primary-600',
    borderColor: 'border-primary-100',
    tagColor: 'bg-primary-50 text-primary-700',
    demand: 'Very High',
    demandColor: 'text-primary-600 bg-primary-50',
  },
  {
    icon: Layers,
    title: 'Motion Designer',
    description:
      'Communicate through time. From micro-interactions and UI animation to broadcast titles and explainer videos — motion is everywhere.',
    tags: ['After Effects', 'Lottie', 'Cinema 4D', 'Rive'],
    color: 'bg-warning-50 text-warning-600',
    borderColor: 'border-warning-100',
    tagColor: 'bg-warning-50 text-warning-700',
    demand: 'Growing',
    demandColor: 'text-warning-600 bg-warning-50',
  },
  {
    icon: Globe,
    title: 'Illustrator & Art Director',
    description:
      'Craft worlds and direct visual narratives. Editorial illustration, publishing, advertising, and conceptual art demand a strong creative perspective.',
    tags: ['Procreate', 'Illustrator', 'Concept Art', 'Editorial'],
    color: 'bg-success-50 text-success-600',
    borderColor: 'border-success-100',
    tagColor: 'bg-success-50 text-success-700',
    demand: 'Stable',
    demandColor: 'text-success-600 bg-success-50',
  },
  {
    icon: Sparkles,
    title: '3D / XR Designer',
    description:
      'Sculpt the next frontier. Product visualisation, spatial UI, AR experiences, and virtual environments are growing fields with few truly skilled practitioners.',
    tags: ['Blender', 'Cinema 4D', 'Unity', 'Spline'],
    color: 'bg-primary-50 text-primary-600',
    borderColor: 'border-primary-100',
    tagColor: 'bg-primary-50 text-primary-700',
    demand: 'Emerging',
    demandColor: 'text-primary-600 bg-primary-50',
  },
]

const stages = [
  {
    number: '01',
    title: 'Breaking In',
    subtitle: 'Landing your first paid work',
    color: 'border-l-primary-400',
    items: [
      'Build a focused portfolio — 3 great case studies beats 12 mediocre ones every time',
      'Choose one discipline and go deep before you go wide',
      'Accept lower rates early in exchange for strong testimonials and real briefs',
      'Practice with a self-directed brief: pick a real brand and redesign something',
      'Join communities — Dribbble, Behance, ADPList, and this platform\'s own talent network',
    ],
  },
  {
    number: '02',
    title: 'First Anchor Clients',
    subtitle: 'Building a stable foundation',
    color: 'border-l-primary-400',
    items: [
      'Prioritise 2–3 retainer clients over endless one-off projects',
      'Document your process — clients pay for thinking, not just output',
      'Raise rates when you have more enquiries than you can handle',
      'Develop a clear creative brief template to filter misaligned prospects early',
      'Begin tracking your time, even if billing project-rate — data shapes future pricing',
    ],
  },
  {
    number: '03',
    title: 'Scaling Your Practice',
    subtitle: 'Moving beyond trading hours for money',
    color: 'border-l-violet-400',
    items: [
      'Specialise — generalists compete on price, specialists compete on reputation',
      'Create productised services: fixed scope, fixed price, faster delivery',
      'Sub-contract overflow work to trusted freelancers to grow without the overhead',
      'Build IP: templates, UI kits, asset libraries you can sell or licence',
      'Invest in thought leadership — write, speak, teach — compound returns take time',
    ],
  },
  {
    number: '04',
    title: 'Studio or Senior IC',
    subtitle: 'Choosing your long-term shape',
    color: 'border-l-success-400',
    items: [
      'The studio path: hire slowly, invest in systems, and price for the team not just yourself',
      'The senior IC path: fewer, larger engagements with leading companies and agencies',
      'In either case, your brand and reputation now drive inbound — protect them fiercely',
      'Productise — courses, mentoring, licensing — to decouple income from time',
      'Build an advisory network: other founders, senior designers, and good accountants',
    ],
  },
]

const rateGuide = [
  {
    label: 'Junior (0–2 years)',
    hourly: '£30–£60',
    daily: '£200–£400',
    project: 'From £500',
    note: 'Build testimonials, learn fast, take on more scope than you charge for initially',
  },
  {
    label: 'Mid-weight (2–5 years)',
    hourly: '£60–£110',
    daily: '£400–£750',
    project: 'From £2,000',
    note: 'You have demonstrable outcomes — let results anchor every rate conversation',
  },
  {
    label: 'Senior (5–10 years)',
    hourly: '£110–£200',
    daily: '£750–£1,400',
    project: 'From £8,000',
    note: 'Strategy, leadership, and accountability command senior rates regardless of hours',
  },
  {
    label: 'Principal / Studio',
    hourly: '£200+',
    daily: '£1,400+',
    project: 'Scope-dependent',
    note: 'You\'re selling outcomes, not time. Fix-price projects priced on value, not cost',
  },
]

const portfolioTips = [
  {
    icon: Star,
    title: 'Lead with the problem',
    description:
      'Clients don\'t hire pretty pictures — they hire solutions. Open every case study with the commercial problem you solved, before showing a single pixel.',
  },
  {
    icon: Users,
    title: 'Show your thinking',
    description:
      'Sketches, rejected directions, research synthesis — process builds trust. It shows how you work, not just what you produced.',
  },
  {
    icon: TrendingUp,
    title: 'Quantify the outcome',
    description:
      'Revenue uplift, conversion increase, time saved, NPS improvement — even approximate numbers transform a portfolio piece from decoration into evidence.',
  },
  {
    icon: Lightbulb,
    title: 'Three is the magic number',
    description:
      'Curate ruthlessly. Three impeccably presented case studies will get you further than twelve weak ones. Quality is a signal; quantity is noise.',
  },
]

const resources = [
  {
    label: 'Courses',
    href: '/courses',
    description: 'Structured learning paths across UI, brand, motion, and development.',
    color: 'text-primary-600',
  },
  {
    label: 'Tutorials',
    href: '/tutorials',
    description: 'Short-form, practical skill-building from working designers.',
    color: 'text-primary-600',
  },
  {
    label: 'Design Resources',
    href: '/resources',
    description: 'Articles, tools, industry news, and deep dives from the community.',
    color: 'text-violet-600',
  },
  {
    label: 'Browse Jobs',
    href: '/jobs',
    description: 'Apply your skills. Real briefs from companies hiring right now.',
    color: 'text-success-600',
  },
  {
    label: 'Browse Projects',
    href: '/projects',
    description: 'Shorter engagements — ideal while you\'re building your practice.',
    color: 'text-warning-600',
  },
  {
    label: 'My Portfolio',
    href: '/portfolio',
    description: 'Publish your work and be discovered by companies hiring on this platform.',
    color: 'text-rose-600',
  },
]

// =============================================================================
// PAGE
// =============================================================================

export default function CareerGuidePage() {
  return (
    <PageLayout>

      {/* ================================================================== */}
      {/* Hero                                                                */}
      {/* ================================================================== */}
      <div className="bg-secondary-900 text-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-sm text-primary-400 font-medium mb-6">
            <Rocket className="w-3.5 h-3.5" />
            Career Guide
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Your design career,{' '}
            <span className="text-primary-400">your way.</span>
          </h1>
          <p className="text-lg lg:text-xl text-secondary-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A practical, honest guide to building a creative career on your own terms —
            from landing your first client to running a studio that works while you sleep.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Career Paths', href: '#paths' },
              { label: 'Rates & Pricing', href: '#rates' },
              { label: 'Portfolio Strategy', href: '#portfolio' },
              { label: 'Career Stages', href: '#stages' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-secondary-400 border border-white/10 rounded-full px-4 py-1.5 hover:border-white/30 hover:text-secondary-200 transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Intro strip — honest positioning                                   */}
      {/* ================================================================== */}
      <div className="bg-white border-b border-secondary-100 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Briefcase,
                stat: '6 career paths',
                note: 'from brand to 3D — each mapped with tools, rates, and realistic demand signals',
              },
              {
                icon: DollarSign,
                stat: 'Honest rate data',
                note: 'built from real project data on this platform, not industry surveys from 2021',
              },
              {
                icon: BookOpen,
                stat: '4 career stages',
                note: 'from first brief to running your studio — actionable steps at every level',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-3">
                  <item.icon className="w-6 h-6 text-secondary-600" />
                </div>
                <p className="text-base font-semibold text-secondary-900 mb-1">{item.stat}</p>
                <p className="text-sm text-secondary-500 leading-snug">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Career Paths                                                        */}
      {/* ================================================================== */}
      <div id="paths" className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">
              Choose your path
            </h2>
            <p className="text-secondary-500 max-w-xl leading-relaxed">
              There is no single design career. Know which discipline excites you most,
              then go uncomfortably deep before expanding outwards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path, i) => {
              const Icon = path.icon
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl border ${path.borderColor} p-6 flex flex-col hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 ${path.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${path.demandColor}`}>
                      {path.demand} demand
                    </span>
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">{path.title}</h3>
                  <p className="text-sm text-secondary-600 leading-relaxed mb-5 flex-1">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {path.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${path.tagColor}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-sm text-secondary-400 mt-8 text-center">
            Demand signals based on job posting volume and proposal activity on Designer Marketplace, Q1 2026.
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Career Stages                                                       */}
      {/* ================================================================== */}
      <div id="stages" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">
              The four stages
            </h2>
            <p className="text-secondary-500 max-w-xl leading-relaxed">
              Most creative careers move through these phases in roughly this order.
              The timeline varies — the moves don&apos;t.
            </p>
          </div>

          <div className="space-y-10">
            {stages.map((stage, i) => (
              <div key={i} className={`border-l-4 ${stage.color} pl-6 py-1`}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-secondary-100 select-none leading-none">
                    {stage.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900">{stage.title}</h3>
                    <p className="text-sm text-secondary-500">{stage.subtitle}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-3">
                  {stage.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-secondary-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary-700 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Rates & Pricing                                                     */}
      {/* ================================================================== */}
      <div id="rates" className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">
              Rates & pricing
            </h2>
            <p className="text-secondary-500 leading-relaxed">
              Transparent, realistic ranges. Prices below are UK-market GBP and will vary by
              discipline, client sector, and geography — treat them as a north star, not a ceiling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rateGuide.map((row, i) => (
              <div key={i} className="bg-white rounded-xl border border-secondary-100 p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">{row.label}</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-400 mb-1">Hourly</p>
                    <p className="text-sm font-semibold text-secondary-900">{row.hourly}</p>
                  </div>
                  <div className="text-center bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-400 mb-1">Day rate</p>
                    <p className="text-sm font-semibold text-secondary-900">{row.daily}</p>
                  </div>
                  <div className="text-center bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-400 mb-1">Project</p>
                    <p className="text-sm font-semibold text-secondary-900">{row.project}</p>
                  </div>
                </div>
                <p className="text-xs text-secondary-500 leading-snug italic">{row.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-warning-50 border border-warning-100 rounded-xl p-5 max-w-2xl">
            <p className="text-sm text-warning-800 leading-relaxed">
              <span className="font-semibold">The most common mistake:</span> undercharging
              out of imposter syndrome, then resentment at being undervalued. Price is also a
              signal of quality. Clients who push back hardest on rate are usually the most
              demanding to work with.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Portfolio Strategy                                                  */}
      {/* ================================================================== */}
      <div id="portfolio" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4">
                Portfolio that wins work
              </h2>
              <p className="text-secondary-500 leading-relaxed mb-8">
                Your portfolio is a sales document, not a gallery. Every choice — piece
                selection, layout, case study framing — should answer one question: why
                should this client hire me for this kind of work?
              </p>
              <div className="space-y-6">
                {portfolioTips.map((tip, i) => {
                  const Icon = tip.icon
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-secondary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-1">{tip.title}</p>
                        <p className="text-sm text-secondary-600 leading-snug">{tip.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-secondary-900 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-400 uppercase tracking-wide">
                  Quick wins
                </span>
              </div>
              <h3 className="text-lg font-bold mb-6">
                Publish your portfolio on Designer Marketplace today
              </h3>
              <ul className="space-y-4 mb-8">
                {[
                  'Indexed by companies actively hiring on the platform',
                  'Linked directly to your proposals and job applications',
                  'Supports images, video, PDFs, and rich text case studies',
                  'Verified reviews from past clients build your trust score',
                  'Skill assessments add credibility beyond self-reported claims',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-secondary-300">
                    <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition"
              >
                Build your portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* The mindset section                                                 */}
      {/* ================================================================== */}
      <div className="bg-secondary-50 border-y border-secondary-100 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <blockquote className="text-center">
            <p className="text-xl lg:text-2xl font-medium text-secondary-900 leading-relaxed mb-6">
              &ldquo;The designers who thrive freelance aren&apos;t necessarily the most talented.
              They&apos;re the ones who treat their practice like a business — without losing the
              thing that makes their work worth hiring.&rdquo;
            </p>
            <footer className="text-sm text-secondary-400">
              Designer Marketplace Editorial Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Getting clients                                                     */}
      {/* ================================================================== */}
      <div className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-3">
              Getting your first clients
            </h2>
            <p className="text-secondary-500 max-w-xl leading-relaxed">
              Cold outreach is dead. Here&apos;s what actually works for creative freelancers in 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Be findable before you pitch',
                body: "A complete Designer Marketplace profile with strong portfolio pieces means companies find you — not the other way around. Optimise your bio for the exact problems you solve: 'helping SaaS companies reduce churn through onboarding redesign' beats 'UI/UX Designer.'",
                cta: 'Complete your profile',
                href: '/profile',
                color: 'border-t-primary-400',
              },
              {
                step: '2',
                title: 'Apply with context, not templates',
                body: "Every proposal should prove you read the brief. Reference a specific challenge from the job post. Share a directly relevant piece of work. Propose a scoped first deliverable — a quick audit, a conceptual direction — to reduce the client's perceived risk.",
                cta: 'Browse open projects',
                href: '/projects',
                color: 'border-t-primary-400',
              },
              {
                step: '3',
                title: 'Turn one client into three',
                body: "Ask for referrals explicitly — most designers don't. At project close: 'If you know anyone who could use this kind of work, I'd love an introduction.' One warm introduction is worth fifty cold emails. Great work + proactive asking = compounding pipeline.",
                cta: 'Browse jobs',
                href: '/jobs',
                color: 'border-t-violet-400',
              },
            ].map((item, i) => (
              <div key={i} className={`bg-white rounded-xl border border-secondary-100 border-t-4 ${item.color} p-6 flex flex-col`}>
                <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center text-sm font-bold text-secondary-500 mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-secondary-900 mb-3">{item.title}</h3>
                <p className="text-sm text-secondary-600 leading-relaxed mb-6 flex-1">{item.body}</p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
                >
                  {item.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Resources hub                                                       */}
      {/* ================================================================== */}
      <div className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Keep learning</h2>
            <p className="text-secondary-500">Everything on the platform, in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, i) => (
              <Link
                key={i}
                href={resource.href}
                className="bg-white rounded-xl border border-secondary-100 p-5 hover:border-secondary-200 hover:shadow-sm transition group"
              >
                <p className={`text-sm font-semibold ${resource.color} mb-1 group-hover:underline`}>
                  {resource.label} →
                </p>
                <p className="text-sm text-secondary-500 leading-snug">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* CTA                                                                */}
      {/* ================================================================== */}
      <div className="bg-secondary-900 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to put this into practice?
          </h2>
          <p className="text-secondary-400 mb-10 leading-relaxed">
            Your next client is on Designer Marketplace. Build your portfolio, apply to open
            projects, and start growing the career you want — not the one you defaulted into.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition"
            >
              Create your free account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition border border-white/10 hover:border-white/20"
            >
              Browse open jobs
            </Link>
          </div>
        </div>
      </div>

    </PageLayout>
  )
}

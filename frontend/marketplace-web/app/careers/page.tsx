import { PageLayout } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Careers — Designer Marketplace',
  description: 'Join a team building the future of creative work. Remote-first, design-led, and deeply invested in the craft.',
}

const perks = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Remote-First Culture',
    description: 'Work where you do your best thinking. Distributed team across 18 countries — async by default, synchronous by choice.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Competitive Compensation',
    description: 'Market-leading salaries benchmarked annually. Equity for early members. Transparent pay bands at every level.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Learning Budget',
    description: '£2,500 / year for courses, conferences, books, and workshops. Plus free access to all premium Designer Marketplace content.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Health & Wellbeing',
    description: 'Private health insurance, mental health support through Spill, and a monthly wellbeing allowance for gym, meditation, or whatever recharges you.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: 'Design-Grade Tooling',
    description: 'Top-spec hardware of your choice. Full Figma Organisation licence. Budget for any software tools you need to do your best work.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 15h.008v.008H12V15zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM9.75 15h.008v.008H9.75V15zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Generous Time Off',
    description: '35 days total leave (including public holidays). A full week off between Christmas and New Year. Sabbaticals for long-tenured team members.',
  },
]

const openRoles = [
  {
    title: 'Senior Product Designer',
    team: 'Design',
    location: 'Remote (Europe/Americas)',
    type: 'Full-time',
    description: 'Own end-to-end design for core marketplace flows — search, matching, proposals, and collaboration. Partner closely with engineering and product to ship work you\'re genuinely proud of.',
    tags: ['Figma', 'Product Thinking', 'Design Systems', 'Research'],
    badge: 'Featured',
    badgeColor: 'bg-primary-100 text-primary-700',
  },
  {
    title: 'Staff Frontend Engineer',
    team: 'Engineering',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Drive technical direction for our Next.js platform. Work on complex UI challenges, define our component architecture, and raise the bar for what "polished" means to the engineering team.',
    tags: ['TypeScript', 'React', 'Next.js', 'Performance'],
    badge: 'Urgent',
    badgeColor: 'bg-warning-100 text-warning-700',
  },
  {
    title: 'Senior Backend Engineer — Matching & Recommendations',
    team: 'Engineering',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Build and scale the intelligence layer that connects designers with the right opportunities. Work on ranking algorithms, signals, personalisation, and real-time recommendations.',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'ML Systems'],
    badge: null,
    badgeColor: '',
  },
  {
    title: 'Head of Growth Marketing',
    team: 'Growth',
    location: 'London or Remote',
    type: 'Full-time',
    description: 'Lead acquisition, activation, and retention strategy for both sides of the marketplace. You\'ll build the growth team from scratch and own the strategy that gets us to the next 100k designers.',
    tags: ['B2B', 'B2C', 'Analytics', 'Paid Acquisition', 'SEO'],
    badge: null,
    badgeColor: '',
  },
  {
    title: 'Customer Success Manager — Enterprise',
    team: 'Success',
    location: 'New York or Remote',
    type: 'Full-time',
    description: 'Partner with our largest accounts to drive adoption, retention, and expansion. You\'ll be the strategic voice for enterprise clients and feed their needs back into our product roadmap.',
    tags: ['Enterprise', 'Relationship Management', 'SaaS'],
    badge: null,
    badgeColor: '',
  },
  {
    title: 'Design Systems Engineer',
    team: 'Design',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Maintain and evolve our component library — the design system that powers the entire platform. Bridge design and engineering with rigour, documentation, and a taste for detail.',
    tags: ['Storybook', 'TypeScript', 'CSS', 'Figma Tokens'],
    badge: null,
    badgeColor: '',
  },
]

const principles = [
  { label: "Craft over speed", detail: "We'd rather ship something excellent in six weeks than something mediocre in three." },
  { label: "Context over process", detail: "We give people the context they need to make decisions. Documentation replaces unnecessary meetings." },
  { label: "Trust by default", detail: "You were hired because we believe in your judgement. We don't manage through surveillance or approval chains." },
  { label: "Direct and kind", detail: "Honest feedback, delivered with care. We don't confuse politeness with kindness." },
]

export default function CareersPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-secondary-900 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-secondary-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              We&rsquo;re Hiring
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Work on something <br />
              <span className="text-primary-400">worth caring about.</span>
            </h1>
            <p className="text-xl text-secondary-300 leading-relaxed mb-10 max-w-2xl">
              We&rsquo;re a small team with an outsized mission: to make the creative economy work for everyone who shapes it. If you care deeply about craft and want to build tools that matter, we&rsquo;d like to meet you.
            </p>
            <div className="flex gap-3">
              <a href="#open-roles" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                See Open Roles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Culture headline strip ── */}
      <section className="bg-primary-600 text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-12 gap-y-3 items-center justify-center text-sm font-medium">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />Remote-First</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />Async by Default</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />Design-Led</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />75+ Team Members</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />18 Countries</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-200" />Series A Funded</span>
          </div>
        </div>
      </section>

      {/* ── Working Here ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Why Us</span>
              <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-6 leading-tight">
                We take how we work as seriously as what we build.
              </h2>
              <div className="space-y-5 text-secondary-600 leading-relaxed">
                <p>
                  Designer Marketplace is design-led in every sense. Our product is used by some of the world&rsquo;s most demanding creative professionals — which means we hold ourselves to the same standard. The bar for craft here is high, and that&rsquo;s exactly why the right people love working here.
                </p>
                <p>
                  We are intentionally distributed. Our team spans London, New York, Tokyo, Nairobi, and dozens of points between. We invest in writing, documentation, and async communication so that no-one is disadvantaged by their timezone.
                </p>
                <p>
                  We are a company where opinions are valued and anyone can shape the direction of the product. Every team member has direct access to leadership, and the shortest path from idea to shipped feature is deliberate.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {principles.map((p) => (
                <div key={p.label} className="bg-secondary-50 rounded-xl p-5 border border-secondary-200">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mb-3" />
                  <h3 className="font-bold text-secondary-900 text-sm mb-2">{p.label}</h3>
                  <p className="text-secondary-500 text-sm leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-secondary-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Perks & Benefits</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-4">We invest in our people</h2>
            <p className="text-secondary-600 max-w-xl mx-auto">These aren&rsquo;t perks as afterthoughts. They&rsquo;re an acknowledgement that great work requires whole humans.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((perk) => (
              <div key={perk.title} className="bg-white rounded-2xl p-8 border border-secondary-200 hover:border-primary-200 hover:shadow-sm transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  {perk.icon}
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-2">{perk.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="open-roles" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Open Positions</span>
              <h2 className="text-4xl font-bold text-secondary-900 mt-2">
                {openRoles.length} roles we&rsquo;re hiring for right now
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 text-success-700 text-sm font-medium rounded-full border border-success-200">
              <span className="w-2 h-2 rounded-full bg-success-500" />
              Actively interviewing
            </span>
          </div>

          <div className="space-y-4">
            {openRoles.map((role) => (
              <div key={role.title} className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6 hover:border-primary-200 hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-secondary-900 text-lg">{role.title}</h3>
                      {role.badge && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${role.badgeColor}`}>
                          {role.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-secondary-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        {role.team}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {role.type}
                      </span>
                    </div>
                    <p className="text-secondary-600 text-sm leading-relaxed mb-4">{role.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {role.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 bg-secondary-200 text-secondary-600 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-900 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Apply
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-secondary-50 rounded-2xl border border-dashed border-secondary-300 p-8 text-center">
            <h3 className="font-bold text-secondary-900 mb-2">Don&rsquo;t see a role that fits?</h3>
            <p className="text-secondary-500 mb-5 max-w-md mx-auto text-sm leading-relaxed">We keep a running list of exceptional people for roles we haven&rsquo;t posted yet. Send us a speculative application and tell us what you&rsquo;d build.</p>
            <Link href="mailto:careers@designermarket.io" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-900 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Send Speculative Application
            </Link>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="bg-secondary-50 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Our Process</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-4">Transparent. Fast. Human.</h2>
            <p className="text-secondary-600 max-w-xl mx-auto">We respect your time. Our process is designed to be thorough without being exhausting.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Application Review', time: '1–2 days', detail: 'We read every application. No automated filtering on the first pass.' },
              { step: '02', title: 'Intro Call', time: '30 min', detail: 'A relaxed conversation about you, your work, and how you might fit.' },
              { step: '03', title: 'Technical / Portfolio Review', time: 'Take-home or live session', detail: 'Role-specific. We\'ll tell you exactly what to expect ahead of time.' },
              { step: '04', title: 'Final Interviews', time: '2–3 hours total', detail: 'Meet the people you\'d work with. Includes a values and culture conversation.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                  {s.step}
                </div>
                <h3 className="font-bold text-secondary-900 mb-1 text-sm">{s.title}</h3>
                <p className="text-primary-600 text-xs font-medium mb-2">{s.time}</p>
                <p className="text-secondary-500 text-xs leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

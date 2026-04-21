import { PageLayout } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Designer Marketplace',
  description: 'We are a premier design marketplace connecting world-class design talent with forward-thinking companies.',
}

const stats = [
  { value: '60,000+', label: 'Design Professionals' },
  { value: '12,000+', label: 'Companies Served' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '140+', label: 'Countries Represented' },
]

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Creative Excellence',
    description: 'We hold every portfolio, proposal, and delivered project to the highest standard of craft. Mediocre work has no home here.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Radical Transparency',
    description: 'Clear pricing, honest timelines, direct communication. No hidden fees, no vague deliverables — just straightforward collaboration.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community First',
    description: 'This platform exists because of its people. We invest in our designer community through mentorship, resources, and fair compensation models.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Purposeful Growth',
    description: 'We scale thoughtfully — adding features that solve real problems, not ones that add noise. Quality over velocity, always.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Trust by Design',
    description: 'From verified identities to milestone-based payments and dispute resolution, every system we build is engineered around trust.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Global Perspective',
    description: 'Design is a universal language. We celebrate diversity of thought, style, and background — because the best work comes from many viewpoints.',
  },
]

const team = [
  {
    name: 'Alexandra Chen',
    role: 'Co-Founder & CEO',
    bio: 'Former design lead at Figma and IDEO. Spent 12 years on both sides of the hiring desk and founded Designer Marketplace to fix the broken freelance design economy.',
    initials: 'AC',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Marcus Webb',
    role: 'Co-Founder & CTO',
    bio: 'Ex-staff engineer at Stripe and GitHub. Believes the best infrastructure is invisible — you should feel the platform working, not fight against it.',
    initials: 'MW',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Priya Nakamura',
    role: 'Chief Design Officer',
    bio: 'Award-winning product designer with studios in Tokyo and London. Leads all platform UX and our internal design standards that set the benchmark for the industry.',
    initials: 'PN',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'James Okafor',
    role: 'Head of Community',
    bio: 'Coach, curator, and community builder. Previously ran the creative talent programme at Publicis Sapient. Deeply passionate about mentor-driven designer growth.',
    initials: 'JO',
    color: 'bg-success-100 text-success-700',
  },
]

const milestones = [
  { year: '2020', event: 'Founded in London by two frustrated designers who couldn\'t find quality freelance work online.' },
  { year: '2021', event: 'Launched private beta with 500 vetted designers. First enterprise client signed within 30 days.' },
  { year: '2022', event: 'Series A funding secured. Expanded to North America and APAC. Passed 10,000 active designers.' },
  { year: '2023', event: 'Launched Design Studio collaboration tools and live project rooms. Reached 1M project milestones completed.' },
  { year: '2024', event: 'Introduced AI-assisted talent matching. Now representing 140+ countries and serving Global 500 clients.' },
  { year: '2025', event: 'Launched Partner Programme and Enterprise Suite. Recognised by Fast Company as a Most Innovative Design Company.' },
]

export default function AboutPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-secondary-900 text-white">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-secondary-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Our Story
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              We exist to elevate{' '}
              <span className="text-primary-400">design</span>{' '}
              as a profession.
            </h1>
            <p className="text-xl text-secondary-300 leading-relaxed mb-10 max-w-2xl">
              Designer Marketplace was born from a simple belief: that exceptional design talent shouldn&rsquo;t be hidden behind outdated hiring processes. We built the platform we always wished existed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/talents" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                Browse Talent
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20">
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-primary-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Our Origin</span>
              <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-6 leading-tight">
                Built by designers, <br />for the design community.
              </h2>
              <div className="space-y-5 text-secondary-600 leading-relaxed">
                <p>
                  In 2020, Alexandra Chen and Marcus Webb were on opposite sides of the same frustration. Alexandra, a veteran design lead, was spending more time filtering irrelevant proposals on generic freelance platforms than actually making things. Marcus, an engineer who loved working with creatives, kept watching brilliant designers undersell themselves and get underserved.
                </p>
                <p>
                  They started Designer Marketplace in a Shoreditch studio with a whiteboard, strong opinions, and a hundred conversation with designers who felt the same way. The first version was almost embarrassingly simple — a curated directory with a lightweight brief system. But it worked, because it respected people&rsquo;s time.
                </p>
                <p>
                  Five years later, we&rsquo;ve grown into a full creative talent platform — with tools for proposals, collaboration, milestone tracking, and payment — but the core instinct remains the same: every decision we make has to make the work better and the people behind it more valued.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                  </div>
                  <p className="text-secondary-500 text-sm italic leading-relaxed max-w-xs">&ldquo;We wanted to build a platform that treats design as the discipline it truly is — not a commodity, but a craft.&rdquo;</p>
                  <p className="text-secondary-700 font-semibold text-sm mt-4">— Alexandra Chen, CEO</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-50 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary-100 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-secondary-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-4">Principles we don&rsquo;t compromise on</h2>
            <p className="text-secondary-600 max-w-2xl mx-auto text-lg">Every product decision, hiring choice, and policy we write is filtered through these six commitments.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 border border-secondary-200 hover:border-primary-200 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-3">{value.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Our Journey</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3">Five years of building something worth using</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-secondary-200" />
            <div className="space-y-10">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-8 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary-50 border-2 border-primary-200 flex items-center justify-center z-10 relative">
                      <span className="text-primary-700 font-bold text-sm">{m.year}</span>
                    </div>
                  </div>
                  <div className="pt-3 pb-6">
                    <p className="text-secondary-700 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-secondary-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">The People</span>
            <h2 className="text-4xl font-bold text-secondary-900 mt-3 mb-4">Meet the leadership team</h2>
            <p className="text-secondary-600 max-w-xl mx-auto">A small team with big conviction that the creative economy deserves better infrastructure.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-8 border border-secondary-200 text-center hover:shadow-md transition-all duration-200">
                <div className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center mx-auto mb-5 text-xl font-bold`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-secondary-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-4">{member.role}</p>
                <p className="text-secondary-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-secondary-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to be part of something meaningful?</h2>
          <p className="text-secondary-300 text-lg mb-10 max-w-xl mx-auto">
            Whether you&rsquo;re a designer looking for your next great project, or a company searching for exceptional creative talent — your place is here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/jobs" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
              Find Work
            </Link>
            <Link href="/talents" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20">
              Hire Talent
            </Link>
            <Link href="/careers" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20">
              Work With Us
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

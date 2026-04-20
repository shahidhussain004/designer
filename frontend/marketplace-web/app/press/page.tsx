import { PageLayout } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Press — Designer Marketplace',
  description: 'News, press releases, media coverage, and resources for journalists covering Designer Marketplace.',
}

const pressReleases = [
  {
    date: 'March 2025',
    tag: 'Product',
    title: 'Designer Marketplace Launches Enterprise Suite with AI-Assisted Talent Matching',
    excerpt: 'New enterprise tier introduces intelligent matching, dedicated success managers, and integrated team management — built for organisations running design at scale.',
    readTime: '4 min read',
  },
  {
    date: 'November 2024',
    tag: 'Community',
    title: 'Designer Marketplace Passes One Million Milestone Completions',
    excerpt: 'Platform celebrates a landmark moment as the one millionth project milestone is completed, representing over £380M in creative work delivered through the platform since launch.',
    readTime: '3 min read',
  },
  {
    date: 'August 2024',
    tag: 'Growth',
    title: 'Designer Marketplace Expands to 140 Countries with Localised Payments and Compliance',
    excerpt: 'Platform now supports over 40 currencies and local tax compliance frameworks, making it the most globally accessible creative marketplace to date.',
    readTime: '5 min read',
  },
  {
    date: 'April 2024',
    tag: 'Partnership',
    title: 'Designer Marketplace and Figma Announce Deep Integration Partnership',
    excerpt: 'Designers can now import live Figma files directly into project briefs, proposal reviews, and client presentations — reducing file-sharing friction across the creative workflow.',
    readTime: '3 min read',
  },
  {
    date: 'January 2024',
    tag: 'Funding',
    title: 'Designer Marketplace Closes £28M Series A to Scale Creative Talent Infrastructure',
    excerpt: 'Round led by Index Ventures with participation from Balderton Capital. Capital will accelerate product development, international expansion, and community programmes.',
    readTime: '6 min read',
  },
]

const coverage = [
  {
    publication: 'Fast Company',
    headline: '"Designer Marketplace is fixing what every other freelance platform got wrong about creative work."',
    category: 'Design Technology',
    year: '2025',
  },
  {
    publication: 'Wired',
    headline: '"Inside the platform that became the go-to talent layer for design-led companies."',
    category: 'Future of Work',
    year: '2025',
  },
  {
    publication: 'The Guardian',
    headline: '"How a London startup is changing the way creative professionals find meaningful work."',
    category: 'Tech & Business',
    year: '2024',
  },
  {
    publication: 'Design Week',
    headline: '"The marketplace that understands designers — because it was built by them."',
    category: 'Industry News',
    year: '2024',
  },
  {
    publication: 'TechCrunch',
    headline: '"Designer Marketplace raises £28M as demand for vetted creative talent surges post-pandemic."',
    category: 'Funding',
    year: '2024',
  },
  {
    publication: 'Smashing Magazine',
    headline: '"A design-first freelance platform that actually respects the craft — and pays accordingly."',
    category: 'Design Resources',
    year: '2023',
  },
]

const awards = [
  { year: '2025', award: 'Most Innovative Design Company', org: 'Fast Company' },
  { year: '2025', award: 'Best Creative Platform', org: 'Webby Awards' },
  { year: '2024', award: 'Top Startup to Watch', org: 'Forbes Europe' },
  { year: '2024', award: 'Product of the Year — Marketplace', org: 'Product Hunt' },
  { year: '2023', award: 'Editor\'s Choice — Design Tools', org: 'Awwwards' },
]

const tagBadgeColors: Record<string, string> = {
  Product: 'bg-blue-100 text-blue-700',
  Community: 'bg-green-100 text-green-700',
  Growth: 'bg-purple-100 text-purple-700',
  Partnership: 'bg-amber-100 text-amber-700',
  Funding: 'bg-primary-100 text-primary-700',
}

export default function PressPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-gray-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Press & Media
            </span>
            <h1 className="text-5xl font-bold mb-5 leading-tight">
              The Designer Marketplace <span className="text-primary-400">press room.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              News, press releases, brand assets, and everything a journalist needs to tell our story accurately.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#press-kit" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Download Press Kit
              </a>
              <a href="mailto:press@designermarket.io" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-sm">
                Contact Press Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── By the numbers ── */}
      <section className="bg-primary-600 text-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '60,000+', label: 'Designers on platform' },
              { value: '£380M+', label: 'Paid to creative professionals' },
              { value: '1M+', label: 'Milestones delivered' },
              { value: '2020', label: 'Founded in London' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold mb-1">{s.value}</div>
                <div className="text-primary-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Releases ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Press Releases</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Latest announcements</h2>
            </div>
            <Link href="/press/archive" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              View archive →
            </Link>
          </div>
          <div className="space-y-6">
            {pressReleases.map((pr) => (
              <article key={pr.title} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-primary-200 hover:shadow-sm transition-all duration-200 group cursor-pointer">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagBadgeColors[pr.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {pr.tag}
                      </span>
                      <span className="text-gray-400 text-xs">{pr.date}</span>
                      <span className="text-gray-400 text-xs">· {pr.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-primary-700 transition-colors">
                      {pr.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{pr.excerpt}</p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">In the Press</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-3">What people are saying</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Selected coverage from design, technology, and business publications.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverage.map((item) => (
              <div key={item.headline} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-900 text-sm">{item.publication}</span>
                  <span className="text-gray-400 text-xs">{item.year}</span>
                </div>
                <span className="inline-block text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 mb-3">{item.category}</span>
                <blockquote className="text-gray-700 text-sm leading-relaxed italic">{item.headline}</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Recognition</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">Awards & accolades</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {awards.map((a) => (
              <div key={a.award} className="flex items-center justify-between py-5">
                <div className="flex items-center gap-5">
                  <span className="text-sm font-mono text-gray-400 w-12 flex-shrink-0">{a.year}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{a.award}</p>
                    <p className="text-gray-400 text-sm">{a.org}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Kit ── */}
      <section id="press-kit" className="bg-gray-900 text-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest">Press Kit</span>
              <h2 className="text-3xl font-bold mt-3 mb-5">Everything you need to tell our story</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Our press kit includes brand guidelines, approved logos in all formats, approved executive photos, company boilerplate, and key statistics. Please reach out before using any assets not included here.
              </p>
              <div className="space-y-3">
                {[
                  'Logo files (SVG, PNG, dark & light variants)',
                  'Executive headshots and bios',
                  'Product screenshots (current release)',
                  'Company boilerplate (short & long form)',
                  'Key statistics and milestones fact sheet',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-bold text-lg mb-2">Media contact</h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                For interview requests, media accreditation, and press enquiries, contact our communications team directly.
              </p>
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Press contact</p>
                  <a href="mailto:press@designermarket.io" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                    press@designermarket.io
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Response time</p>
                  <p className="text-gray-300 text-sm">Typically within 4 business hours</p>
                </div>
              </div>
              <a
                href="mailto:press@designermarket.io"
                className="block w-full text-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Download Press Kit
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

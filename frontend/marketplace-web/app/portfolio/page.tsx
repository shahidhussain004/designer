"use client"

import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import {
    useCreatePortfolio,
    useDeletePortfolio,
    useUpdatePortfolio,
    useUserPortfolio,
} from '@/hooks/useUsers'
import { useAuth } from '@/lib/context/AuthContext'
import {
    ArrowRight,
    Edit3,
    ExternalLink,
    Eye,
    EyeOff,
    Github,
    Globe,
    Plus,
    Share2,
    Trash2,
    X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

// ─── Static data ─────────────────────────────────────────────────────────────

const trustStats = [
  { value: '60,000+', label: 'Design Professionals' },
  { value: '12,000+', label: 'Companies Hiring' },
  { value: '£4.2M+', label: 'Earned Monthly' },
  { value: '96%', label: 'Profile-to-Contact Rate' },
]

const whyPortfolio = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: 'Get discovered by search',
    description: 'Companies actively search portfolios by skill, tool, and category. Every tag you add makes you easier to find.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
    title: 'Build trust before the first message',
    description: 'A polished portfolio removes hiring hesitation. Companies reach out when they\'re already convinced by your work.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    title: 'Command better rates',
    description: 'Designers with comprehensive portfolios charge 40% more on average and attract clients who respect that value.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'Track interest from companies',
    description: 'See who has viewed your work, which projects resonate most, and where your inbound interest comes from.',
  },
]

const portfolioFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: 'Multi-Image Galleries',
    description: 'Each project supports multiple high-resolution images. Add before/afters, process shots, and final screens — tell the full design story.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    title: 'Live Demo & GitHub Links',
    description: 'Connect your live URL, GitHub repository, or source code link. Let companies interact with your work directly from your profile.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
    title: 'Project Categorisation',
    description: 'Tag each project as UI/UX, branding, motion, illustration, or development. Match exactly what companies are searching for.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    title: 'Technology & Tools Tagging',
    description: 'Declare every tool, technology, and skill used per project. Get found by companies searching "Figma + React" or "After Effects + Cinema 4D".',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: 'Granular Visibility Control',
    description: 'Show or hide individual projects without deleting them. Perfect for client-confidential work or projects still in progress.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
      </svg>
    ),
    title: 'Ordered & Featured Projects',
    description: 'Control the narrative. Put your strongest work first, pin featured projects to the top, and shape how companies experience your profile.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Create your free account',
    time: '2 minutes',
    detail: 'Sign up in under two minutes. Free forever for designers — no credit card, no trial deadline.',
  },
  {
    step: '02',
    title: 'Add your best projects',
    time: 'Your pace',
    detail: 'Use our structured builder to add titles, descriptions, images, live links, tools used, and project categories.',
  },
  {
    step: '03',
    title: 'Optimise for discovery',
    time: 'Ongoing',
    detail: 'Tag skills, set categories, control visibility, and pin your strongest pieces. The more detail, the more you get found.',
  },
  {
    step: '04',
    title: 'Get hired by top companies',
    time: 'Start now',
    detail: 'Companies actively search portfolios daily. A complete profile gets 8× more views than an empty one.',
  },
]

const testimonials = [
  {
    name: 'Priya Chandra',
    role: 'Senior UX Designer',
    context: 'Now at a Series B fintech',
    quote: "I landed two contracts in my first month purely from inbound company enquiries through my portfolio. I hadn't even applied anywhere. The technology tags on each project made the difference — recruiters could see immediately that I knew their stack.",
    highlight: '6× more profile views than LinkedIn',
    initials: 'PC',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Marcus Webb',
    role: 'Brand & Visual Designer',
    context: 'Freelance, London',
    quote: "The category filtering is what makes this platform different. Companies searching for a brand designer who also does motion found me specifically, reached out with a well-matched brief, and we closed within three days of first contact.",
    highlight: '£80k+ in placed contracts',
    initials: 'MW',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Aiko Tanaka',
    role: 'Motion Designer',
    context: 'Now at Google',
    quote: "My portfolio here was the first thing the Google recruiter mentioned. They said it was the clearest presentation of a motion design background they'd seen on the platform. I didn't write a cover letter — the work spoke.",
    highlight: 'Hired directly from portfolio',
    initials: 'AT',
    color: 'bg-rose-100 text-rose-700',
  },
]

const samplePortfolios = [
  {
    title: 'Fintech Mobile App Redesign',
    category: 'UI/UX Design',
    designer: 'Sarah K.',
    tags: ['Figma', 'Prototyping', 'User Research'],
    gradient: 'from-indigo-500 to-purple-600',
    letter: 'F',
    description: 'End-to-end redesign of a mobile banking app — from discovery to shipped product — that increased task completion by 34%.',
  },
  {
    title: 'Modular Brand System',
    category: 'Brand Identity',
    designer: 'James O.',
    tags: ['Figma', 'Adobe CC', 'Motion'],
    gradient: 'from-amber-400 to-orange-500',
    letter: 'M',
    description: 'A flexible, system-first brand identity for a SaaS company spanning logo, typography, colour, and guidelines across 80+ brand touchpoints.',
  },
  {
    title: 'Design System — 200+ Components',
    category: 'Design Systems',
    designer: 'Lin W.',
    tags: ['React', 'Storybook', 'Figma Tokens'],
    gradient: 'from-teal-400 to-cyan-600',
    letter: 'D',
    description: 'Built from scratch: a fully documented component library with 200+ components, dark mode, and token-driven theming.',
  },
]

const CATEGORY_OPTIONS = [
  'UI/UX Design',
  'Brand Identity',
  'Web Design',
  'Motion & Animation',
  'Illustration',
  'Photography',
  'Front-end Development',
  'Mobile Design',
  'Print & Editorial',
  '3D & Spatial Design',
  'Design Systems',
  'Other',
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl?: string
  thumbnailUrl?: string
  images?: Array<{ url: string; caption?: string; order?: number }>
  projectUrl?: string
  liveUrl?: string
  githubUrl?: string
  sourceUrl?: string
  projectCategory?: string
  technologies?: string[]
  toolsUsed?: string[]
  skillsDemonstrated?: string[]
  startDate?: string
  completionDate?: string
  displayOrder: number
  highlightOrder?: number
  isVisible: boolean
  userId: number
  createdAt: string
  updatedAt: string
}

interface FormState {
  title: string
  description: string
  projectCategory: string
  imageUrl: string
  additionalImages: string
  projectUrl: string
  liveUrl: string
  githubUrl: string
  sourceUrl: string
  technologies: string
  toolsUsed: string
  skillsDemonstrated: string
  startDate: string
  completionDate: string
  isVisible: boolean
  displayOrder: number
  highlightOrder: string
}

const defaultForm: FormState = {
  title: '',
  description: '',
  projectCategory: '',
  imageUrl: '',
  additionalImages: '',
  projectUrl: '',
  liveUrl: '',
  githubUrl: '',
  sourceUrl: '',
  technologies: '',
  toolsUsed: '',
  skillsDemonstrated: '',
  startDate: '',
  completionDate: '',
  isVisible: true,
  displayOrder: 0,
  highlightOrder: '',
}

// ─── Portfolio Completeness Score ─────────────────────────────────────────────

function computeCompleteness(items: PortfolioItem[]): { score: number; tips: string[] } {
  if (items.length === 0) return { score: 0, tips: ['Add your first project to start building your profile.'] }
  const tips: string[] = []
  let score = 0

  // Has at least 1 project
  score += 20
  if (items.length >= 3) score += 10
  else tips.push(`Add ${3 - items.length} more project${3 - items.length > 1 ? 's' : ''} to reach the recommended minimum of 3.`)

  const allHaveImages = items.every(i => i.imageUrl)
  if (allHaveImages) score += 15
  else tips.push('Add a cover image to every project — profiles with images get 4× more views.')

  const allHaveTech = items.every(i => (i.technologies?.length ?? 0) > 0)
  if (allHaveTech) score += 15
  else tips.push('Tag the technologies used on each project to appear in skill-based searches.')

  const allHaveCategory = items.every(i => i.projectCategory)
  if (allHaveCategory) score += 15
  else tips.push('Set a project category on all items to improve discovery in filtered searches.')

  const anyHaveLive = items.some(i => i.liveUrl || i.projectUrl || i.githubUrl)
  if (anyHaveLive) score += 15
  else tips.push('Add a live demo or GitHub link to at least one project — companies love to explore working products.')

  const hasDescription = items.every(i => i.description?.length > 80)
  if (hasDescription) score += 10
  else tips.push('Expand your project descriptions to at least 80 characters. Explain your role, your process, and the outcome.')

  return { score: Math.min(score, 100), tips: tips.slice(0, 3) }
}

// ─── Form Component ───────────────────────────────────────────────────────────

function PortfolioForm({
  editingItem,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSaving,
}: {
  editingItem: PortfolioItem | null
  formData: FormState
  setFormData: (d: FormState) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const label = 'block text-sm font-semibold text-gray-700 mb-1.5'
  const input =
    'w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="font-bold text-gray-900 text-base">
            {editingItem ? 'Edit Project' : 'Add New Project'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            The more detail you add, the more companies will find you through search.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-500"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Section: Core */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Project Details
          </p>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={input}
                  placeholder="e.g. E-commerce App Redesign"
                />
              </div>
              <div>
                <label className={label}>Category</label>
                <select
                  value={formData.projectCategory}
                  onChange={e => setFormData({ ...formData, projectCategory: e.target.value })}
                  className={input}
                >
                  <option value="">Select a category…</option>
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>End / Delivery Date</label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                    className={input}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={label}>Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={input}
                placeholder="Describe the project: your role, the brief, your process, and the outcome. Aim for 80+ characters."
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length} chars
                {formData.description.length > 0 && formData.description.length < 80 && (
                  <span className="text-amber-500 ml-1">— add a bit more context for best results</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Section: Images */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Images
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Cover Image URL *</label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className={input}
                placeholder="https://…/cover.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">Shown as the primary card thumbnail</p>
            </div>
            <div>
              <label className={label}>Additional Images <span className="text-gray-400 font-normal">(comma-separated URLs)</span></label>
              <input
                type="text"
                value={formData.additionalImages}
                onChange={e => setFormData({ ...formData, additionalImages: e.target.value })}
                className={input}
                placeholder="https://…/screen1.jpg, https://…/screen2.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">Up to 8 additional images for the full gallery</p>
            </div>
          </div>
        </div>

        {/* Section: Links */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Links
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>
                <Globe className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                className={input}
                placeholder="https://myproject.com"
              />
            </div>
            <div>
              <label className={label}>
                <Github className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                GitHub Repository
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                className={input}
                placeholder="https://github.com/…"
              />
            </div>
            <div>
              <label className={label}>Case Study / Project URL</label>
              <input
                type="url"
                value={formData.projectUrl}
                onChange={e => setFormData({ ...formData, projectUrl: e.target.value })}
                className={input}
                placeholder="https://behance.net/… or dribbble.com/…"
              />
            </div>
            <div>
              <label className={label}>Source / Download URL</label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                className={input}
                placeholder="https://figma.com/… or dropbox.com/…"
              />
            </div>
          </div>
        </div>

        {/* Section: Skills & Tools */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Skills & Technologies <span className="text-gray-300 font-normal normal-case">(comma-separated)</span>
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Technologies</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                className={input}
                placeholder="React, TypeScript, Node.js"
              />
              <p className="text-xs text-gray-400 mt-1">Programming languages & frameworks</p>
            </div>
            <div>
              <label className={label}>Design / Creation Tools</label>
              <input
                type="text"
                value={formData.toolsUsed}
                onChange={e => setFormData({ ...formData, toolsUsed: e.target.value })}
                className={input}
                placeholder="Figma, After Effects, Framer"
              />
              <p className="text-xs text-gray-400 mt-1">Apps and tools you designed in</p>
            </div>
            <div>
              <label className={label}>Skills Demonstrated</label>
              <input
                type="text"
                value={formData.skillsDemonstrated}
                onChange={e => setFormData({ ...formData, skillsDemonstrated: e.target.value })}
                className={input}
                placeholder="User Research, Interaction Design"
              />
              <p className="text-xs text-gray-400 mt-1">Discipline-level skills shown in this project</p>
            </div>
          </div>
        </div>

        {/* Section: Display */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Display Settings
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700">Visible on your public profile</span>
                <p className="text-xs text-gray-400">Hidden projects are saved but not shown to companies</p>
              </div>
            </label>
            <div className="flex items-center gap-3">
              <div>
                <label className={label}>Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className={`${input} w-24`}
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
              </div>
              <div>
                <label className={label}>Feature Pin <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="number"
                  min={1}
                  value={formData.highlightOrder}
                  onChange={e => setFormData({ ...formData, highlightOrder: e.target.value })}
                  className={`${input} w-24`}
                  placeholder="—"
                />
                <p className="text-xs text-gray-400 mt-1">1 = top featured slot</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>{editingItem ? 'Update Project' : 'Add to Portfolio'}</>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Portfolio Item Card ──────────────────────────────────────────────────────

function PortfolioCard({
  item,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  item: PortfolioItem
  onEdit: (item: PortfolioItem) => void
  onDelete: (id: number) => void
  onToggleVisibility: (item: PortfolioItem) => void
}) {
  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md ${
        item.isVisible ? 'border-gray-200 hover:border-primary-200' : 'border-amber-200 bg-amber-50/30'
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail */}
        <div className="lg:w-64 xl:w-72 flex-shrink-0 relative bg-gray-100 aspect-video lg:aspect-auto lg:min-h-[200px]">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 288px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}
          {/* Category badge */}
          {item.projectCategory && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-sm">
                {item.projectCategory}
              </span>
            </div>
          )}
          {/* Not visible badge */}
          {!item.isVisible && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                <EyeOff className="w-3 h-3" /> Hidden
              </span>
            </div>
          )}
          {/* Featured badge */}
          {item.highlightOrder != null && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-snug">{item.title}</h3>
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleVisibility(item)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                title={item.isVisible ? 'Hide from profile' : 'Make visible'}
              >
                {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date range */}
          {(item.startDate || item.completionDate) && (
            <p className="text-xs text-gray-400 mb-2">
              {item.startDate && new Date(item.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              {item.startDate && item.completionDate && ' – '}
              {item.completionDate && new Date(item.completionDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </p>
          )}

          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>

          {/* Tag groups */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(item.technologies ?? []).slice(0, 4).map(tag => (
              <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">{tag}</span>
            ))}
            {(item.toolsUsed ?? []).slice(0, 2).map(tag => (
              <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-violet-50 text-violet-700 font-medium">{tag}</span>
            ))}
            {(item.skillsDemonstrated ?? []).slice(0, 2).map(tag => (
              <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-teal-50 text-teal-700 font-medium">{tag}</span>
            ))}
            {((item.technologies?.length ?? 0) + (item.toolsUsed?.length ?? 0) + (item.skillsDemonstrated?.length ?? 0)) > 8 && (
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">+more</span>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-auto">
            {(item.liveUrl || item.projectUrl) && (
              <a
                href={item.liveUrl || item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Globe className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                <Github className="w-3.5 h-3.5" /> Source
              </a>
            )}
            {item.sourceUrl && !item.githubUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Files
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Authenticated Portfolio Hub ──────────────────────────────────────────────

function AuthPortfolioHub({ userId, userName }: { userId: number; userName: string }) {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [formData, setFormData] = useState<FormState>(defaultForm)
  const [undoItem, setUndoItem] = useState<PortfolioItem | null>(null)
  const undoTimerRef = useRef<number | null>(null)

  const { data: rawPortfolio = [], isLoading, isError, error, refetch } = useUserPortfolio(userId)
  const portfolio = rawPortfolio as PortfolioItem[]
  const createMutation = useCreatePortfolio()
  const updateMutation = useUpdatePortfolio()
  const deleteMutation = useDeletePortfolio()

  const { score, tips } = computeCompleteness(portfolio)

  const buildPayload = (f: FormState) => ({
    title: f.title,
    description: f.description,
    projectCategory: f.projectCategory || undefined,
    imageUrl: f.imageUrl || undefined,
    images: f.additionalImages
      ? f.additionalImages
          .split(',')
          .map((url, i) => ({ url: url.trim(), order: i + 1 }))
          .filter(img => img.url)
      : undefined,
    projectUrl: f.projectUrl || undefined,
    liveUrl: f.liveUrl || undefined,
    githubUrl: f.githubUrl || undefined,
    sourceUrl: f.sourceUrl || undefined,
    technologies: f.technologies.split(',').map(t => t.trim()).filter(Boolean),
    toolsUsed: f.toolsUsed.split(',').map(t => t.trim()).filter(Boolean),
    skillsDemonstrated: f.skillsDemonstrated.split(',').map(t => t.trim()).filter(Boolean),
    startDate: f.startDate || undefined,
    completionDate: f.completionDate || undefined,
    isVisible: f.isVisible,
    displayOrder: f.displayOrder,
    highlightOrder: f.highlightOrder ? parseInt(f.highlightOrder) : undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ userId, itemId: editingItem.id, input: buildPayload(formData) })
      } else {
        await createMutation.mutateAsync({
          userId,
          input: { ...buildPayload(formData), displayOrder: portfolio.length },
        })
      }
      resetForm()
    } catch (err) {
      console.error('Failed to save portfolio item:', err)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      projectCategory: item.projectCategory ?? '',
      imageUrl: item.imageUrl ?? '',
      additionalImages: (item.images ?? []).map(img => img.url).join(', '),
      projectUrl: item.projectUrl ?? '',
      liveUrl: item.liveUrl ?? '',
      githubUrl: item.githubUrl ?? '',
      sourceUrl: item.sourceUrl ?? '',
      technologies: (item.technologies ?? []).join(', '),
      toolsUsed: (item.toolsUsed ?? []).join(', '),
      skillsDemonstrated: (item.skillsDemonstrated ?? []).join(', '),
      startDate: item.startDate ?? '',
      completionDate: item.completionDate ?? '',
      isVisible: item.isVisible,
      displayOrder: item.displayOrder,
      highlightOrder: item.highlightOrder?.toString() ?? '',
    })
    setShowForm(true)
    setTimeout(() => document.getElementById('portfolio-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this portfolio item? This cannot be undone.')) return
    try {
      await deleteMutation.mutateAsync({ userId, itemId: id })
    } catch (err) {
      console.error('Failed to delete portfolio item:', err)
    }
  }

  const handleToggleVisibility = async (item: PortfolioItem) => {
    if (item.isVisible) {
      setUndoItem({ ...item, isVisible: false })
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = window.setTimeout(() => { setUndoItem(null) }, 6000)
    }
    try {
      await updateMutation.mutateAsync({
        userId,
        itemId: item.id,
        input: { ...item, isVisible: !item.isVisible },
      })
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
      setUndoItem(null)
    }
  }

  const restoreVisibility = async () => {
    if (!undoItem) return
    if (undoTimerRef.current) { window.clearTimeout(undoTimerRef.current); undoTimerRef.current = null }
    const item = undoItem
    setUndoItem(null)
    try {
      await updateMutation.mutateAsync({ userId, itemId: item.id, input: { ...item, isVisible: true } })
    } catch (err) {
      console.error('Failed to restore visibility:', err)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData(defaultForm)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({ ...defaultForm, displayOrder: portfolio.length })
    setShowForm(true)
    setTimeout(() => document.getElementById('portfolio-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const publicProfileUrl = `/portfolio/${userId}`

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (isError) {
    return (
      <PageLayout>
        <ErrorMessage message={(error as Error)?.message || 'Failed to load your portfolio'} retry={refetch} />
      </PageLayout>
    )
  }

  const firstName = userName.split(' ')[0]

  return (
    <PageLayout>
      <div className="bg-white">
        {/* ── Command Header ── */}
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Portfolio Hub</p>
                <h1 className="text-3xl font-bold text-gray-900">
                  {firstName}&rsquo;s Portfolio
                </h1>
                <p className="text-gray-500 mt-1.5">
                  {portfolio.length === 0
                    ? 'Start adding projects to build your profile.'
                    : `${portfolio.length} project${portfolio.length !== 1 ? 's' : ''} · ${portfolio.filter(p => p.isVisible).length} visible`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={publicProfileUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Public Profile
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + publicProfileUrl)
                    alert('Portfolio link copied to clipboard!')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </button>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
            {/* Main column */}
            <div className="space-y-6">
              {/* Form */}
              {showForm && (
                <div id="portfolio-form">
                  <PortfolioForm
                    editingItem={editingItem}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    isSaving={createMutation.isPending || updateMutation.isPending}
                  />
                </div>
              )}

              {/* Empty state */}
              {portfolio.length === 0 && !showForm && (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Your portfolio is empty</h2>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
                    Profiles with portfolios get 8× more views. Add your first project — it only takes two minutes.
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Project
                  </button>
                </div>
              )}

              {/* Portfolio list */}
              {portfolio.length > 0 && (
                <div className="space-y-4">
                  {portfolio.map(item => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                  {!showForm && (
                    <button
                      onClick={handleAddNew}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-sm font-medium text-gray-400 hover:text-primary-600 rounded-2xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      Add another project
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5 lg:sticky lg:top-6">
              {/* Completeness score */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Portfolio Strength</h3>
                  <span
                    className={`text-sm font-bold ${
                      score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'
                    }`}
                  >
                    {score}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                {tips.length > 0 && (
                  <div className="space-y-2">
                    {tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                          !
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                )}
                {score === 100 && (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    Portfolio complete — maximum discoverability
                  </p>
                )}
              </div>

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">At a Glance</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Projects', value: portfolio.length },
                    { label: 'Visible to Companies', value: portfolio.filter(p => p.isVisible).length },
                    { label: 'Featured Projects', value: portfolio.filter(p => p.highlightOrder != null).length },
                    { label: 'With Live Links', value: portfolio.filter(p => p.liveUrl || p.projectUrl).length },
                    { label: 'With GitHub Links', value: portfolio.filter(p => p.githubUrl).length },
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{stat.label}</span>
                      <span className="font-semibold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
                <h3 className="font-bold text-primary-900 text-sm mb-3">Pro Tip</h3>
                <p className="text-xs text-primary-700 leading-relaxed">
                  Companies on Designer Marketplace filter by tool and category combination. Tagging both <strong>Figma</strong> as a tool and <strong>UI/UX Design</strong> as a category increases search visibility by 3×.
                </p>
              </div>

              {/* Back to dashboard */}
              <Link
                href="/dashboard/freelancer"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-colors text-sm font-medium text-gray-700 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Undo banner */}
      {undoItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-xl">
          <span>Project hidden from your profile</span>
          <button
            onClick={restoreVisibility}
            className="underline text-primary-300 font-medium hover:text-primary-200"
          >
            Undo
          </button>
        </div>
      )}
    </PageLayout>
  )
}

// ─── Guest / Marketing View ───────────────────────────────────────────────────

function GuestPortfolioPage() {
  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-gray-300 mb-6 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                Free Portfolio Builder
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your design portfolio,{' '}
                <span className="text-primary-400">built to win work.</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-lg">
                Stand out in a marketplace of 60,000+ designers. Add projects, showcase your skills, and
                get discovered by companies that match your expertise — for free, forever.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  Create Your Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/10"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-gray-500 text-sm mt-4">No credit card. Takes 2 minutes.</p>
            </div>

            {/* Right: sample portfolio cards */}
            <div className="hidden lg:block relative">
              <div className="relative space-y-3">
                {samplePortfolios.map((p, i) => (
                  <div
                    key={p.title}
                    className={`flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 transition-transform ${i === 1 ? 'translate-x-6' : i === 2 ? 'translate-x-12' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                      {p.letter}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{p.title}</p>
                      <p className="text-gray-400 text-xs mb-2">{p.category}</p>
                      <div className="flex gap-1.5">
                        {p.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-gray-300 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-primary-600 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            {trustStats.map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-primary-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Portfolio ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Why it matters</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
              Your portfolio is your strongest pitch.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              A CV tells companies what you&rsquo;ve done. A portfolio proves it. Here&rsquo;s what a great one does for you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPortfolio.map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Showcase ── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">See it in action</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Portfolios that win business</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Every detail you add — images, links, tools, categories — is another signal that helps companies find and choose you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {samplePortfolios.map(p => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary-200 transition-all duration-200 group">
                {/* Image area */}
                <div className={`h-48 bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}>
                  <span className="text-6xl font-black text-white/20">{p.letter}</span>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 text-gray-700 rounded-full">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {p.designer[0]}
                    </div>
                    <span className="text-xs text-gray-500">{p.designer}</span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                      <Globe className="w-3 h-3" /> Live
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">What you get</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Everything you need to stand out</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our portfolio builder is designed around how companies actually search for designers — not how agencies think they do.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioFeatures.map(feature => (
              <div key={feature.title} className="group flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Get started</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Four steps to a portfolio that works for you</h2>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-6 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-gray-200" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map(step => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-12 h-12 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center mb-5 shadow-md z-10">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-xs font-semibold text-primary-600 mb-2">{step.time}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Designer stories</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">The work wins the work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="flex flex-col bg-gray-50 rounded-2xl border border-gray-100 p-7 hover:border-primary-100 hover:shadow-sm transition-all duration-200">
                {/* Quote */}
                <div className="mb-6 flex-1">
                  <svg className="w-8 h-8 text-primary-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 leading-relaxed text-sm">&ldquo;{t.quote}&rdquo;</p>
                </div>
                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-200">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs truncate">{t.role} · {t.context}</p>
                  </div>
                </div>
                {/* Stat */}
                <div className="mt-4 px-3 py-2 bg-primary-50 rounded-lg">
                  <p className="text-primary-700 text-xs font-semibold">{t.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 opacity-20 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to build a portfolio that works<br />
            <span className="text-primary-400">while you sleep?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            12,000+ companies are actively searching portfolios on Designer Marketplace right now.
            Make sure you&rsquo;re there to be found.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
            >
              Create Your Free Portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20 text-lg"
            >
              Sign In
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">Free forever for designers. No credit card required.</p>
        </div>
      </section>
    </PageLayout>
  )
}

// ─── Page entry ───────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  if (user) {
    return <AuthPortfolioHub userId={user.id} userName={user.fullName ?? user.username ?? 'You'} />
  }

  return <GuestPortfolioPage />
}

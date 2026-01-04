'use client'

import { useProjectCategories } from '@/hooks/useProjects';
import type { PostCategory } from '@/lib/apiTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import HowItWorksCarousel from './how-it-works-carousel';
import SuccessFeaturesSection from './success-feature-section';

const MotionDiv = motion.div as unknown as React.ComponentType<React.ComponentProps<'div'> & any>
const MotionP = motion.p as unknown as React.ComponentType<React.ComponentProps<'p'> & any>
const MotionSpan = motion.span as unknown as React.ComponentType<React.ComponentProps<'span'> & any>

const TAGLINES = [
  ["Talent", "Opportunity"],
  ["Skills", "Growth"],
  ["Creators", "the Future"],
  ["Innovation", "Success"],
  ["Vision", "Reality"],
]

// Particle component for the morphing effect
function Particle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <MotionSpan
      className="absolute w-1 h-1 rounded-full bg-red-500"
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: [0, x],
        y: [0, y - 40],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
    />
  )
}

// Animated word with glow and particle trail
function MorphingWord({ word, color = "text-red-500" }: { word: string; color?: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate particles on word change
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 20,
      delay: i * 0.05,
    }))
    setParticles(newParticles)
  }, [word])

  return (
    <span className="relative inline-block">
      {/* Glow effect behind text */}
      <MotionSpan
        className="absolute inset-0 blur-xl bg-red-500/30 -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.6, 0.3], scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.6 }}
      />

      {/* Particles */}
      <span className="absolute inset-0 overflow-visible pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} />
        ))}
      </span>

      {/* Main text with morphing animation */}
      <AnimatePresence mode="wait">
        <MotionSpan
          key={word}
          className={`${color} inline-block`}
          initial={{
            opacity: 0,
            scale: 0.8,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </MotionSpan>
      </AnimatePresence>
    </span>
  )
}

type Category = PostCategory

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Development & IT' },
  { id: 2, name: 'Design & Creative' },
  { id: 3, name: 'UI/UX Design' },
  { id: 4, name: 'Video & Animation' },
  { id: 5, name: '3D Modeling' },
  { id: 6, name: 'Branding & Identity' },
];

const stats = [
  { value: '50K+', label: 'Active Freelancers' },
  { value: '10K+', label: 'Companies Hiring' },
  { value: '$2B+', label: 'Total Earnings Paid' },
  { value: '98%', label: 'Client Satisfaction' },
];

const trustedCompanies = [
  'Google', 'Microsoft', 'Adobe', 'Spotify', 'Airbnb', 'Stripe'
];

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'talents' | 'jobs'>('talents');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: categoriesData = [] } = useProjectCategories();
  const categories = categoriesData.length > 0 ? categoriesData : FALLBACK_CATEGORIES;

  const [index, setIndex] = useState(0)

  useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % TAGLINES.length)
      }, 3500)
      return () => clearInterval(interval)
    }, [])
  
    const [left, right] = TAGLINES[index]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <MotionSpan
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-500/20 text-primary-400 mb-6"
            >
              🚀 The #1 Platform for Creative Professionals
            </MotionSpan>
              
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <MotionSpan initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.2 }}>
                Where{" "}
              </MotionSpan>
              <MorphingWord word={left} />
              <MotionSpan initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.3 }}>
                {" "}
                Meets{" "}
              </MotionSpan>
              <MorphingWord word={right} />
            </h1>
              
              <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-xl"
            >
                Connect with world-class designers, developers, and creative professionals. 
                Build your dream team or find your next opportunity.
              </MotionP>
              
              {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
             className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/25"
                >
                  Get Started Free
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/20"
                >
                  Browse Jobs
                </Link>
              </MotionDiv>
            </div>
            
            {/* Right - Search Panel */}
             <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/20 shadow-2xl">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('talents')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === 'talents'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  🎨 Find Talent
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === 'jobs'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  💼 Find Jobs
                </button>
              </div>
              
              {/* Search */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'talents' ? 'Search for designers, developers...' : 'Search for job opportunities...'}
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-input-focus"
                />
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Categories */}
              <div className="space-y-3">
                <p className="text-white/70 text-sm font-medium">Popular categories:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat: Category) => (
                    <Link
                      key={cat.id + '-' + cat.name}
                      href={`/jobs?categoryId=${cat.id}`}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-all border border-white/10 hover:border-white/30"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-700 py-12 border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wide mb-8">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {trustedCompanies.map((company, idx) => (
              <div
                key={idx}
                className="text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksCarousel />

      {/* Feature Cards Section */}
      <SuccessFeaturesSection />

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Learn New Skills</h2>
              <p className="text-gray-600">Master the latest technologies with expert-led courses</p>
            </div>
            <Link href="/courses" className="hidden sm:inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all courses
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Master Modern UI Design', category: 'UI/UX Design', lessons: 12, duration: '4h 30m', color: 'bg-pink-500', emoji: '🎨' },
              { title: 'React & Next.js Fundamentals', category: 'Web Development', lessons: 20, duration: '8h 15m', color: 'bg-blue-500', emoji: '💻' },
              { title: 'Build iOS & Android Apps', category: 'Mobile Development', lessons: 18, duration: '7h 45m', color: 'bg-green-500', emoji: '📱' },
            ].map((course, idx) => (
              <Link key={idx} href="/courses" className="group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-primary-200">
                  <div className={`${course.color} h-40 flex items-center justify-center text-5xl`}>
                    {course.emoji}
                  </div>
                  <div className="p-6">
                    <span className="text-primary-600 text-sm font-medium">{course.category}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2">
                      {course.lessons} lessons • {course.duration}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all courses
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of creative professionals and companies building the future together.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Access to verified, skilled professionals',
                  'Secure payments with milestone protection',
                  'Dedicated support when you need it',
                  'No hidden fees or commissions',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg transition-all shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/20"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

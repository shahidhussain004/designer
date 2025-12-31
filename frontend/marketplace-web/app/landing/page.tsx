'use client'

import { IconCalendar, IconSearch, IconStar, VideoBackground } from '@/components/ui';
import { parseCategories } from '@/lib/apiParsers';
import type { JobCategory } from '@/lib/apiTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Category = JobCategory

const rotatingWords = [
  { line1: 'Creator-First', line2: 'Portfolio & Opportunity', line3: 'Platform' },
  { line1: 'Design-Driven', line2: 'Careers &', line3: 'Collaboration' },
  { line1: 'Built for Creators', line2: 'Jobs, Gigs, &', line3: 'Growth' },
  { line1: 'Empowering', line2: 'Designers &', line3: 'Developers' }
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 0, name: 'Development & IT' },
  { id: 0, name: 'Design & Creative' },
  { id: 0, name: 'UI/UX Design' },
  { id: 0, name: 'Video & Animation' },
  { id: 0, name: '3D Modeling' },
  { id: 0, name: 'Branding & Identity' },
];

const LandingPage = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'talents' | 'jobs'>('talents');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      try {
        const res = await fetch('/api/job-categories', { signal });
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const data = await res.json();
        const categories = parseCategories(data);
        setCategories(categories);
      } catch (err: unknown) {
        const maybeErr = err as { name?: string }
        if (maybeErr.name === 'AbortError') return
        console.error('Error loading categories:', err)
        // keep fallback categories
      }
    }

    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Video Background - replaced with gradient */}
      <VideoBackground />

     {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-end px-8 pt-12">
        {/* Hero Section */}
        <div className="text-left mb-8 w-full max-w-5xl text-white">
          <div className="relative h-64 flex flex-col items-start justify-end overflow-visible">
            
            {/* First line */}
            <h2 
              key={`word-${currentWordIndex}`}
              className="text-5xl font-bold relative z-10 mb-2"
            >
              {rotatingWords[currentWordIndex].line1}
            </h2>

            {/* Second line */}
            <h2 
              key={`line2-${currentWordIndex}`}
              className="text-5xl font-bold relative z-10 mb-2"
            >
              {rotatingWords[currentWordIndex].line2}
            </h2>

            {/* Third line */}
            <h2 
              key={`line3-${currentWordIndex}`}
              className="text-5xl font-bold relative z-10 mb-4"
            >
              {rotatingWords[currentWordIndex].line3}
            </h2>
          </div>

          <h4 className="text-xl font-light mb-6">
            Built to help businesses move faster with trusted creative professionals
          </h4>
        </div>

        <style jsx>{`
          @keyframes wordSlideReveal {
            0% {
              opacity: 0;
              transform: translateX(-100%);
              filter: blur(10px);
            }
            15% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            80% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            100% {
              opacity: 0;
              transform: translateX(100%);
              filter: blur(10px);
            }
          }

          @keyframes secondLineReveal {
            0% {
              opacity: 0;
              transform: translateX(-100%);
              filter: blur(10px);
            }
            10% {
              opacity: 0;
              transform: translateX(-100%);
              filter: blur(10px);
            }
            25% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            75% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            90% {
              opacity: 0;
              transform: translateX(100%);
              filter: blur(10px);
            }
            100% {
              opacity: 0;
              transform: translateX(100%);
              filter: blur(10px);
            }
          }

          @keyframes thirdLineReveal {
            0% {
              opacity: 0;
              transform: translateX(-100%);
              filter: blur(10px);
            }
            20% {
              opacity: 0;
              transform: translateX(-100%);
              filter: blur(10px);
            }
            35% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            70% {
              opacity: 1;
              transform: translateX(0%);
              filter: blur(0px);
            }
            85% {
              opacity: 0;
              transform: translateX(100%);
              filter: blur(10px);
            }
            100% {
              opacity: 0;
              transform: translateX(100%);
              filter: blur(10px);
            }
          }
        `}</style>


        {/* Tab Section */}
        <div className="w-full max-w-5xl mb-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('talents')}
              className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'talents'
                  ? 'bg-white text-purple-900 shadow-2xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <IconStar className="inline-block w-5 h-5 mr-2" />
              Design Talents
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'jobs'
                  ? 'bg-white text-purple-900 shadow-2xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <IconCalendar className="inline-block w-5 h-5 mr-2" />
              Available Jobs
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {activeTab === 'talents' ? (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for designer services..."
                    className="flex-1 px-6 py-4 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-300"
                  />
                  <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2">
                    <IconSearch className="w-5 h-5" />
                    Search
                  </button>
                </div>

                <div className="border-t border-white/30 pt-6">
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id + '-' + cat.name}
                        href={`/jobs?categoryId=${cat.id}`}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-all hover:scale-105"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <p className="text-xl text-white/90 mb-6">
                    Discover thousands of remote creative positions from leading companies
                  </p>
                  <button className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
                    Explore Job Opportunities
                  </button>
                </div>

                <div className="border-t border-white/30 pt-6">
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id + '-' + cat.name}
                        href={`/jobs?categoryId=${cat.id}`}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-all hover:scale-105"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

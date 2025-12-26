'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IconSearch, IconCalendar, IconStar } from '../../components/ui';
import { VideoBackground } from '@/components/ui/VideoBackground';
import AnimatedButton from '../components/animated-button';
import Link from 'next/link';

const LandingPage = () => {
   const [showSplash, setShowSplash] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('talents');
  const [searchQuery, setSearchQuery] = useState('');

  const rotatingWords = [
    { line1: 'Creator-First', line2: 'Portfolio & Opportunity', line3: 'Platform' },
    { line1: 'Design-Driven', line2: 'Careers &', line3: 'Collaboration' },
    { line1: 'Built for Creators', line2: 'Jobs, Gigs, &', line3: 'Growth' },
    { line1: 'Empowering', line2: 'Designers &', line3: 'Developers' }
  ];

  const categories = [
    'Development & IT',
    'Design & Creative',
    'UI/UX Design',
    'Video & Animation',
    '3D Modeling',
    'Branding & Identity'
  ];

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
          <div className="text-center animate-pulse">
          <IconStar className="w-20 h-20 text-white mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white">Loading Experience...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <VideoBackground />
      {/* Header */}
      <header className="relative z-20 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo-reverse-designer.png"
            alt="Designer Marketplace"
            width={160}
            height={36}
            className="object-contain"
          />
        </div>
        <nav className="flex items-center space-x-8 text-white">
          <Link href="/jobs" className="hover:text-pink-300 transition-colors">Jobs</Link>
          <Link href="/courses" className="hover:text-pink-300 transition-colors">Courses</Link>
          <button onClick={() => {}} className="text-2xl hover:scale-110 transition-transform">🌙</button>
          <Link href="/auth/login" className="hover:text-pink-300 transition-colors">Login</Link>
             <Link href="/get-started">
            <AnimatedButton variant="slim" className="bg-white text-black hover:bg-gray-100">
              <span className="flex items-center">
              Sign Up
              </span>
            </AnimatedButton>
            </Link>
        </nav>
      </header>

     {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-end px-8 pt-12">
        {/* Hero Section */}
        <div className="text-left mb-8 w-full max-w-5xl">
          <div className="relative h-64 flex flex-col items-start justify-end overflow-visible">
            
            {/* First line */}
            <h2 
              key={`word-${currentWordIndex}`}
              className="text-5xl font-bold text-white relative z-10 mb-2"
            >
              {rotatingWords[currentWordIndex].line1}
            </h2>

            {/* Second line */}
            <h2 
              key={`line2-${currentWordIndex}`}
              className="text-5xl font-bold text-white relative z-10 mb-2"
            >
              {rotatingWords[currentWordIndex].line2}
            </h2>

            {/* Third line */}
            <h2 
              key={`line3-${currentWordIndex}`}
              className="text-5xl font-bold text-white relative z-10 mb-4"
            >
              {rotatingWords[currentWordIndex].line3}
            </h2>
          </div>

          <h4 className="text-xl text-white/90 font-light mb-6">
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
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href="#"
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-all hover:scale-105"
                      >
                        {category}
                      </a>
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
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href="#"
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-all hover:scale-105"
                      >
                        {category}
                      </a>
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

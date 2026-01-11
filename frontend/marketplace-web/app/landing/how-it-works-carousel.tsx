"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const HowItWorksCarousel = () => {
  // `currentIndex` represents the index of the centered card (position 1)
  const [currentIndex, setCurrentIndex] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Post Your Project",
      description: "Companies post their design needs with detailed requirements and budget",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 15L25 10C25 7.23858 27.2386 5 30 5L50 5C52.7614 5 55 7.23858 55 10L55 15" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="15" y="15" width="50" height="55" rx="4" stroke="#1F2937" strokeWidth="2.5"/>
          <circle cx="40" cy="42" r="12" stroke="#EF4444" strokeWidth="2.5"/>
          <path d="M40 36V42L44 46" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="25" y1="58" x2="55" y2="58" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Browse & Discover",
      description: "Talented designers explore projects that match their expertise and interests",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="18" stroke="#1F2937" strokeWidth="2.5"/>
          <path d="M45 45L58 58" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M28 26L32 30L38 22" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="60" r="8" fill="#EF4444" opacity="0.2"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Submit Proposal",
      description: "Designers craft compelling proposals showcasing their approach and timeline",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 25L40 10L60 25V60C60 62.7614 57.7614 65 55 65H25C22.2386 65 20 62.7614 20 60V25Z" stroke="#1F2937" strokeWidth="2.5"/>
          <rect x="30" y="35" width="20" height="3" fill="#EF4444"/>
          <rect x="30" y="43" width="20" height="2" fill="#1F2937"/>
          <rect x="30" y="49" width="15" height="2" fill="#1F2937"/>
          <circle cx="55" cy="25" r="8" stroke="#EF4444" strokeWidth="2.5" fill="white"/>
          <path d="M51 25L54 28L60 22" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Review & Accept",
      description: "Companies evaluate proposals and select the perfect designer for their project",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="20" width="50" height="45" rx="3" stroke="#1F2937" strokeWidth="2.5"/>
          <circle cx="30" cy="35" r="6" stroke="#1F2937" strokeWidth="2"/>
          <path d="M40 33H55" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          <path d="M40 38H52" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          <rect x="22" y="48" width="36" height="10" rx="2" fill="#EF4444" opacity="0.15"/>
          <path d="M30 53L34 57L42 49" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 5,
      title: "Set Milestones",
      description: "Break down the project into clear milestones with secure escrow funding",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 35L40 20L55 35" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 50L40 35L55 50" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 65L40 50L55 65" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="40" cy="35" r="4" fill="#EF4444"/>
          <rect x="35" y="58" width="10" height="10" rx="2" stroke="#EF4444" strokeWidth="2.5"/>
          <path d="M40 62V66" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 6,
      title: "Work & Track Time",
      description: "Designers work on the project while accurately logging hours for transparency",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="42" r="22" stroke="#1F2937" strokeWidth="2.5"/>
          <path d="M40 26V42L50 52" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="40" cy="42" r="3" fill="#EF4444"/>
          <rect x="32" y="10" width="16" height="8" rx="2" stroke="#1F2937" strokeWidth="2"/>
          <line x1="28" y1="42" x2="24" y2="42" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          <line x1="52" y1="42" x2="56" y2="42" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 7,
      title: "Submit Deliverables",
      description: "Designers upload completed work for each milestone, ready for company review",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 15V45M40 45L50 35M40 45L30 35" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 50V60C20 62.7614 22.2386 65 25 65H55C57.7614 65 60 62.7614 60 60V50" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="28" y="52" width="24" height="3" rx="1.5" fill="#1F2937"/>
          <rect x="32" y="58" width="16" height="2" rx="1" fill="#1F2937"/>
        </svg>
      )
    },
    {
      id: 8,
      title: "Review & Approve",
      description: "Companies review deliverables and approve work that meets their standards",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="15" width="44" height="50" rx="3" stroke="#1F2937" strokeWidth="2.5"/>
          <path d="M30 32L36 38L50 24" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="28" y1="48" x2="52" y2="48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          <line x1="28" y1="54" x2="46" y2="54" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="55" cy="55" r="10" fill="#EF4444" opacity="0.15"/>
          <path d="M50 55L53 58L60 51" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 9,
      title: "Release Payment",
      description: "Funds are instantly released from escrow to designer's account upon approval",
      icon: (
        <svg className="w-24 h-24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="18" stroke="#1F2937" strokeWidth="2.5"/>
          <text x="35" y="42" fontSize="20" fontWeight="bold" fill="#EF4444" textAnchor="middle">$</text>
          <path d="M48 48L65 65M65 65H55M65 65V55" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="65" cy="65" r="3" fill="#EF4444"/>
          <path d="M28 28L32 24M42 28L46 24" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const getVisibleCards = () => {
    // Show previous, current, next with positions 0,1,2 where position 1 is centered
    const cards = [];
    const prevIndex = (currentIndex - 1 + steps.length) % steps.length;
    const nextIndex = (currentIndex + 1) % steps.length;
    cards.push({ ...steps[prevIndex], position: 0 });
    cards.push({ ...steps[currentIndex], position: 1 });
    cards.push({ ...steps[nextIndex], position: 2 });
    return cards;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-normal text-gray-900 mb-6 tracking-tight">How It Works</h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From project posting to payment — a seamless journey for companies and designers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center gap-6">
          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-gray-200 hover:border-red-200 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7 text-gray-700 group-hover:text-red-500 transition-colors" strokeWidth={2.5} />
          </button>

          {/* Cards Container */}
          <div className="flex-1 overflow-hidden px-4">
            <div className="flex gap-8 justify-center items-center">
              {getVisibleCards().map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 max-w-md transition-all duration-700 ease-out ${
                    step.position === 1 
                      ? 'scale-110 z-10' 
                      : 'scale-90 opacity-40 blur-[2px]'
                  }`}
                >
                  <div className={`bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col items-center text-center group ${
                    step.position === 1 ? 'hover:scale-105' : ''
                  }`}>
                    {/* Step Number */}
                    <div className="text-sm font-bold text-red-500 mb-6 tracking-wider">
                      STEP {step.id}
                    </div>

                    {/* Icon - No background wrapper */}
                    <div className="mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-gray-200 hover:border-red-200 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7 text-gray-700 group-hover:text-red-500 transition-colors" strokeWidth={2.5} />
          </button>
        </div>

        {/* Enhanced Dots Indicator with step numbers */}
        <div className="flex justify-center items-center gap-3 mt-16">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                idx === currentIndex
                  ? 'bg-red-500 w-10 h-10 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            >
              {idx === currentIndex ? (
                <span className="text-white font-bold text-sm">{idx + 1}</span>
              ) : (
                // show small dot but still keep the element size consistent
                <span className="sr-only">Step {idx + 1}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksCarousel;
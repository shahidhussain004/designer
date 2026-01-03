'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { CoursesSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCourses } from '@/hooks/useCourses';
import type { Course as CourseType } from '@/lib/courses';
import {
  COURSE_CATEGORIES,
  SKILL_LEVELS,
} from '@/lib/courses';
import { formatCurrency } from '@/lib/payments';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

// Course type from API
type Course = CourseType & { duration?: number; enrollmentCount?: number };

export default function CoursesPage() {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  const filters = useMemo(() => ({
    category: selectedCategory || undefined,
    skillLevel: selectedSkillLevel || undefined,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    search: searchQuery || undefined,
    page,
    size: pageSize,
    sortBy,
  }), [selectedCategory, selectedSkillLevel, priceRange, sortBy, page, searchQuery]);

  const { data, isLoading, error, refetch } = useCourses(filters);
  
  const courses = (data?.courses || []) as Course[];
  const totalCount = data?.totalCount || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSkillLevel('');
    setPriceRange({});
    setSortBy('popular');
    setPage(0);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const hasActiveFilters = selectedCategory || selectedSkillLevel || priceRange.min || priceRange.max;

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Expand Your Design Skills
            </h1>
            <p className="text-xl text-gray-300">
              Learn from industry leaders and master in-demand creative disciplines
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-input-focus"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters & Sort Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
                className="hidden lg:block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-white"
              >
                <option value="">All Categories</option>
                {COURSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Skill Level Filter */}
              <select
                value={selectedSkillLevel}
                onChange={(e) => { setSelectedSkillLevel(e.target.value); setPage(0); }}
                className="hidden lg:block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-white"
              >
                <option value="">All Levels</option>
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">
                {totalCount} course{totalCount !== 1 ? 's' : ''}
              </span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-white"
              >
                <option value="">All Categories</option>
                {COURSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedSkillLevel}
                onChange={(e) => { setSelectedSkillLevel(e.target.value); setPage(0); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus bg-white"
              >
                <option value="">All Levels</option>
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Course Grid */}
      <section className="bg-gray-50 py-8 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && <CoursesSkeleton />}

          {/* Error State */}
          {error && <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load courses'} retry={refetch} />}

          {/* Course Grid */}
          {!isLoading && !error && (
            <>
              {courses.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} getSkillLevelColor={getSkillLevelColor} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="text-gray-600">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="text-5xl mb-6">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

// Course Card Component
interface CourseCardProps {
  course: Course;
  getSkillLevelColor: (level: string) => string;
}

function CourseCard({ course, getSkillLevelColor }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-4xl">🎬</span>
            </div>
          )}
          {/* Skill Level Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(course.skillLevel)}`}>
              {course.skillLevel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="text-primary-600 text-sm font-medium mb-1">
            {course.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-gray-500 mb-4">
            by {course.instructorName}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-gray-900">
                {typeof course.rating === 'number' && isFinite(course.rating) ? course.rating.toFixed(1) : '—'}
              </span>
            </div>
            <span>•</span>
            <span>{(course.durationMinutes ?? course.duration ?? 0)} min</span>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(course.price, course.currency)}
            </span>
            <span className="text-sm text-gray-500">
              {typeof course.enrollmentCount === 'number' ? course.enrollmentCount.toLocaleString() : '0'} enrolled
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

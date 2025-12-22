'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getCourses, 
  Course, 
  COURSE_CATEGORIES, 
  SKILL_LEVELS 
} from '@/lib/courses';
import { formatCurrency } from '@/lib/payments';
import { authService } from '@/lib/auth';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCourses({
        category: selectedCategory || undefined,
        skillLevel: selectedSkillLevel || undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        search: searchQuery || undefined,
        page,
        size: pageSize,
        sortBy,
      });
      setCourses(result.courses);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSkillLevel, priceRange, sortBy, page, searchQuery, pageSize]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchCourses();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Designer Marketplace
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
                <Link href="/courses" className="text-primary-600 font-medium">Courses</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {authService.isAuthenticated() ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">My Account</Link>
                  <button
                    onClick={() => {
                      authService.logout();
                      router.push('/');
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Learn New Skills</h1>
          <p className="text-xl opacity-90 mb-6">
            Explore courses taught by industry experts and level up your career
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex max-w-2xl">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-900 hover:bg-primary-950 rounded-r-lg transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(0);
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {COURSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Skill Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Skill Level</h4>
                <div className="space-y-2">
                  {SKILL_LEVELS.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="skillLevel"
                        value={level}
                        checked={selectedSkillLevel === level}
                        onChange={(e) => {
                          setSelectedSkillLevel(e.target.value);
                          setPage(0);
                        }}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      {level}
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="skillLevel"
                      value=""
                      checked={selectedSkillLevel === ''}
                      onChange={() => {
                        setSelectedSkillLevel('');
                        setPage(0);
                      }}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    All Levels
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min || ''}
                    onChange={(e) => {
                      setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) * 100 : undefined });
                      setPage(0);
                    }}
                    className="w-1/2 p-2 border rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max || ''}
                    onChange={(e) => {
                      setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) * 100 : undefined });
                      setPage(0);
                    }}
                    className="w-1/2 p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {totalCount} course{totalCount !== 1 ? 's' : ''} found
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                className="p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Course Grid */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Empty State */}
                {courses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-200 relative">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${getSkillLevelColor(course.skillLevel)}`}>
            {course.skillLevel}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-sm text-primary-600 font-medium mb-1">{course.category}</p>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-2">by {course.instructorName}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="flex items-center mr-4">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {course.rating.toFixed(1)} ({course.reviewsCount})
            </span>
            <span className="mr-4">{course.lessonsCount} lessons</span>
            <span>{Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(course.price, course.currency)}
            </span>
            <span className="text-sm text-gray-500">
              {course.enrollmentsCount.toLocaleString()} enrolled
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

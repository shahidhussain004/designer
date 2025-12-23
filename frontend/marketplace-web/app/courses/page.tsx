'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GdsGrid,
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsBadge,
  GdsSpinner,
  GdsDivider,
} from '@/components/green';
import { PageLayout } from '@/components/layout';
import {
  getCourses,
  Course,
  COURSE_CATEGORIES,
  SKILL_LEVELS,
} from '@/lib/courses';
import { formatCurrency } from '@/lib/payments';

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

  const getSkillLevelVariant = (level: string): 'positive' | 'notice' | 'negative' | 'information' => {
    switch (level) {
      case 'Beginner':
        return 'positive';
      case 'Intermediate':
        return 'notice';
      case 'Advanced':
        return 'negative';
      default:
        return 'information';
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <GdsFlex
        flex-direction="column"
        gap="m"
        padding="xl"
        style={{
          background: 'linear-gradient(135deg, var(--gds-color-l3-background-positive) 0%, var(--gds-color-l3-background-primary) 100%)',
        } as any}
      >
        <GdsText tag="h1" font-size="heading-xl">
          Learn New Skills
        </GdsText>
        <GdsText font-size="body-l">
          Explore courses taught by industry experts and level up your career
        </GdsText>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <GdsFlex gap="m" align-items="flex-end" style={{ maxWidth: '600px' } as any}>
            <GdsFlex flex="1">
              <GdsInput
                label="Search Courses"
                value={searchQuery}
                onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
              />
            </GdsFlex>
            <GdsButton type="submit">Search</GdsButton>
          </GdsFlex>
        </form>
      </GdsFlex>

      <GdsFlex padding="l">
        <GdsGrid columns="1; m{4}" gap="l" style={{ width: '100%' } as any}>
          {/* Filters Sidebar */}
          <GdsCard padding="l">
            <GdsFlex flex-direction="column" gap="m">
              <GdsFlex justify-content="space-between" align-items="center">
                <GdsText tag="h3" font-size="heading-s">
                  Filters
                </GdsText>
                <GdsButton rank="tertiary" onClick={handleClearFilters}>
                  Clear all
                </GdsButton>
              </GdsFlex>

              <GdsDivider />

              {/* Category Filter */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Category
                </GdsText>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(0);
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    backgroundColor: 'var(--gds-color-l3-background-primary)',
                    color: 'var(--gds-color-l3-content-primary)',
                    fontSize: '0.875rem',
                    width: '100%',
                  } as any}
                >
                  <option value="">All Categories</option>
                  {COURSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </GdsFlex>

              {/* Skill Level Filter */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Skill Level
                </GdsText>
                <GdsFlex flex-direction="column" gap="xs">
                  {SKILL_LEVELS.map((level) => (
                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } as any}>
                      <input
                        type="radio"
                        name="skillLevel"
                        value={level}
                        checked={selectedSkillLevel === level}
                        onChange={(e) => {
                          setSelectedSkillLevel(e.target.value);
                          setPage(0);
                        }}
                      />
                      <GdsText font-size="body-s">{level}</GdsText>
                    </label>
                  ))}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } as any}>
                    <input
                      type="radio"
                      name="skillLevel"
                      value=""
                      checked={selectedSkillLevel === ''}
                      onChange={() => {
                        setSelectedSkillLevel('');
                        setPage(0);
                      }}
                    />
                    <GdsText font-size="body-s">All Levels</GdsText>
                  </label>
                </GdsFlex>
              </GdsFlex>

              {/* Price Range */}
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font-size="body-s" font-weight="book">
                  Price Range
                </GdsText>
                <GdsFlex gap="s">
                  <GdsInput
                    label="Min"
                    type="number"
                    value={priceRange.min?.toString() || ''}
                    onInput={(e: Event) => {
                      const value = (e.target as HTMLInputElement).value;
                      setPriceRange({ ...priceRange, min: value ? Number(value) * 100 : undefined });
                      setPage(0);
                    }}
                  />
                  <GdsInput
                    label="Max"
                    type="number"
                    value={priceRange.max?.toString() || ''}
                    onInput={(e: Event) => {
                      const value = (e.target as HTMLInputElement).value;
                      setPriceRange({ ...priceRange, max: value ? Number(value) * 100 : undefined });
                      setPage(0);
                    }}
                  />
                </GdsFlex>
              </GdsFlex>
            </GdsFlex>
          </GdsCard>

          {/* Main Content */}
          <GdsFlex flex-direction="column" gap="m" style={{ gridColumn: 'span 3' } as any}>
            {/* Sort and Results Count */}
            <GdsFlex justify-content="space-between" align-items="center">
              <GdsText color="secondary">
                {totalCount} course{totalCount !== 1 ? 's' : ''} found
              </GdsText>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--gds-color-l3-border-primary)',
                  backgroundColor: 'var(--gds-color-l3-background-primary)',
                  color: 'var(--gds-color-l3-content-primary)',
                } as any}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </GdsFlex>

            {/* Loading State */}
            {loading && (
              <GdsFlex justify-content="center" padding="xl">
                <GdsSpinner />
              </GdsFlex>
            )}

            {/* Error State */}
            {error && (
              <GdsCard padding="l" variant="negative">
                <GdsText color="negative">{error}</GdsText>
              </GdsCard>
            )}

            {/* Course Grid */}
            {!loading && !error && (
              <>
                <GdsGrid columns="1; m{2}; l{3}" gap="m">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} getSkillLevelVariant={getSkillLevelVariant} />
                  ))}
                </GdsGrid>

                {/* Empty State */}
                {courses.length === 0 && (
                  <GdsCard padding="xl">
                    <GdsFlex flex-direction="column" align-items="center" gap="m">
                      <GdsText font-size="heading-m">📚</GdsText>
                      <GdsText font-size="heading-s">No courses found</GdsText>
                      <GdsText color="secondary">Try adjusting your filters or search terms</GdsText>
                      <GdsButton rank="secondary" onClick={handleClearFilters}>
                        Clear Filters
                      </GdsButton>
                    </GdsFlex>
                  </GdsCard>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <GdsFlex justify-content="center" align-items="center" gap="m" padding="m">
                    <GdsButton
                      rank="secondary"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </GdsButton>
                    <GdsText>
                      Page {page + 1} of {totalPages}
                    </GdsText>
                    <GdsButton
                      rank="secondary"
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </GdsButton>
                  </GdsFlex>
                )}
              </>
            )}
          </GdsFlex>
        </GdsGrid>
      </GdsFlex>
    </PageLayout>
  );
}

// Course Card Component
interface CourseCardProps {
  course: Course;
  getSkillLevelVariant: (level: string) => 'positive' | 'notice' | 'negative' | 'information';
}

function CourseCard({ course, getSkillLevelVariant }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none' } as any}>
      <GdsCard padding="0" style={{ height: '100%', overflow: 'hidden', cursor: 'pointer' } as any}>
        {/* Thumbnail */}
        <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: 'var(--gds-color-l3-background-secondary)' } as any}>
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              style={{ objectFit: 'cover' } as any}
            />
          ) : (
            <GdsFlex justify-content="center" align-items="center" style={{ width: '100%', height: '100%' } as any}>
              <GdsText font-size="heading-l" color="secondary">🎬</GdsText>
            </GdsFlex>
          )}
          <div style={{ position: 'absolute', top: '8px', left: '8px' } as any}>
            <GdsBadge variant={getSkillLevelVariant(course.skillLevel)}>
              {course.skillLevel}
            </GdsBadge>
          </div>
        </div>

        {/* Content */}
        <GdsFlex flex-direction="column" gap="s" padding="m">
          <GdsText font-size="body-s" color="positive">
            {course.category}
          </GdsText>
          <GdsText tag="h3" font-size="body-l" font-weight="book">
            {course.title}
          </GdsText>
          <GdsText font-size="body-s" color="secondary">
            by {course.instructorName}
          </GdsText>

          {/* Stats */}
          <GdsFlex gap="m" align-items="center">
            <GdsText font-size="body-s" color="secondary">
              ⭐ {course.rating.toFixed(1)} ({course.reviewsCount})
            </GdsText>
            <GdsText font-size="body-s" color="secondary">
              {course.lessonsCount} lessons
            </GdsText>
            <GdsText font-size="body-s" color="secondary">
              {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
            </GdsText>
          </GdsFlex>

          <GdsDivider />

          {/* Price */}
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsText font-size="heading-s" font-weight="book">
              {formatCurrency(course.price, course.currency)}
            </GdsText>
            <GdsText font-size="body-s" color="secondary">
              {course.enrollmentsCount.toLocaleString()} enrolled
            </GdsText>
          </GdsFlex>
        </GdsFlex>
      </GdsCard>
    </Link>
  );
}

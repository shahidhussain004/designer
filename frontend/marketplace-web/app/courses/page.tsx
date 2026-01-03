'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Input,
  Text,
} from '@/components/green';
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
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Flex flex-direction="column" gap="m" padding="xl" max-width="1400px" margin="0 auto">
          <Text tag="h1" font-size="heading-xl" color="white">
            Expand Your Design Skills
          </Text>
          <Text font-size="body-l" color="white" style={{ opacity: 0.95 }}>
            Learn from industry leaders and master in-demand design disciplines
          </Text>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearch} style={{ marginTop: '12px' }}>
            <Flex gap="s" align-items="stretch" flex-direction="row; s{column}">
              <Flex flex="1">
                <Input
                  label="Search Courses"
                  value={searchQuery}
                  onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
                  style={{ background: 'white' }}
                />
              </Flex>
              <Button type="submit" rank="primary">Search</Button>
            </Flex>
          </form>
        </Flex>
      </div>

      {/* Main Content */}
      <Flex padding="xl" max-width="1400px" margin="0 auto">
        <Flex flex-direction="row; s{column}" gap="xl" flex="1">
          {/* Filters Sidebar */}
          <div style={{ flex: '0 0 280px' }}>
            <Card padding="l" style={{ position: 'sticky', top: '24px' }}>
              <Flex flex-direction="column" gap="m">
                <Flex justify-content="space-between" align-items="center">
                  <Text tag="h3" font-size="heading-s">Filters</Text>
                  <Button rank="tertiary" size="small" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </Flex>

                <Divider style={{ margin: '0' }} />

                {/* Category Filter */}
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" font-weight="book">Category</Text>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(0);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">All Categories</option>
                    {COURSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Flex>

                <Divider style={{ margin: '0' }} />

                {/* Skill Level Filter */}
                <Flex flex-direction="column" gap="m">
                  <Text font-size="body-s" font-weight="book">Skill Level</Text>
                  <Flex flex-direction="column" gap="s">
                    {SKILL_LEVELS.map((level) => (
                      <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
                        <Text font-size="body-s">{level}</Text>
                      </label>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
                      <Text font-size="body-s">All Levels</Text>
                    </label>
                  </Flex>
                </Flex>

                <Divider style={{ margin: '0' }} />

                {/* Price Range */}
                <Flex flex-direction="column" gap="m">
                  <Text font-size="body-s" font-weight="book">Price Range</Text>
                  <Flex flex-direction="column" gap="s">
                    <Input
                      label="Min ($)"
                      type="number"
                      value={priceRange.min?.toString() || ''}
                      onInput={(e: Event) => {
                        const value = (e.target as HTMLInputElement).value;
                        setPriceRange({ ...priceRange, min: value ? Number(value) * 100 : undefined });
                        setPage(0);
                      }}
                    />
                    <Input
                      label="Max ($)"
                      type="number"
                      value={priceRange.max?.toString() || ''}
                      onInput={(e: Event) => {
                        const value = (e.target as HTMLInputElement).value;
                        setPriceRange({ ...priceRange, max: value ? Number(value) * 100 : undefined });
                        setPage(0);
                      }}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </div>

          {/* Main Content Area */}
          <Flex flex-direction="column" gap="m" flex="1">
            {/* Results Header */}
            <Flex justify-content="space-between" align-items="center" padding="m" style={{ background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
              <Text font-size="body-m" font-weight="book">
                {totalCount} course{totalCount !== 1 ? 's' : ''} found
              </Text>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </Flex>

            {/* Loading State */}
            {isLoading && <CoursesSkeleton />}

            {/* Error State */}
            {error && <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load courses'} retry={refetch} />}

            {/* Course Grid */}
            {!isLoading && !error && (
              <>
                {courses.length > 0 ? (
                  <>
                    <Grid columns="1; m{2}; l{3}" gap="l">
                      {courses.map((course) => (
                        <CourseCard key={course.id} course={course} getSkillLevelVariant={getSkillLevelVariant} />
                      ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Flex justify-content="center" align-items="center" gap="m" padding="xl">
                        <Button
                          rank="secondary"
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                        >
                          ← Previous
                        </Button>
                        <Text font-size="body-m" font-weight="book">
                          Page {page + 1} of {totalPages}
                        </Text>
                        <Button
                          rank="secondary"
                          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                          disabled={page >= totalPages - 1}
                        >
                          Next →
                        </Button>
                      </Flex>
                    )}
                  </>
                ) : (
                  <Card padding="xl" style={{ textAlign: 'center' }}>
                    <Flex flex-direction="column" align-items="center" gap="m">
                      <Text font-size="heading-xl">📚</Text>
                      <Text font-size="heading-m">No courses found</Text>
                      <Text color="secondary">Try adjusting your filters or search terms</Text>
                      <Button rank="secondary" onClick={handleClearFilters}>
                        Clear All Filters
                      </Button>
                    </Flex>
                  </Card>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
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
    <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <Card padding="0" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease', cursor: 'pointer' }} 
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-base)'; }}>
        
        {/* Thumbnail Container */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: 'var(--color-background-secondary)', overflow: 'hidden' }}>
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
            />
          ) : (
            <Flex justify-content="center" align-items="center" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Text font-size="heading-l" color="secondary">🎬</Text>
            </Flex>
          )}
          {/* Skill Level Badge Overlay */}
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <Badge variant={getSkillLevelVariant(course.skillLevel)}>
              {course.skillLevel}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <Flex flex-direction="column" gap="s" padding="m" flex="1">
          {/* Category */}
          <Text font-size="body-xs" font-weight="book" color="positive">
            {course.category}
          </Text>

          {/* Title */}
          <Text tag="h3" font-size="body-m" font-weight="book" style={{ lineHeight: '1.4', minHeight: '44px' }}>
            {course.title}
          </Text>

          {/* Instructor */}
          <Text font-size="body-xs" color="secondary">
            by {course.instructorName}
          </Text>

          {/* Divider */}
          <Divider style={{ margin: '8px 0' }} />

          {/* Stats Row */}
          <Flex gap="m" align-items="center" flex-wrap="wrap">
            <Flex align-items="center" gap="xs">
              <Text font-size="body-xs">⭐</Text>
              <Text font-size="body-xs" font-weight="book">
                {typeof course.rating === 'number' && isFinite(course.rating) ? course.rating.toFixed(1) : '—'}
              </Text>
            </Flex>
            <Text font-size="body-xs" color="secondary">•</Text>
              <Text font-size="body-xs" color="secondary">
              {(course.durationMinutes ?? course.duration ?? 0)} min duration
            </Text>
          </Flex>

          {/* Divider */}
          <Divider style={{ margin: '8px 0' }} />

          {/* Footer with Price and Enrollments */}
          <Flex justify-content="space-between" align-items="center" style={{ marginTop: 'auto' }}>
            <Text font-size="body-m" font-weight="book">
              {formatCurrency(course.price, course.currency)}
            </Text>
            <Text font-size="body-xs" color="secondary">
              {typeof course.enrollmentCount === 'number' ? course.enrollmentCount.toLocaleString() : '0'} enrolled
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}

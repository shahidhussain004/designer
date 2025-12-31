'use client';

import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Input,
    Spinner,
    Text,
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import {
    Course,
    COURSE_CATEGORIES,
    getCourses,
    SKILL_LEVELS,
} from '@/lib/courses';
import { formatCurrency } from '@/lib/payments';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

export default function CoursesPage() {
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
      <Flex
        flex-direction="column"
        gap="m"
        padding="xl"
      >
        <Text tag="h1" font-size="heading-xl">
          Learn New Skills
        </Text>
        <Text font-size="body-l">
          Explore courses taught by industry experts and level up your career
        </Text>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <Flex gap="m" align-items="flex-end">
            <Flex flex="1">
              <Input
                label="Search Courses"
                value={searchQuery}
                onInput={(e: Event) => setSearchQuery((e.target as HTMLInputElement).value)}
              />
            </Flex>
            <Button type="submit">Search</Button>
          </Flex>
        </form>
      </Flex>

      <Flex padding="l">
        <Grid columns="1; m{4}" gap="l">
          {/* Filters Sidebar */}
          <Card padding="l">
            <Flex flex-direction="column" gap="m">
              <Flex justify-content="space-between" align-items="center">
                <Text tag="h3" font-size="heading-s">
                  Filters
                </Text>
                <Button rank="tertiary" onClick={handleClearFilters}>
                  Clear all
                </Button>
              </Flex>

              <Divider />

              {/* Category Filter */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Category
                </Text>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(0);
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

              {/* Skill Level Filter */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Skill Level
                </Text>
                <Flex flex-direction="column" gap="xs">
                  {SKILL_LEVELS.map((level) => (
                    <label key={level}>
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
                  <label>
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

              {/* Price Range */}
              <Flex flex-direction="column" gap="xs">
                <Text font-size="body-s" font-weight="book">
                  Price Range
                </Text>
                <Flex gap="s">
                  <Input
                    label="Min"
                    type="number"
                    value={priceRange.min?.toString() || ''}
                    onInput={(e: Event) => {
                      const value = (e.target as HTMLInputElement).value;
                      setPriceRange({ ...priceRange, min: value ? Number(value) * 100 : undefined });
                      setPage(0);
                    }}
                  />
                  <Input
                    label="Max"
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

          {/* Main Content */}
          <Flex flex-direction="column" gap="m">
            {/* Sort and Results Count */}
            <Flex justify-content="space-between" align-items="center">
              <Text color="secondary">
                {totalCount} course{totalCount !== 1 ? 's' : ''} found
              </Text>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
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
            {loading && (
              <Flex justify-content="center" padding="xl">
                <Spinner />
              </Flex>
            )}

            {/* Error State */}
            {error && (
              <Card padding="l" variant="negative">
                <Text color="negative">{error}</Text>
              </Card>
            )}

            {/* Course Grid */}
            {!loading && !error && (
              <>
                <Grid columns="1; m{2}; l{3}" gap="m">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} getSkillLevelVariant={getSkillLevelVariant} />
                  ))}
                </Grid>

                {/* Empty State */}
                {courses.length === 0 && (
                  <Card padding="xl">
                    <Flex flex-direction="column" align-items="center" gap="m">
                      <Text font-size="heading-m">📚</Text>
                      <Text font-size="heading-s">No courses found</Text>
                      <Text color="secondary">Try adjusting your filters or search terms</Text>
                      <Button rank="secondary" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    </Flex>
                  </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Flex justify-content="center" align-items="center" gap="m" padding="m">
                    <Button
                      rank="secondary"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {page + 1} of {totalPages}
                    </Text>
                    <Button
                      rank="secondary"
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Grid>
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
    <Link href={`/courses/${course.id}`}>
      <Card padding="0">
        {/* Thumbnail */}
        <div>
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
            />
          ) : (
            <Flex justify-content="center" align-items="center">
              <Text font-size="heading-l" color="secondary">🎬</Text>
            </Flex>
          )}
          <div>
            <Badge variant={getSkillLevelVariant(course.skillLevel)}>
              {course.skillLevel}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <Flex flex-direction="column" gap="s" padding="m">
          <Text font-size="body-s" color="positive">
            {course.category}
          </Text>
          <Text tag="h3" font-size="body-l" font-weight="book">
            {course.title}
          </Text>
          <Text font-size="body-s" color="secondary">
            by {course.instructorName}
          </Text>

          {/* Stats */}
          <Flex gap="m" align-items="center">
            <Text font-size="body-s" color="secondary">
              ⭐ {course.rating.toFixed(1)} ({course.reviewsCount})
            </Text>
            <Text font-size="body-s" color="secondary">
              {course.lessonsCount} lessons
            </Text>
            <Text font-size="body-s" color="secondary">
              {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
            </Text>
          </Flex>

          <Divider />

          {/* Price */}
          <Flex justify-content="space-between" align-items="center">
            <Text font-size="heading-s" font-weight="book">
              {formatCurrency(course.price, course.currency)}
            </Text>
            <Text font-size="body-s" color="secondary">
              {course.enrollmentsCount.toLocaleString()} enrolled
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}

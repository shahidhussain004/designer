'use client';

import {
  Badge,
  Button,
  Card,
  Div,
  Divider,
  Flex,
  Grid,
  Spinner,
  Text,
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { authService } from '@/lib/auth';
import {
  Course,
  enrollInCourse,
  getCourseById,
  getCourseLessons,
  Lesson
} from '@/lib/courses';
import { createCourseCheckoutSession, formatCurrency } from '@/lib/payments';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showAllLessons, setShowAllLessons] = useState(false);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const [courseData, lessonsData] = await Promise.all([
        getCourseById(courseId),
        getCourseLessons(courseId),
      ]);
      setCourse(courseData);
      setLessons(lessonsData);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, fetchCourseData]);

  const handleEnroll = async () => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/login?redirect=/courses/${courseId}`);
      return;
    }

    try {
      setIsEnrolling(true);
      
      if (course && course.price > 0) {
        const session = await createCourseCheckoutSession(
          courseId,
          `${window.location.origin}/courses/${courseId}/success`,
          `${window.location.origin}/courses/${courseId}`
        );
        window.location.href = session.url;
      } else {
        await enrollInCourse(courseId);
        router.push(`/courses/${courseId}/learn`);
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      setError(err instanceof Error ? err.message : 'Failed to enroll');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Flex justify-content="center" align-items="center">
        <Spinner />
      </Flex>
    );
  }

  if (error || !course) {
    return (
      <Flex justify-content="center" align-items="center" flex-direction="column" gap="l">
        <Text>😕</Text>
        <Text tag="h2">Course Not Found</Text>
        <Text>
          {error || 'This course does not exist'}
        </Text>
        <Link href="/courses">
          ← Back to Courses
        </Link>
      </Flex>
    );
  }

  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 5);
  const totalHours = Math.floor(course.durationMinutes / 60);
  const totalMinutes = course.durationMinutes % 60;

  return (
    <PageLayout>
      <Div>
        {/* Hero Section with Course Header */}
        <Div style={{ background: 'var(--color-background-secondary)', borderBottom: '1px solid var(--color-border)' }}>
          <Flex flex-direction="column" gap="m" padding="xl" max-width="1400px" margin="0 auto">
            {/* Breadcrumb */}
            <Flex align-items="center" gap="s" color="secondary">
              <Link href="/courses">
                <Text font-size="body-xs">Courses</Text>
              </Link>
              <Text font-size="body-xs">/</Text>
              <Text font-size="body-xs" font-weight="book">{course.category}</Text>
            </Flex>

            {/* Title and Description */}
            <Text tag="h1" font-size="heading-xl">{course.title}</Text>
            <Text font-size="body-l" color="secondary">{course.description}</Text>

            {/* Key Stats Bar */}
            <Flex gap="l" align-items="center" flex-wrap="wrap" style={{ marginTop: '12px' }}>
              <Flex align-items="center" gap="xs">
                <Text font-size="body-m">★</Text>
                <Text font-size="body-m" font-weight="book">
                  {typeof course.rating === 'number' && isFinite(course.rating) ? course.rating.toFixed(1) : '—'}
                </Text>
                <Text font-size="body-s" color="secondary">
                  ({typeof course.reviewsCount === 'number' ? course.reviewsCount : 0} reviews)
                </Text>
              </Flex>
              <Text font-size="body-s" color="secondary">•</Text>
              <Text font-size="body-s" color="secondary">
                {typeof course.enrollmentsCount === 'number' ? course.enrollmentsCount.toLocaleString() : '0'} students enrolled
              </Text>
              <Text font-size="body-s" color="secondary">•</Text>
              <Text font-size="body-s" font-weight="book">{course.skillLevel}</Text>
            </Flex>

            {/* Instructor and Date */}
            <Flex gap="l" flex-wrap="wrap" style={{ marginTop: '8px' }}>
              <Text font-size="body-s">Taught by <span style={{ fontWeight: '600' }}>{course.instructorName}</span></Text>
              <Text font-size="body-s" color="secondary">Updated {new Date(course.updatedAt).toLocaleDateString()}</Text>
            </Flex>
          </Flex>
        </Div>

        {/* Main Content Grid - Responsive Layout */}
        <Flex flex-direction="column; l{row}" gap="xl" padding="xl" max-width="1400px" margin="0 auto">
        {/* Left Column - Course Content */}
        <Flex flex-direction="column" gap="xl" flex="1 1 65%">
          {/* What You'll Learn Section */}
          {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
            <Card padding="xl">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">What You will Learn</Text>
                <Divider style={{ margin: '0' }} />
                <Grid columns="1; m{2}" gap="l">
                  {course.learningOutcomes.map((outcome, index) => (
                    <Flex key={index} align-items="flex-start" gap="m">
                      <Text font-size="heading-s" color="positive" style={{ marginTop: '2px' }}>✓</Text>
                      <Text font-size="body-m">{outcome}</Text>
                    </Flex>
                  ))}
                </Grid>
              </Flex>
            </Card>
          )}

          {/* Course Content / Lessons Section */}
          <Card padding="xl">
            <Flex flex-direction="column" gap="m">
              <Text tag="h2" font-size="heading-m">Course Content</Text>
              <Text font-size="body-s" color="secondary">
                {Array.isArray(lessons) ? lessons.length : 0} lessons • {totalHours}h {totalMinutes}m total
              </Text>
              <Divider style={{ margin: '0' }} />

              <Flex flex-direction="column">
                {displayedLessons.map((lesson, index) => (
                  <Div key={lesson.id}>
                    {index > 0 && <Divider />}
                    <Flex justify-content="space-between" align-items="center" padding="m">
                      <Flex align-items="flex-start" gap="m" flex="1">
                        <Text font-size="body-m" font-weight="book" color="secondary" style={{ minWidth: '32px' }}>
                          {index + 1}
                        </Text>
                        <Div flex="1">
                          <Text font-size="body-m" font-weight="book">{lesson.title}</Text>
                          <Flex align-items="center" gap="s" style={{ marginTop: '6px' }}>
                            <Text font-size="body-s" color="secondary">
                              {lesson.contentType === 'Video' && '🎬'}
                              {lesson.contentType === 'Quiz' && '❓'}
                              {lesson.contentType === 'Text' && '📄'}
                            </Text>
                            <Text font-size="body-s" color="secondary">{lesson.durationMinutes} min</Text>
                            {lesson.isPreview && (
                              <Badge variant="information">Preview</Badge>
                            )}
                          </Flex>
                        </Div>
                      </Flex>
                      {lesson.isPreview && (
                        <Button size="small" rank="tertiary" style={{ marginLeft: 'auto' }}>Preview</Button>
                      )}
                    </Flex>
                  </Div>
                ))}
              </Flex>

              {Array.isArray(lessons) && lessons.length > 5 && !showAllLessons && (
                <Button
                  rank="tertiary"
                  onClick={() => setShowAllLessons(true)}
                  style={{ marginTop: '12px', alignSelf: 'flex-start' }}
                >
                  Show all {lessons.length} lessons
                </Button>
              )}
            </Flex>
          </Card>

          {/* Requirements Section */}
          {Array.isArray(course.requirements) && course.requirements.length > 0 && (
            <Card padding="xl">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">Prerequisites & Requirements</Text>
                <Divider style={{ margin: '0' }} />
                <Flex flex-direction="column" gap="s">
                  {course.requirements.map((req, index) => (
                    <Flex key={index} align-items="flex-start" gap="m">
                      <Text font-size="heading-s" color="secondary">•</Text>
                      <Text font-size="body-m">{req}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Card>
          )}

          {/* Tags Section */}
          {Array.isArray(course.tags) && course.tags.length > 0 && (
            <Card padding="xl">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">Skills You will Master</Text>
                <Divider style={{ margin: '0' }} />
                <Flex gap="s" flex-wrap="wrap">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="information">{tag}</Badge>
                  ))}
                </Flex>
              </Flex>
            </Card>
          )}
        </Flex>

        {/* Right Column - Sticky Enrollment Card (Desktop) */}
        <Div flex="1 1 35%" style={{ position: 'relative' }}>
          <Div style={{ position: 'sticky', top: '24px' }}>
            <Card padding="xl">
              <Flex flex-direction="column" gap="m">
                {/* Course Thumbnail */}
                <Div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: 'var(--color-background-secondary)' }}>
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      style={{ objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
                    />
                  ) : (
                    <Flex justify-content="center" align-items="center" height="100%">
                      <Text font-size="heading-xl" color="secondary">🎬</Text>
                    </Flex>
                  )}
                </Div>

                {/* Price */}
                <Flex justify-content="space-between" align-items="baseline">
                  <Text tag="h3" font-size="heading-l" font-weight="book">
                    {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                  </Text>
                  {course.price === 0 && <Badge variant="positive">Complimentary</Badge>}
                </Flex>

                {/* CTA Button */}
                <Button
                  rank="primary"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  style={{ width: '100%', padding: '12px 16px', fontSize: '16px', fontWeight: '600' }}
                >
                  {isEnrolling ? 'Processing...' : course.price > 0 ? 'Enroll Now' : 'Enroll for Free'}
                </Button>

                {/* Money Back Guarantee */}
                {course.price > 0 && (
                  <Flex align-items="center" gap="s" padding="m" style={{ background: 'var(--color-background-secondary)', borderRadius: '6px' }}>
                    <Text font-size="heading-m">✓</Text>
                    <Text font-size="body-xs" color="secondary">30-Day Money-Back Guarantee</Text>
                  </Flex>
                )}

                <Divider />

                {/* Course Details List */}
                <Flex flex-direction="column" gap="m">
                  <Flex align-items="center" gap="m">
                    <Text font-size="heading-m">⏱️</Text>
                    <Flex flex-direction="column">
                      <Text font-size="body-xs" color="secondary">Total Duration</Text>
                      <Text font-size="body-m" font-weight="book">{totalHours}h {totalMinutes}m</Text>
                    </Flex>
                  </Flex>

                  <Flex align-items="center" gap="m">
                    <Text font-size="heading-m">📄</Text>
                    <Flex flex-direction="column">
                      <Text font-size="body-xs" color="secondary">Lessons</Text>
                      <Text font-size="body-m" font-weight="book">{course.lessonsCount} lessons</Text>
                    </Flex>
                  </Flex>

                  <Flex align-items="center" gap="m">
                    <Text font-size="heading-m">🌟</Text>
                    <Flex flex-direction="column">
                      <Text font-size="body-xs" color="secondary">Certificate</Text>
                      <Text font-size="body-m" font-weight="book">Completion Certificate</Text>
                    </Flex>
                  </Flex>

                  <Flex align-items="center" gap="m">
                    <Text font-size="heading-m">🌐</Text>
                    <Flex flex-direction="column">
                      <Text font-size="body-xs" color="secondary">Access</Text>
                      <Text font-size="body-m" font-weight="book">Lifetime Access</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Div>
        </Div>
      </Flex>
    </Div>
  </PageLayout>
  );
}

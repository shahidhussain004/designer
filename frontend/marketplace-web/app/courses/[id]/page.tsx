'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getCourseById, 
  getCourseLessons, 
  enrollInCourse,
  Course, 
  Lesson 
} from '@/lib/courses';
import { formatCurrency, createCourseCheckoutSession } from '@/lib/payments';
import { authService } from '@/lib/auth';
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Div,
  Divider,
  Badge,
  Spinner,
} from '@/components/green';

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
    <Div>
      {/* Navigation */}
      <Div>
        <Flex justify-content="space-between" align-items="center" padding="m">
          <Flex align-items="center" gap="xl">
            <Link href="/" style={{ textDecoration: 'none' } as any}>
              <Text style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' } as any}>
                Designer Marketplace
              </Text>
            </Link>
            <Flex gap="l" className="desktop-nav">
              <Link href="/jobs" style={{ textDecoration: 'none', color: '#6b7280' } as any}>Jobs</Link>
              <Link href="/courses" style={{ textDecoration: 'none', color: '#16a34a', fontWeight: 500 } as any}>Courses</Link>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: '#6b7280' } as any}>Dashboard</Link>
            </Flex>
          </Flex>
        </Flex>
      </Div>

      {/* Course Header */}
      <Div>
        <Flex flex-direction="column; l{row}" gap="xl">
          {/* Course Info */}
          <Flex flex-direction="column" gap="m" style={{ flex: 1 } as any}>
            {/* Breadcrumb */}
            <Flex align-items="center" gap="s">
              <Link href="/courses" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' } as any}>
                Courses
              </Link>
              <Text style={{ color: '#6b7280' } as any}>/</Text>
              <Text style={{ color: '#d1d5db', fontSize: '0.875rem' } as any}>{course.category}</Text>
            </Flex>

            <Text tag="h1" style={{ fontSize: '2rem', fontWeight: 700 } as any}>{course.title}</Text>
            <Text style={{ fontSize: '1.125rem', color: '#d1d5db' } as any}>{course.description}</Text>

            {/* Stats */}
            <Flex gap="m" align-items="center" flex-wrap="wrap" style={{ fontSize: '0.875rem' } as any}>
              <Flex align-items="center" gap="xs">
                <Text style={{ color: '#fbbf24' } as any}>★</Text>
                <Text style={{ fontWeight: 600 } as any}>{course.rating.toFixed(1)}</Text>
                <Text style={{ color: '#9ca3af' } as any}>({course.reviewsCount} reviews)</Text>
              </Flex>
              <Text style={{ color: '#6b7280' } as any}>|</Text>
              <Text>{course.enrollmentsCount.toLocaleString()} students</Text>
              <Text style={{ color: '#6b7280' } as any}>|</Text>
              <Text>{course.skillLevel}</Text>
            </Flex>

            <Text style={{ fontSize: '0.875rem', color: '#d1d5db' } as any}>
              Created by <span style={{ color: '#16a34a', fontWeight: 500 } as any}>{course.instructorName}</span>
            </Text>
            <Text style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>
              Last updated: {new Date(course.updatedAt).toLocaleDateString()}
            </Text>
          </Flex>

          {/* Enrollment Card */}
          <Div style={{ width: '100%', maxWidth: '384px' } as any}>
            <Card style={{ overflow: 'hidden' } as any}>
              {/* Course Thumbnail */}
              <Div style={{ aspectRatio: '16/9', background: '#f3f4f6', position: 'relative' } as any}>
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' } as any}
                  />
                ) : (
                  <Flex justify-content="center" align-items="center" style={{ width: '100%', height: '100%' } as any}>
                    <Text style={{ fontSize: '3rem', color: '#9ca3af' } as any}>🎬</Text>
                  </Flex>
                )}
              </Div>

              <Flex flex-direction="column" gap="m" padding="l">
                <Text style={{ fontSize: '2rem', fontWeight: 700 } as any}>
                  {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                </Text>

                <Button
                  rank="primary"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  style={{ width: '100%' } as any}
                >
                  {isEnrolling ? 'Processing...' : course.price > 0 ? 'Buy Now' : 'Enroll for Free'}
                </Button>

                <Text style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' } as any}>
                  30-Day Money-Back Guarantee
                </Text>

                <Flex flex-direction="column" gap="s" style={{ marginTop: '0.5rem' } as any}>
                  <Flex align-items="center" gap="m">
                    <Text>⏱️</Text>
                    <Text style={{ fontSize: '0.875rem' } as any}>{totalHours}h {totalMinutes}m total length</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>📄</Text>
                    <Text style={{ fontSize: '0.875rem' } as any}>{course.lessonsCount} lessons</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>🏆</Text>
                    <Text style={{ fontSize: '0.875rem' } as any}>Certificate of completion</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>🌐</Text>
                    <Text style={{ fontSize: '0.875rem' } as any}>Full lifetime access</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Div>
        </Flex>
      </Div>

      {/* Course Content */}
      <Flex flex-direction="column" gap="l" padding="xl">
        {/* What You'll Learn */}
        {course.learningOutcomes.length > 0 && (
          <Card>
            <Flex flex-direction="column" gap="m" padding="l">
              <Text tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>What You&apos;ll Learn</Text>
              <Grid columns="1; m{2}" gap="m">
                {course.learningOutcomes.map((outcome, index) => (
                  <Flex key={index} align-items="flex-start" gap="s">
                    <Text style={{ color: '#16a34a' } as any}>✓</Text>
                    <Text style={{ color: '#6b7280' } as any}>{outcome}</Text>
                  </Flex>
                ))}
              </Grid>
            </Flex>
          </Card>
        )}

        {/* Requirements */}
        {course.requirements.length > 0 && (
          <Div>
            <Text tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' } as any}>Requirements</Text>
            <Flex flex-direction="column" gap="s">
              {course.requirements.map((req, index) => (
                <Flex key={index} align-items="flex-start" gap="s">
                  <Text style={{ color: '#9ca3af' } as any}>•</Text>
                  <Text style={{ color: '#6b7280' } as any}>{req}</Text>
                </Flex>
              ))}
            </Flex>
          </Div>
        )}

        {/* Course Content / Lessons */}
        <Card>
          <Flex flex-direction="column" padding="l">
            <Flex justify-content="space-between" align-items="center" style={{ marginBottom: '1rem' } as any}>
              <Text tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>Course Content</Text>
              <Text style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>
                {lessons.length} lessons • {totalHours}h {totalMinutes}m
              </Text>
            </Flex>

            <Flex flex-direction="column">
              {displayedLessons.map((lesson, index) => (
                <Div key={lesson.id}>
                  {index > 0 && <Divider />}
                  <Flex justify-content="space-between" align-items="center" padding="m">
                    <Flex align-items="center" gap="m">
                      <Div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        } as any}
                      >
                        {index + 1}
                      </Div>
                      <Div>
                        <Text style={{ fontWeight: 500 } as any}>{lesson.title}</Text>
                        <Flex align-items="center" gap="s" style={{ marginTop: '0.25rem' } as any}>
                          <Text style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>
                            {lesson.contentType === 'Video' && '🎬'}
                            {lesson.contentType === 'Quiz' && '❓'}
                            {lesson.contentType === 'Text' && '📄'}
                            {' '}{lesson.durationMinutes} min
                          </Text>
                          {lesson.isPreview && (
                            <Badge variant="information">Preview</Badge>
                          )}
                        </Flex>
                      </Div>
                    </Flex>
                    {lesson.isPreview && (
                      <Button size="small" rank="tertiary">Preview</Button>
                    )}
                  </Flex>
                </Div>
              ))}
            </Flex>

            {lessons.length > 5 && !showAllLessons && (
              <Button
                rank="tertiary"
                onClick={() => setShowAllLessons(true)}
                style={{ marginTop: '1rem' } as any}
              >
                Show all {lessons.length} lessons
              </Button>
            )}
          </Flex>
        </Card>

        {/* Tags */}
        {course.tags.length > 0 && (
          <Div>
            <Text tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' } as any}>Tags</Text>
            <Flex gap="s" flex-wrap="wrap">
              {course.tags.map((tag, index) => (
                <Badge key={index} variant="information">{tag}</Badge>
              ))}
            </Flex>
          </Div>
        )}
      </Flex>
    </Div>
  );
}

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
  GdsCard,
  GdsFlex,
  GdsGrid,
  GdsText,
  GdsButton,
  GdsDiv,
  GdsDivider,
  GdsBadge,
  GdsSpinner,
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
      <GdsFlex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <GdsSpinner />
      </GdsFlex>
    );
  }

  if (error || !course) {
    return (
      <GdsFlex justify-content="center" align-items="center" flex-direction="column" gap="l" style={{ minHeight: '100vh' } as any}>
        <GdsText style={{ fontSize: '4rem' } as any}>😕</GdsText>
        <GdsText tag="h2" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>Course Not Found</GdsText>
        <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
          {error || 'This course does not exist'}
        </GdsText>
        <Link href="/courses" style={{ color: 'var(--gds-color-l3-content-positive)' } as any}>
          ← Back to Courses
        </Link>
      </GdsFlex>
    );
  }

  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 5);
  const totalHours = Math.floor(course.durationMinutes / 60);
  const totalMinutes = course.durationMinutes % 60;

  return (
    <GdsDiv style={{ minHeight: '100vh', background: 'var(--gds-color-l3-background-secondary)' } as any}>
      {/* Navigation */}
      <GdsDiv style={{ background: 'var(--gds-color-l3-background-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 } as any}>
        <GdsFlex justify-content="space-between" align-items="center" padding="m" style={{ maxWidth: '1280px', margin: '0 auto' } as any}>
          <GdsFlex align-items="center" gap="xl">
            <Link href="/" style={{ textDecoration: 'none' } as any}>
              <GdsText style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gds-color-l3-content-positive)' } as any}>
                Designer Marketplace
              </GdsText>
            </Link>
            <GdsFlex gap="l" className="desktop-nav">
              <Link href="/jobs" style={{ textDecoration: 'none', color: 'var(--gds-color-l3-content-secondary)' } as any}>Jobs</Link>
              <Link href="/courses" style={{ textDecoration: 'none', color: 'var(--gds-color-l3-content-positive)', fontWeight: 500 } as any}>Courses</Link>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--gds-color-l3-content-secondary)' } as any}>Dashboard</Link>
            </GdsFlex>
          </GdsFlex>
        </GdsFlex>
      </GdsDiv>

      {/* Course Header */}
      <GdsDiv style={{ background: 'linear-gradient(to right, #1f2937, #111827)', color: 'white', padding: '3rem 0' } as any}>
        <GdsFlex flex-direction="column; l{row}" gap="xl" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' } as any}>
          {/* Course Info */}
          <GdsFlex flex-direction="column" gap="m" style={{ flex: 1 } as any}>
            {/* Breadcrumb */}
            <GdsFlex align-items="center" gap="s">
              <Link href="/courses" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' } as any}>
                Courses
              </Link>
              <GdsText style={{ color: '#6b7280' } as any}>/</GdsText>
              <GdsText style={{ color: '#d1d5db', fontSize: '0.875rem' } as any}>{course.category}</GdsText>
            </GdsFlex>

            <GdsText tag="h1" style={{ fontSize: '2rem', fontWeight: 700 } as any}>{course.title}</GdsText>
            <GdsText style={{ fontSize: '1.125rem', color: '#d1d5db' } as any}>{course.description}</GdsText>

            {/* Stats */}
            <GdsFlex gap="m" align-items="center" flex-wrap="wrap" style={{ fontSize: '0.875rem' } as any}>
              <GdsFlex align-items="center" gap="xs">
                <GdsText style={{ color: '#fbbf24' } as any}>★</GdsText>
                <GdsText style={{ fontWeight: 600 } as any}>{course.rating.toFixed(1)}</GdsText>
                <GdsText style={{ color: '#9ca3af' } as any}>({course.reviewsCount} reviews)</GdsText>
              </GdsFlex>
              <GdsText style={{ color: '#6b7280' } as any}>|</GdsText>
              <GdsText>{course.enrollmentsCount.toLocaleString()} students</GdsText>
              <GdsText style={{ color: '#6b7280' } as any}>|</GdsText>
              <GdsText>{course.skillLevel}</GdsText>
            </GdsFlex>

            <GdsText style={{ fontSize: '0.875rem', color: '#d1d5db' } as any}>
              Created by <span style={{ color: 'var(--gds-color-l3-content-positive)', fontWeight: 500 } as any}>{course.instructorName}</span>
            </GdsText>
            <GdsText style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>
              Last updated: {new Date(course.updatedAt).toLocaleDateString()}
            </GdsText>
          </GdsFlex>

          {/* Enrollment Card */}
          <GdsDiv style={{ width: '100%', maxWidth: '384px' } as any}>
            <GdsCard style={{ overflow: 'hidden' } as any}>
              {/* Course Thumbnail */}
              <GdsDiv style={{ aspectRatio: '16/9', background: 'var(--gds-color-l3-background-secondary)', position: 'relative' } as any}>
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' } as any}
                  />
                ) : (
                  <GdsFlex justify-content="center" align-items="center" style={{ width: '100%', height: '100%' } as any}>
                    <GdsText style={{ fontSize: '3rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>🎬</GdsText>
                  </GdsFlex>
                )}
              </GdsDiv>

              <GdsFlex flex-direction="column" gap="m" padding="l">
                <GdsText style={{ fontSize: '2rem', fontWeight: 700 } as any}>
                  {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                </GdsText>

                <GdsButton
                  rank="primary"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  style={{ width: '100%' } as any}
                >
                  {isEnrolling ? 'Processing...' : course.price > 0 ? 'Buy Now' : 'Enroll for Free'}
                </GdsButton>

                <GdsText style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                  30-Day Money-Back Guarantee
                </GdsText>

                <GdsFlex flex-direction="column" gap="s" style={{ marginTop: '0.5rem' } as any}>
                  <GdsFlex align-items="center" gap="m">
                    <GdsText>⏱️</GdsText>
                    <GdsText style={{ fontSize: '0.875rem' } as any}>{totalHours}h {totalMinutes}m total length</GdsText>
                  </GdsFlex>
                  <GdsFlex align-items="center" gap="m">
                    <GdsText>📄</GdsText>
                    <GdsText style={{ fontSize: '0.875rem' } as any}>{course.lessonsCount} lessons</GdsText>
                  </GdsFlex>
                  <GdsFlex align-items="center" gap="m">
                    <GdsText>🏆</GdsText>
                    <GdsText style={{ fontSize: '0.875rem' } as any}>Certificate of completion</GdsText>
                  </GdsFlex>
                  <GdsFlex align-items="center" gap="m">
                    <GdsText>🌐</GdsText>
                    <GdsText style={{ fontSize: '0.875rem' } as any}>Full lifetime access</GdsText>
                  </GdsFlex>
                </GdsFlex>
              </GdsFlex>
            </GdsCard>
          </GdsDiv>
        </GdsFlex>
      </GdsDiv>

      {/* Course Content */}
      <GdsFlex flex-direction="column" gap="l" padding="xl" style={{ maxWidth: '900px', margin: '0 auto' } as any}>
        {/* What You'll Learn */}
        {course.learningOutcomes.length > 0 && (
          <GdsCard>
            <GdsFlex flex-direction="column" gap="m" padding="l">
              <GdsText tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>What You&apos;ll Learn</GdsText>
              <GdsGrid columns="1; m{2}" gap="m">
                {course.learningOutcomes.map((outcome, index) => (
                  <GdsFlex key={index} align-items="flex-start" gap="s">
                    <GdsText style={{ color: 'var(--gds-color-l3-content-positive)' } as any}>✓</GdsText>
                    <GdsText style={{ color: 'var(--gds-color-l3-content-secondary)' } as any}>{outcome}</GdsText>
                  </GdsFlex>
                ))}
              </GdsGrid>
            </GdsFlex>
          </GdsCard>
        )}

        {/* Requirements */}
        {course.requirements.length > 0 && (
          <GdsDiv>
            <GdsText tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' } as any}>Requirements</GdsText>
            <GdsFlex flex-direction="column" gap="s">
              {course.requirements.map((req, index) => (
                <GdsFlex key={index} align-items="flex-start" gap="s">
                  <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>•</GdsText>
                  <GdsText style={{ color: 'var(--gds-color-l3-content-secondary)' } as any}>{req}</GdsText>
                </GdsFlex>
              ))}
            </GdsFlex>
          </GdsDiv>
        )}

        {/* Course Content / Lessons */}
        <GdsCard>
          <GdsFlex flex-direction="column" padding="l">
            <GdsFlex justify-content="space-between" align-items="center" style={{ marginBottom: '1rem' } as any}>
              <GdsText tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700 } as any}>Course Content</GdsText>
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                {lessons.length} lessons • {totalHours}h {totalMinutes}m
              </GdsText>
            </GdsFlex>

            <GdsFlex flex-direction="column">
              {displayedLessons.map((lesson, index) => (
                <GdsDiv key={lesson.id}>
                  {index > 0 && <GdsDivider />}
                  <GdsFlex justify-content="space-between" align-items="center" padding="m">
                    <GdsFlex align-items="center" gap="m">
                      <GdsDiv
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--gds-color-l3-background-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        } as any}
                      >
                        {index + 1}
                      </GdsDiv>
                      <GdsDiv>
                        <GdsText style={{ fontWeight: 500 } as any}>{lesson.title}</GdsText>
                        <GdsFlex align-items="center" gap="s" style={{ marginTop: '0.25rem' } as any}>
                          <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                            {lesson.contentType === 'Video' && '🎬'}
                            {lesson.contentType === 'Quiz' && '❓'}
                            {lesson.contentType === 'Text' && '📄'}
                            {' '}{lesson.durationMinutes} min
                          </GdsText>
                          {lesson.isPreview && (
                            <GdsBadge variant="information">Preview</GdsBadge>
                          )}
                        </GdsFlex>
                      </GdsDiv>
                    </GdsFlex>
                    {lesson.isPreview && (
                      <GdsButton size="small" rank="tertiary">Preview</GdsButton>
                    )}
                  </GdsFlex>
                </GdsDiv>
              ))}
            </GdsFlex>

            {lessons.length > 5 && !showAllLessons && (
              <GdsButton
                rank="tertiary"
                onClick={() => setShowAllLessons(true)}
                style={{ marginTop: '1rem' } as any}
              >
                Show all {lessons.length} lessons
              </GdsButton>
            )}
          </GdsFlex>
        </GdsCard>

        {/* Tags */}
        {course.tags.length > 0 && (
          <GdsDiv>
            <GdsText tag="h2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' } as any}>Tags</GdsText>
            <GdsFlex gap="s" flex-wrap="wrap">
              {course.tags.map((tag, index) => (
                <GdsBadge key={index} variant="information">{tag}</GdsBadge>
              ))}
            </GdsFlex>
          </GdsDiv>
        )}
      </GdsFlex>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </GdsDiv>
  );
}

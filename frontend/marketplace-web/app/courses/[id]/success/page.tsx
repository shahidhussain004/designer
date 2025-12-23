'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCourseById, Course } from '@/lib/courses';
import {
  GdsCard,
  GdsFlex,
  GdsText,
  GdsButton,
  GdsDiv,
  GdsSpinner,
} from '@/components/green';

export default function CourseEnrollmentSuccessPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    try {
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  if (loading) {
    return (
      <GdsFlex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <GdsSpinner />
      </GdsFlex>
    );
  }

  return (
    <GdsDiv style={{ minHeight: '100vh', background: 'var(--gds-color-l3-background-secondary)' } as any}>
      <GdsFlex justify-content="center" align-items="center" padding="xl" style={{ minHeight: '100vh' } as any}>
        <GdsDiv style={{ maxWidth: '400px', width: '100%' } as any}>
          <GdsCard>
            <GdsFlex flex-direction="column" align-items="center" gap="l" padding="xl">
              {/* Success Icon */}
              <GdsDiv
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--gds-color-l3-background-positive-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <GdsText style={{ fontSize: '2.5rem', color: 'var(--gds-color-l3-content-positive)' } as any}>✓</GdsText>
              </GdsDiv>

              <GdsText tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' } as any}>
                Enrollment Successful!
              </GdsText>
              
              <GdsText style={{ textAlign: 'center', color: 'var(--gds-color-l3-content-secondary)' } as any}>
                {course ? (
                  <>You&apos;re now enrolled in <strong>{course.title}</strong>. Start learning right away!</>
                ) : (
                  <>Your enrollment has been confirmed. Start learning right away!</>
                )}
              </GdsText>

              {/* Course Preview */}
              {course && (
                <GdsCard style={{ width: '100%', background: 'var(--gds-color-l3-background-secondary)' } as any}>
                  <GdsFlex align-items="center" gap="m" padding="m">
                    <GdsDiv
                      style={{
                        width: '64px',
                        height: '48px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: 'var(--gds-color-l3-background-tertiary)',
                        flexShrink: 0,
                        position: 'relative',
                      } as any}
                    >
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          fill
                          style={{ objectFit: 'cover' } as any}
                        />
                      ) : (
                        <GdsFlex justify-content="center" align-items="center" style={{ width: '100%', height: '100%' } as any}>
                          <GdsText>🎬</GdsText>
                        </GdsFlex>
                      )}
                    </GdsDiv>
                    <GdsDiv style={{ overflow: 'hidden' } as any}>
                      <GdsText style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as any}>
                        {course.title}
                      </GdsText>
                      <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                        {course.lessonsCount} lessons
                      </GdsText>
                    </GdsDiv>
                  </GdsFlex>
                </GdsCard>
              )}

              {/* Actions */}
              <GdsFlex flex-direction="column" gap="m" style={{ width: '100%' } as any}>
                <Link href={`/courses/${courseId}/learn`} style={{ textDecoration: 'none' } as any}>
                  <GdsButton rank="primary" style={{ width: '100%' } as any}>
                    Start Learning
                  </GdsButton>
                </Link>
                
                <Link href="/dashboard" style={{ textDecoration: 'none' } as any}>
                  <GdsButton rank="secondary" style={{ width: '100%' } as any}>
                    Go to Dashboard
                  </GdsButton>
                </Link>
              </GdsFlex>

              {/* Receipt Info */}
              <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)', textAlign: 'center' } as any}>
                A receipt has been sent to your email address.
              </GdsText>
            </GdsFlex>
          </GdsCard>

          {/* Help Link */}
          <GdsText style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)', marginTop: '1rem' } as any}>
            Having trouble?{' '}
            <Link href="/support" style={{ color: 'var(--gds-color-l3-content-positive)' } as any}>
              Contact Support
            </Link>
          </GdsText>
        </GdsDiv>
      </GdsFlex>
    </GdsDiv>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCourseById, Course } from '@/lib/courses';
import {
  Card,
  Flex,
  Text,
  Button,
  Div,
  Spinner,
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
      <Flex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Div style={{ minHeight: '100vh', background: '#f3f4f6' } as any}>
      <Flex justify-content="center" align-items="center" padding="xl" style={{ minHeight: '100vh' } as any}>
        <Div style={{ maxWidth: '400px', width: '100%' } as any}>
          <Card>
            <Flex flex-direction="column" align-items="center" gap="l" padding="xl">
              {/* Success Icon */}
              <Div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <Text style={{ fontSize: '2.5rem', color: '#16a34a' } as any}>✓</Text>
              </Div>

              <Text tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' } as any}>
                Enrollment Successful!
              </Text>
              
              <Text style={{ textAlign: 'center', color: '#6b7280' } as any}>
                {course ? (
                  <>You&apos;re now enrolled in <strong>{course.title}</strong>. Start learning right away!</>
                ) : (
                  <>Your enrollment has been confirmed. Start learning right away!</>
                )}
              </Text>

              {/* Course Preview */}
              {course && (
                <Card style={{ width: '100%', background: '#f3f4f6' } as any}>
                  <Flex align-items="center" gap="m" padding="m">
                    <Div
                      style={{
                        width: '64px',
                        height: '48px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: '#f9fafb',
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
                        <Flex justify-content="center" align-items="center" style={{ width: '100%', height: '100%' } as any}>
                          <Text>🎬</Text>
                        </Flex>
                      )}
                    </Div>
                    <Div style={{ overflow: 'hidden' } as any}>
                      <Text style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as any}>
                        {course.title}
                      </Text>
                      <Text style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>
                        {course.lessonsCount} lessons
                      </Text>
                    </Div>
                  </Flex>
                </Card>
              )}

              {/* Actions */}
              <Flex flex-direction="column" gap="m" style={{ width: '100%' } as any}>
                <Link href={`/courses/${courseId}/learn`} style={{ textDecoration: 'none' } as any}>
                  <Button rank="primary" style={{ width: '100%' } as any}>
                    Start Learning
                  </Button>
                </Link>
                
                <Link href="/dashboard" style={{ textDecoration: 'none' } as any}>
                  <Button rank="secondary" style={{ width: '100%' } as any}>
                    Go to Dashboard
                  </Button>
                </Link>
              </Flex>

              {/* Receipt Info */}
              <Text style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' } as any}>
                A receipt has been sent to your email address.
              </Text>
            </Flex>
          </Card>

          {/* Help Link */}
          <Text style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' } as any}>
            Having trouble?{' '}
            <Link href="/support" style={{ color: '#16a34a' } as any}>
              Contact Support
            </Link>
          </Text>
        </Div>
      </Flex>
    </Div>
  );
}

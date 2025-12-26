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
      <Flex justify-content="center" align-items="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Div>
      <Flex justify-content="center" align-items="center" padding="xl">
        <Div>
          <Card>
            <Flex flex-direction="column" align-items="center" gap="l" padding="xl">
              {/* Success Icon */}
              <Div>
                <Text>✓</Text>
              </Div>

              <Text tag="h1">
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
                <Card>
                  <Flex align-items="center" gap="m" padding="m">
                    <Div>
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
              <Flex flex-direction="column" gap="m">
                <Link href={`/courses/${courseId}/learn`}>
                  <Button rank="primary">
                    Start Learning
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button rank="secondary">
                    Go to Dashboard
                  </Button>
                </Link>
              </Flex>

              {/* Receipt Info */}
              <Text>
                A receipt has been sent to your email address.
              </Text>
            </Flex>
          </Card>

          {/* Help Link */}
          <Text>
            Having trouble?{' '}
            <Link href="/support">
              Contact Support
            </Link>
          </Text>
        </Div>
      </Flex>
    </Div>
  );
}

'use client';

import {
  Button,
  Card,
  Div,
  Flex,
  Spinner,
  Text,
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { Course, getCourseById } from '@/lib/courses';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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
    <PageLayout>
      <Div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <Flex flex-direction="column" align-items="center" gap="l" max-width="600px" padding="xl">
          {/* Success Icon */}
          <Div style={{ fontSize: '64px' }}>
            <Text font-size="heading-xl">✓</Text>
          </Div>

          {/* Success Title */}
          <Text tag="h1" font-size="heading-xl" style={{ textAlign: 'center' }}>
            Enrollment Successful!
          </Text>

          {/* Success Message */}
          <Text font-size="body-l" style={{ textAlign: 'center', lineHeight: '1.6' }}>
            {course ? (
              <>You&apos;re now enrolled in <strong style={{ fontWeight: '700' }}>{course.title}</strong>. Welcome to your learning journey!</>
            ) : (
              <>Your enrollment has been confirmed. Start learning right away!</>
            )}
          </Text>

          {/* Course Preview Card */}
          {course && (
            <Card padding="l" style={{ width: '100%', marginTop: '12px' }}>
              <Flex align-items="flex-start" gap="m">
                <Div style={{ borderRadius: '8px', overflow: 'hidden', width: '120px', height: '100px', background: 'var(--color-background-secondary)', flexShrink: 0 }}>
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Flex justify-content="center" align-items="center" height="100%">
                      <Text font-size="heading-m">🎬</Text>
                    </Flex>
                  )}
                </Div>
                <Flex flex-direction="column" gap="s" flex="1">
                  <Text font-weight="book" font-size="body-m">{course.title}</Text>
                  <Flex gap="s" flex-wrap="wrap">
                    <Flex align-items="center" gap="xs">
                      <Text font-size="body-xs">📄</Text>
                      <Text font-size="body-xs">{course.lessonsCount} lessons</Text>
                    </Flex>
                    <Flex align-items="center" gap="xs">
                      <Text font-size="body-xs">⏱️</Text>
                      <Text font-size="body-xs">{Math.floor(course.durationMinutes / 60)}h</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          )}

          {/* CTA Buttons */}
          <Flex flex-direction="column" gap="m" style={{ width: '100%', marginTop: '12px' }}>
            <Link href={`/courses/${courseId}/learn`} style={{ width: '100%' }}>
              <Button rank="primary" style={{ width: '100%', padding: '12px 16px', fontSize: '16px', fontWeight: '600' }}>
                Start Learning
              </Button>
            </Link>
            
            <Link href="/dashboard" style={{ width: '100%' }}>
              <Button rank="secondary" style={{ width: '100%', padding: '12px 16px', fontSize: '16px' }}>
                Go to Dashboard
              </Button>
            </Link>
          </Flex>

          {/* Confirmation Message */}
          <Flex flex-direction="column" align-items="center" gap="s" padding="m" style={{ background: 'var(--color-background-secondary)', borderRadius: '8px', width: '100%', marginTop: '12px' }}>
            <Text font-size="body-s" style={{ opacity: 0.9 }}>✓ Receipt sent to your email</Text>
            <Text font-size="body-xs" style={{ opacity: 0.8 }}>You can access your course anytime from your dashboard</Text>
          </Flex>
        </Flex>
      </Div>
    </PageLayout>
  );
}

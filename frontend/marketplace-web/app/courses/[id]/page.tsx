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
            <Link href="/">
              <Text>
                Designer Marketplace
              </Text>
            </Link>
            <Flex gap="l" className="desktop-nav">
              <Link href="/jobs">Jobs</Link>
              <Link href="/courses">Courses</Link>
              <Link href="/dashboard">Dashboard</Link>
            </Flex>
          </Flex>
        </Flex>
      </Div>

      {/* Course Header */}
      <Div>
        <Flex flex-direction="column; l{row}" gap="xl">
          {/* Course Info */}
          <Flex flex-direction="column" gap="m">
            {/* Breadcrumb */}
            <Flex align-items="center" gap="s">
              <Link href="/courses">
                Courses
              </Link>
              <Text>/</Text>
              <Text>{course.category}</Text>
            </Flex>

            <Text tag="h1">{course.title}</Text>
            <Text>{course.description}</Text>

            {/* Stats */}
            <Flex gap="m" align-items="center" flex-wrap="wrap">
              <Flex align-items="center" gap="xs">
                <Text>★</Text>
                <Text>{course.rating.toFixed(1)}</Text>
                <Text>({course.reviewsCount} reviews)</Text>
              </Flex>
              <Text>|</Text>
              <Text>{course.enrollmentsCount.toLocaleString()} students</Text>
              <Text>|</Text>
              <Text>{course.skillLevel}</Text>
            </Flex>

            <Text>
              Created by <span>{course.instructorName}</span>
            </Text>
            <Text>
              Last updated: {new Date(course.updatedAt).toLocaleDateString()}
            </Text>
          </Flex>

          {/* Enrollment Card */}
          <Div>
            <Card>
              {/* Course Thumbnail */}
              <Div>
                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                  />
                ) : (
                  <Flex justify-content="center" align-items="center">
                    <Text>🎬</Text>
                  </Flex>
                )}
              </Div>

              <Flex flex-direction="column" gap="m" padding="l">
                <Text>
                  {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                </Text>

                <Button
                  rank="primary"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? 'Processing...' : course.price > 0 ? 'Buy Now' : 'Enroll for Free'}
                </Button>

                <Text>
                  30-Day Money-Back Guarantee
                </Text>

                <Flex flex-direction="column" gap="s">
                  <Flex align-items="center" gap="m">
                    <Text>⏱️</Text>
                    <Text>{totalHours}h {totalMinutes}m total length</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>📄</Text>
                    <Text>{course.lessonsCount} lessons</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>🌟</Text>
                    <Text>Certificate of completion</Text>
                  </Flex>
                  <Flex align-items="center" gap="m">
                    <Text>🌐</Text>
                    <Text>Full lifetime access</Text>
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
              <Text tag="h2">What You&apos;ll Learn</Text>
              <Grid columns="1; m{2}" gap="m">
                {course.learningOutcomes.map((outcome, index) => (
                  <Flex key={index} align-items="flex-start" gap="s">
                    <Text>✓</Text>
                    <Text>{outcome}</Text>
                  </Flex>
                ))}
              </Grid>
            </Flex>
          </Card>
        )}

        {/* Requirements */}
        {course.requirements.length > 0 && (
          <Div>
            <Text tag="h2">Requirements</Text>
            <Flex flex-direction="column" gap="s">
              {course.requirements.map((req, index) => (
                <Flex key={index} align-items="flex-start" gap="s">
                  <Text>•</Text>
                  <Text>{req}</Text>
                </Flex>
              ))}
            </Flex>
          </Div>
        )}

        {/* Course Content / Lessons */}
        <Card>
          <Flex flex-direction="column" padding="l">
            <Flex justify-content="space-between" align-items="center">
              <Text tag="h2">Course Content</Text>
              <Text>
                {lessons.length} lessons • {totalHours}h {totalMinutes}m
              </Text>
            </Flex>

            <Flex flex-direction="column">
              {displayedLessons.map((lesson, index) => (
                <Div key={lesson.id}>
                  {index > 0 && <Divider />}
                  <Flex justify-content="space-between" align-items="center" padding="m">
                    <Flex align-items="center" gap="m">
                      <Div>
                        {index + 1}
                      </Div>
                      <Div>
                        <Text>{lesson.title}</Text>
                        <Flex align-items="center" gap="s">
                          <Text>
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
              >
                Show all {lessons.length} lessons
              </Button>
            )}
          </Flex>
        </Card>

        {/* Tags */}
        {course.tags.length > 0 && (
          <Div>
            <Text tag="h2">Tags</Text>
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

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
      
      // For paid courses, redirect to checkout
      if (course && course.price > 0) {
        const session = await createCourseCheckoutSession(
          courseId,
          `${window.location.origin}/courses/${courseId}/success`,
          `${window.location.origin}/courses/${courseId}`
        );
        window.location.href = session.url;
      } else {
        // Free course - direct enrollment
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This course does not exist'}</p>
          <Link href="/courses" className="text-primary-600 hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 5);
  const totalHours = Math.floor(course.durationMinutes / 60);
  const totalMinutes = course.durationMinutes % 60;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Designer Marketplace
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
                <Link href="/courses" className="text-primary-600 font-medium">Courses</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Link href="/courses" className="text-gray-300 hover:text-white text-sm">
                  Courses
                </Link>
                <span className="text-gray-500">/</span>
                <span className="text-gray-300 text-sm">{course.category}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">({course.reviewsCount} reviews)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span>{course.enrollmentsCount.toLocaleString()} students</span>
                <span className="text-gray-400">|</span>
                <span>{course.skillLevel}</span>
              </div>

              <p className="text-sm text-gray-300">
                Created by <span className="text-primary-400 font-medium">{course.instructorName}</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Last updated: {new Date(course.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Enrollment Card */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden text-gray-900">
                {/* Course Thumbnail */}
                <div className="aspect-video bg-gray-200 relative">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-3xl font-bold mb-4">
                    {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnrolling ? 'Processing...' : course.price > 0 ? 'Buy Now' : 'Enroll for Free'}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-3">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {totalHours}h {totalMinutes}m total length
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {course.lessonsCount} lessons
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Certificate of completion
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Full lifetime access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:w-2/3">
          {/* What You'll Learn */}
          {course.learningOutcomes.length > 0 && (
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">What You&apos;ll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {course.requirements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Course Content / Lessons */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Course Content</h2>
              <span className="text-sm text-gray-500">
                {lessons.length} lessons • {totalHours}h {totalMinutes}m
              </span>
            </div>

            <div className="divide-y">
              {displayedLessons.map((lesson, index) => (
                <div key={lesson.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        {lesson.contentType === 'Video' && (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {lesson.contentType === 'Quiz' && (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {lesson.contentType === 'Text' && (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        <span>{lesson.durationMinutes} min</span>
                        {lesson.isPreview && (
                          <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded">Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {lesson.isPreview && (
                    <button className="text-primary-600 text-sm font-medium hover:underline">
                      Preview
                    </button>
                  )}
                </div>
              ))}
            </div>

            {lessons.length > 5 && !showAllLessons && (
              <button
                onClick={() => setShowAllLessons(true)}
                className="w-full mt-4 py-2 text-primary-600 font-medium hover:underline"
              >
                Show all {lessons.length} lessons
              </button>
            )}
          </section>

          {/* Tags */}
          {course.tags.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { CoursesSkeleton } from '@/components/Skeletons';
import { useCourse, useCourseCurriculum, useEnrollCourse } from '@/hooks/useCourses';
import { authService } from '@/lib/auth';
import { createCourseCheckoutSession, formatCurrency } from '@/lib/payments';
import { ArrowLeft, Award, BookOpen, CheckCircle, Clock, Eye, Globe, PlayCircle, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [showAllLessons, setShowAllLessons] = useState(false);

  const { data: course, isLoading: courseLoading, error: courseError, refetch } = useCourse(courseId);
  const { data: lessonsData, isLoading: lessonsLoading } = useCourseCurriculum(courseId);
  const enrollMutation = useEnrollCourse();

  const lessons = lessonsData || [];
  const isLoading = courseLoading || lessonsLoading;
  const error = courseError;

  const handleEnroll = async () => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/login?redirect=/courses/${courseId}`);
      return;
    }

    try {
      if (course && course.price > 0) {
        const session = await createCourseCheckoutSession(
          courseId,
          `${window.location.origin}/courses/${courseId}/success`,
          `${window.location.origin}/courses/${courseId}`
        );
        window.location.href = session.url;
      } else {
        await enrollMutation.mutateAsync(Number(courseId));
        router.push(`/courses/${courseId}/learn`);
      }
    } catch (err) {
      console.error('Error enrolling:', err);
    }
  };

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <ErrorMessage message={error.message} retry={refetch} />
          ) : (
            <>
              <p className="text-6xl mb-4">😕</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-4">This course does not exist</p>
              <Link href="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
                ← Back to Courses
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 5);
  const totalHours = Math.floor(course.durationMinutes / 60);
  const totalMinutes = course.durationMinutes % 60;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/courses" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-300">{course.category}</span>
          </nav>

          {/* Title and Description */}
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl">{course.description}</p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">
                {typeof course.rating === 'number' && isFinite(course.rating) ? course.rating.toFixed(1) : '—'}
              </span>
              <span className="text-gray-400">
                ({typeof course.reviewsCount === 'number' ? course.reviewsCount : 0} reviews)
              </span>
            </div>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              {typeof course.enrollmentsCount === 'number' ? course.enrollmentsCount.toLocaleString() : '0'} students
            </div>
            <span className="text-gray-500">•</span>
            <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium">{course.skillLevel}</span>
          </div>

          {/* Instructor */}
          <div className="mt-4 text-sm text-gray-400">
            Taught by <span className="text-white font-medium">{course.instructorName}</span>
            <span className="mx-2">•</span>
            Updated {new Date(course.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You'll Learn */}
            {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                <span className="text-sm text-gray-500">
                  {Array.isArray(lessons) ? lessons.length : 0} lessons • {totalHours}h {totalMinutes}m
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {displayedLessons.map((lesson, index) => (
                  <div key={lesson.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-sm font-medium text-gray-400 w-8">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          {lesson.contentType === 'Video' && <PlayCircle className="w-4 h-4" />}
                          {lesson.contentType === 'Quiz' && <span>❓</span>}
                          {lesson.contentType === 'Text' && <BookOpen className="w-4 h-4" />}
                          <span>{lesson.durationMinutes} min</span>
                          {lesson.isPreview && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Preview</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {lesson.isPreview && (
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {Array.isArray(lessons) && lessons.length > 5 && !showAllLessons && (
                <button
                  onClick={() => setShowAllLessons(true)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Show all {lessons.length} lessons
                </button>
              )}
            </div>

            {/* Requirements */}
            {Array.isArray(course.requirements) && course.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites & Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {Array.isArray(course.tags) && course.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills You&apos;ll Master</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <PlayCircle className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Price */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}
                    </span>
                    {course.price === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Complimentary
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {enrollMutation.isPending ? 'Processing...' : course.price > 0 ? 'Enroll Now' : 'Enroll for Free'}
                  </button>

                  {/* Guarantee */}
                  {course.price > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      30-Day Money-Back Guarantee
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  {/* Course Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Total Duration</p>
                        <p className="font-medium text-gray-900">{totalHours}h {totalMinutes}m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Lessons</p>
                        <p className="font-medium text-gray-900">{course.lessonsCount} lessons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Certificate</p>
                        <p className="font-medium text-gray-900">Completion Certificate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Access</p>
                        <p className="font-medium text-gray-900">Lifetime Access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

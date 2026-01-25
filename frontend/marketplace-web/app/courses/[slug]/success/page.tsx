'use client';

import { PageLayout } from '@/components/ui';
import type { Course as CourseType } from '@/lib/courses';
import { ArrowRight, BookOpen, CheckCircle, Clock, Loader2, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Course extends CourseType {
  lessonsCount: number;
}

export default function CourseEnrollmentSuccessPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    try {
      // Import the function here to avoid circular dependency
      const { getCourseBySlug } = await import('@/lib/courses');
      const courseData = await getCourseBySlug(slug);
      setCourse(courseData as Course);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug, fetchCourse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Enrollment Successful!
            </h1>

            {/* Success Message */}
            <p className="text-gray-600 text-lg mb-6">
              {course ? (
                <>You&apos;re now enrolled in <span className="font-semibold text-gray-900">{course.title}</span>. Welcome to your learning journey!</>
              ) : (
                <>Your enrollment has been confirmed. Start learning right away!</>
              )}
            </p>

            {/* Course Preview Card */}
            {course && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessonsCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(course.durationMinutes / 60)}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link 
                href={`/courses/${slug}/learn`}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                href="/dashboard"
                className="flex items-center justify-center w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Confirmation Message */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Receipt sent to your email
              </div>
              <p className="text-xs text-gray-400 mt-2">
                You can access your course anytime from your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

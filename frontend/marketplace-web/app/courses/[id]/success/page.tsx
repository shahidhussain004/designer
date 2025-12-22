'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, Course } from '@/lib/courses';

export default function CourseEnrollmentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const sessionId = searchParams.get('session_id');

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enrollment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            {course ? (
              <>You&apos;re now enrolled in <strong>{course.title}</strong>. Start learning right away!</>
            ) : (
              <>Your enrollment has been confirmed. Start learning right away!</>
            )}
          </p>

          {/* Course Preview */}
          {course && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.lessonsCount} lessons</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/courses/${courseId}/learn`}
              className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Start Learning
            </Link>
            
            <Link
              href="/dashboard"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Receipt Info */}
          <p className="text-sm text-gray-500 mt-6">
            A receipt has been sent to your email address.
          </p>
        </div>

        {/* Help Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Having trouble? <Link href="/support" className="text-primary-600 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}

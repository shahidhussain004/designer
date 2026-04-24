'use client'

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { Course, deleteCourse, getInstructorCourses } from '@/lib/courses'
import { BookOpen, Edit, Loader2, Plus, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InstructorDashboardPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
      router.push('/dashboards')
      return
    }

    loadCourses()
  }, [router])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getInstructorCourses(0, 50)
      setCourses(result.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteCourse(courseId)
      await loadCourses()
    } catch {
      alert('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-secondary-500">Loading courses...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const draftCourses = courses.filter(c => c.isPublished === false)
  const publishedCourses = courses.filter(c => c.isPublished === true)

  return (
    <PageLayout>
      <div className="min-h-screen bg-secondary-50">
        {/* Header */}
        <div className="bg-secondary-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">My Courses</h1>
                <p className="text-secondary-400 mt-1">Manage your course content</p>
              </div>
              <Link
                href="/dashboard/instructor/courses/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create New Course
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-700">{error}</p>
            </div>
          )}

          {/* Published Courses */}
          {publishedCourses.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Published Courses ({publishedCourses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="h-40 bg-secondary-100 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-secondary-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-secondary-900 mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                          Published
                        </span>
                        <span className="flex items-center gap-1 text-sm text-secondary-500">
                          <Users className="w-4 h-4" />
                          {course.enrollmentsCount || 0} students
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/instructor/courses/${course.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-2 border border-error-200 text-error-600 rounded-lg hover:bg-error-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {publishedCourses.length > 0 && draftCourses.length > 0 && (
            <hr className="border-secondary-200 mb-10" />
          )}

          {/* Draft Courses */}
          {draftCourses.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Drafts ({draftCourses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="h-40 bg-secondary-100 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-secondary-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-secondary-900 mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                          Draft
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/instructor/courses/${course.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-2 border border-error-200 text-error-600 rounded-lg hover:bg-error-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Courses */}
          {courses.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-12 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-secondary-400" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-2">No courses yet</h2>
              <p className="text-secondary-500 mb-6">Start by creating your first course</p>
              <Link
                href="/dashboard/instructor/courses/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

'use client'

import { PageLayout, Tabs } from '@/components/ui'
import { authService } from '@/lib/auth'
import { Course, getInstructorCourseById, publishCourse, updateCourse } from '@/lib/courses'
import { ArrowLeft, ChevronDown, Loader2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: '',
    price: 0,
    thumbnailUrl: '',
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      router.push('/dashboards')
      return
    }

    loadCourse()
  }, [courseId, router])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const data = await getInstructorCourseById(courseId)
      setCourse(data)
      setFormData({
        title: data.title,
        description: data.description,
        shortDescription: data.description,
        category: data.category,
        level: data.skillLevel,
        price: data.price / 100,
        thumbnailUrl: data.thumbnailUrl || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      await updateCourse(courseId, formData)
      setError(null)
      // Success feedback would go here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm('Publish this course? It will become available for enrollment.')) return
    
    try {
      setSaving(true)
      await publishCourse(courseId)
      router.push('/dashboards/instructor')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish course')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading course...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!course) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 font-medium">Course not found</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/dashboards/instructor" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              {!course.isPublished && (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                >
                  Publish Course
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Tabs value={activeTab} onChange={setActiveTab}>
            <div className="flex gap-4 border-b mb-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === 'details'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Course Details
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === 'modules'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Modules & Lessons
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === 'preview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Course Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Course title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      placeholder="Brief description (shown in course cards)"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Complete course description"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                      >
                        <option value="WebDevelopment">Web Development</option>
                        <option value="MobileDevelopment">Mobile Development</option>
                        <option value="DataScience">Data Science</option>
                        <option value="UxDesign">UI/UX Design</option>
                        <option value="GraphicDesign">Graphic Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0 for free"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        placeholder="Course image URL"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 my-6" />

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link
                    href="/dashboards/instructor"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            )}

            {/* Modules & Lessons Tab */}
            {activeTab === 'modules' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Modules & Lessons</h2>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Module 1: Getting Started</p>
                        <p className="text-sm text-gray-500">2 lessons</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 my-6" />
                <p className="text-sm text-gray-500">
                  Click on a module to expand and manage lessons, or add a new module to get started.
                </p>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Course Preview</h2>
                
                {course.thumbnailUrl && (
                  <div className="mb-6 h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h3>
                <p className="text-gray-500 mb-4">{formData.shortDescription}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Price</p>
                    <p className="font-bold text-gray-900">${(formData.price).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Level</p>
                    <p className="font-bold text-gray-900">{formData.level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Category</p>
                    <p className="font-bold text-gray-900">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Lessons</p>
                    <p className="font-bold text-gray-900">{course.lessonsCount || 0}</p>
                  </div>
                </div>

                <hr className="border-gray-200 my-6" />

                <h4 className="text-lg font-bold text-gray-900 mb-3">About this course</h4>
                <p className="text-gray-500 whitespace-pre-wrap">{formData.description}</p>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}

'use client'

import { PageLayout } from '@/components/ui'
import { COURSE_CATEGORIES, createCourse, SKILL_LEVELS } from '@/lib/courses'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'WebDevelopment',
    level: 'Beginner',
    price: 0,
    currency: 'USD',
    thumbnailUrl: '',
    previewVideoUrl: '',
    tags: '',
    objectives: '',
    requirements: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Course title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Course description is required')
      return
    }

    try {
      setLoading(true)
      const newCourse = await createCourse({
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        level: formData.level,
        price: parseFloat(formData.price.toString()) || 0,
        currency: formData.currency,
        thumbnailUrl: formData.thumbnailUrl,
        previewVideoUrl: formData.previewVideoUrl,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        objectives: formData.objectives ? formData.objectives.split('\n').filter(o => o.trim()) : [],
        requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
      })

      router.push(`/dashboards/instructor/courses/${newCourse.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/dashboards/instructor" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to My Courses
            </Link>
            <h1 className="text-3xl font-bold">Create New Course</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="e.g., React Fundamentals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="One-line summary (e.g., Learn React in 30 days)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="Detailed course description, what students will learn, prerequisites..."
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Category & Level */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                    >
                      {COURSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat.replace(/\s+/g, '')}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Pricing & Media */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Media</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                        placeholder="0 for free"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <input
                        type="text"
                        value={formData.currency}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preview Video URL (optional)</label>
                    <input
                      type="url"
                      name="previewVideoUrl"
                      value={formData.previewVideoUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="https://example.com/preview.mp4"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Metadata */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Metadata</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <textarea
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="e.g., react, javascript, frontend, web development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Learning Objectives (one per line)</label>
                    <textarea
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="What students will learn..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                      placeholder="What students need to know before taking this course..."
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Creating...' : 'Create & Continue to Modules'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

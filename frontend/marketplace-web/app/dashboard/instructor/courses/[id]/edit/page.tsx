'use client'

import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Input,
  Spinner,
  Text,
  Textarea,
} from '@/components/green'
import { PageLayout, Tabs } from '@/components/ui'
import { authService } from '@/lib/auth'
import { Course, getInstructorCourseById, publishCourse, updateCourse } from '@/lib/courses'
import { ChevronDown, Plus } from 'lucide-react'
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
      router.push('/dashboard')
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
      router.push('/dashboard/instructor')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish course')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <Flex py={8}>
          <Spinner />
          <Text>Loading course...</Text>
        </Flex>
      </PageLayout>
    )
  }

  if (!course) {
    return (
      <PageLayout>
        <Card className="bg-red-50 border-red-200 p-6">
          <Text color="red" weight="medium">
            Course not found
          </Text>
        </Card>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="py-8">
        <Flex className="justify-between items-start mb-8">
          <div>
            <Link href="/dashboard/instructor" className="text-blue-600 hover:text-blue-700 text-sm mb-2 block">
              ← Back to Dashboard
            </Link>
            <Text as="h1" className="text-2xl font-bold">
              {course.title}
            </Text>
          </div>
          {!course.isPublished && (
            <Button 
              onClick={handlePublish}
              disabled={saving}
            >
              Publish Course
            </Button>
          )}
        </Flex>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6 p-4">
            <Text className="text-red-700 text-sm">
              {error}
            </Text>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-4 border-b mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'modules'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Modules & Lessons
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <Card className="p-6">
                <Text as="h2" size="lg" weight="bold" mb={6}>
                  Course Information
                </Text>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description</label>
                    <Textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      placeholder="Brief description (shown in course cards)"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Complete course description"
                      rows={4}
                    />
                  </div>

                  <Grid columns={2} gap={4}>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="WebDevelopment">Web Development</option>
                        <option value="MobileDevelopment">Mobile Development</option>
                        <option value="DataScience">Data Science</option>
                        <option value="UxDesign">UI/UX Design</option>
                        <option value="GraphicDesign">Graphic Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Skill Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0 for free"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                      <Input
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        placeholder="Course image URL"
                      />
                    </div>
                  </Grid>
                </div>

                <Divider className="my-6" />

                <Flex gap={4}>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Link href="/dashboard/instructor">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </Flex>
              </Card>
            </div>
          )}

          {/* Modules & Lessons Tab */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <Card className="p-6">
                <Flex justify="between" align="center" mb={6}>
                  <Text as="h2" size="lg" weight="bold">
                    Modules & Lessons
                  </Text>
                  <Button size="sm" variant="outline">
                    <Plus size={16} /> Add Module
                  </Button>
                </Flex>

                <div className="space-y-4">
                  <Card className="p-4 bg-gray-50">
                    <Flex justify="between" align="center">
                      <div>
                        <Text weight="bold">Module 1: Getting Started</Text>
                        <Text color="gray" size="sm">2 lessons</Text>
                      </div>
                      <ChevronDown size={20} />
                    </Flex>
                  </Card>
                </div>

                <Divider className="my-6" />
                <Text color="gray" size="sm">
                  Click on a module to expand and manage lessons, or add a new module to get started.
                </Text>
              </Card>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <Card className="p-6">
                <Text as="h2" size="lg" weight="bold" mb={6}>
                  Course Preview
                </Text>
                
                {course.thumbnailUrl && (
                  <div className="mb-6 h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <Text as="h3" size="xl" weight="bold" mb={2}>
                  {formData.title}
                </Text>
                
                <Text color="gray" mb={4}>
                  {formData.shortDescription}
                </Text>

                <Grid columns={4} gap={4} mb={6}>
                  <div>
                    <Text color="gray" size="xs">PRICE</Text>
                    <Text weight="bold">${(formData.price).toFixed(2)}</Text>
                  </div>
                  <div>
                    <Text color="gray" size="xs">LEVEL</Text>
                    <Text weight="bold">{formData.level}</Text>
                  </div>
                  <div>
                    <Text color="gray" size="xs">CATEGORY</Text>
                    <Text weight="bold">{formData.category}</Text>
                  </div>
                  <div>
                    <Text color="gray" size="xs">LESSONS</Text>
                    <Text weight="bold">{course.lessonsCount || 0}</Text>
                  </div>
                </Grid>

                <Divider className="my-6" />

                <Text as="h4" size="lg" weight="bold" mb={3}>
                  About this course
                </Text>
                <Text color="gray" className="whitespace-pre-wrap">
                  {formData.description}
                </Text>
              </Card>
            </div>
          )}
        </Tabs>
      </div>
    </PageLayout>
  )
}

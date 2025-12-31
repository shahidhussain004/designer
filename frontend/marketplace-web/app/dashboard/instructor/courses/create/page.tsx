'use client'

import {
    Button,
    Card,
    Divider,
    Flex,
    Input,
    Text,
    Textarea,
} from '@/components/green'
import { PageLayout } from '@/components/ui'
import { COURSE_CATEGORIES, createCourse, SKILL_LEVELS } from '@/lib/courses'
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

      // Redirect to edit page to add modules/lessons
      router.push(`/dashboard/instructor/courses/${newCourse.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <Card padding="xl">
        <Flex flex-direction="column" gap="l">
          <Text font-size="heading-l">Create New Course</Text>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', borderRadius: '8px', color: '#c33' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Flex flex-direction="column" gap="m">
              {/* Basic Info */}
              <Flex flex-direction="column" gap="s">
                <Text font-size="heading-s">Course Details</Text>
                <Input
                  placeholder="Course Title (e.g., React Fundamentals)"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Short Description</Text>
                <Input
                  placeholder="One-line summary (e.g., Learn React in 30 days)"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Full Description</Text>
                <Textarea
                  placeholder="Detailed course description, what students will learn, prerequisites..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </Flex>

              <Divider />

              {/* Category & Level */}
              <Flex flex-direction="column" gap="s">
                <Text font-size="heading-s">Course Information</Text>
              </Flex>

              <Flex gap="m">
                <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
                  <Text font-size="body-m">Category</Text>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {COURSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat.replace(/\s+/g, '')}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Flex>

                <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
                  <Text font-size="body-m">Skill Level</Text>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </Flex>
              </Flex>

              <Divider />

              {/* Pricing & Media */}
              <Flex flex-direction="column" gap="s">
                <Text font-size="heading-s">Pricing & Media</Text>
              </Flex>

              <Flex gap="m">
                <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
                  <Text font-size="body-m">Price (USD)</Text>
                  <Input
                    type="number"
                    placeholder="0 for free"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </Flex>

                <Flex flex-direction="column" gap="s" style={{ flex: 1 }}>
                  <Text font-size="body-m">Currency</Text>
                  <Input
                    disabled
                    value={formData.currency}
                  />
                </Flex>
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Thumbnail URL</Text>
                <Input
                  placeholder="https://example.com/thumbnail.jpg"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Preview Video URL (optional)</Text>
                <Input
                  placeholder="https://example.com/preview.mp4"
                  name="previewVideoUrl"
                  value={formData.previewVideoUrl}
                  onChange={handleChange}
                />
              </Flex>

              <Divider />

              {/* Metadata */}
              <Flex flex-direction="column" gap="s">
                <Text font-size="heading-s">Course Metadata</Text>
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Tags (comma-separated)</Text>
                <Textarea
                  placeholder="e.g., react, javascript, frontend, web development"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  rows={2}
                />
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Learning Objectives (one per line)</Text>
                <Textarea
                  placeholder="What students will learn..."
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  rows={3}
                />
              </Flex>

              <Flex flex-direction="column" gap="s">
                <Text font-size="body-m">Requirements (one per line)</Text>
                <Textarea
                  placeholder="What students need to know before taking this course..."
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                />
              </Flex>

              <Divider />

              {/* Actions */}
              <Flex gap="m" justify-content="flex-end">
                <Button
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create & Continue to Modules'}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </Card>
    </PageLayout>
  )
}

'use client'

import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Spinner,
    Text,
} from '@/components/green'
import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { Course, deleteCourse, getInstructorCourses } from '@/lib/courses'
import { Edit, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InstructorDashboardPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is instructor
    const user = authService.getCurrentUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
      router.push('/dashboard')
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
    } catch (err) {
      alert('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" min-height="50vh">
          <Spinner />
        </Flex>
      </PageLayout>
    )
  }

  const draftCourses = courses.filter(c => c.isPublished === false)
  const publishedCourses = courses.filter(c => c.isPublished === true)

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l">
        {/* Header */}
        <Flex justify-content="space-between" align-items="center">
          <Text font-size="heading-l">My Courses</Text>
          <Link href="/dashboard/instructor/courses/create">
            <Button>
              <Plus size={18} />
              Create New Course
            </Button>
          </Link>
        </Flex>

        {error && (
          <Card padding="m" style={{ backgroundColor: '#fee' }}>
            <Text color="negative-01">{error}</Text>
          </Card>
        )}

        {/* Published Courses */}
        {publishedCourses.length > 0 && (
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-m">Published Courses ({publishedCourses.length})</Text>
            <Grid columns="1; m{2} l{3}" gap="m">
              {publishedCourses.map(course => (
                <Card key={course.id} padding="m">
                  <Flex flex-direction="column" gap="m">
                    {course.thumbnailUrl && (
                      <div style={{ width: '100%', height: '180px', backgroundColor: '#eee', borderRadius: '8px' }} />
                    )}
                    <Text font-size="heading-s">{course.title}</Text>
                    <Flex justify-content="space-between" align-items="center">
                      <Badge variant="positive">Published</Badge>
                      <Text font-size="body-s">{course.enrollmentsCount || 0} students</Text>
                    </Flex>
                    <Flex gap="s">
                      <Link href={`/dashboard/instructor/courses/${course.id}/edit`} style={{ flex: 1 }}>
                        <Button variant="secondary" style={{ width: '100%' }}>
                          <Edit size={16} /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="negative"
                        onClick={() => handleDelete(course.id)}
                        style={{ padding: '8px 12px' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        )}

        <Divider />

        {/* Draft Courses */}
        {draftCourses.length > 0 && (
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-m">Drafts ({draftCourses.length})</Text>
            <Grid columns="1; m{2} l{3}" gap="m">
              {draftCourses.map(course => (
                <Card key={course.id} padding="m">
                  <Flex flex-direction="column" gap="m">
                    {course.thumbnailUrl && (
                      <div style={{ width: '100%', height: '180px', backgroundColor: '#eee', borderRadius: '8px' }} />
                    )}
                    <Text font-size="heading-s">{course.title}</Text>
                    <Flex justify-content="space-between" align-items="center">
                      <Badge variant="notice">Draft</Badge>
                    </Flex>
                    <Flex gap="s">
                      <Link href={`/dashboard/instructor/courses/${course.id}/edit`} style={{ flex: 1 }}>
                        <Button variant="secondary" style={{ width: '100%' }}>
                          <Edit size={16} /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="negative"
                        onClick={() => handleDelete(course.id)}
                        style={{ padding: '8px 12px' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        )}

        {/* No Courses */}
        {courses.length === 0 && (
          <Card padding="xl">
            <Flex flex-direction="column" align-items="center" gap="m">
              <Text font-size="heading-m">No courses yet</Text>
              <Text color="neutral-02">Start by creating your first course</Text>
              <Link href="/dashboard/instructor/courses/create">
                <Button>Create First Course</Button>
              </Link>
            </Flex>
          </Card>
        )}
      </Flex>
    </PageLayout>
  )
}

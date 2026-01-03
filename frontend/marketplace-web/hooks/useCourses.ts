'use client';

import { lmsClient } from '@/lib/lms-api';
import { getCourses } from '@/lib/courses';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Types
interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructorName?: string;
  category: string;
  skillLevel: string;
  price: number;
  currency: string;
  duration: number;
  durationMinutes: number;
  language: string;
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
  enrollmentCount: number;
  enrollmentsCount?: number;
  rating: number;
  reviewsCount?: number;
  lessonsCount?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  learningOutcomes?: string[];
  requirements?: string[];
}

interface PaginatedCourses {
  courses: Course[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

interface CourseFilters {
  category?: string;
  skillLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
}

interface EnrollmentResponse {
  id: number;
  courseId: number;
  userId: number;
  status: string;
  progress: number;
  enrolledAt: string;
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  durationMinutes: number;
  videoUrl?: string;
  contentType: 'Video' | 'Text' | 'Quiz';
  isPreview: boolean;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all courses with filters
 */
export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async ({ signal }) => {
      const result = await getCourses(filters);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single course by ID
 */
export function useCourse(courseId: string | number | null) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async ({ signal }) => {
      if (!courseId) throw new Error('Course ID is required');
      const { data } = await lmsClient.get<Course>(`/courses/${courseId}`, { signal });
      return data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch user's enrolled courses
 */
export function useEnrolledCourses() {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async ({ signal }) => {
      const { data } = await lmsClient.get('/enrollments', { signal });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch course curriculum/lessons
 */
export function useCourseCurriculum(courseId: string | number | null) {
  return useQuery({
    queryKey: ['course', courseId, 'curriculum'],
    queryFn: async ({ signal }) => {
      if (!courseId) throw new Error('Course ID is required');
      const { data } = await lmsClient.get<Lesson[]>(`/courses/${courseId}/curriculum`, { signal });
      return data;
    },
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Infinite scroll for courses
 */
export function useInfiniteCourses(filters: CourseFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['courses', 'infinite', filters],
    queryFn: async ({ pageParam = 0, signal }) => {
      const { data } = await lmsClient.get<PaginatedCourses>('/courses', {
        params: {
          ...filters,
          page: pageParam,
          size: filters.size || 12,
        },
        signal,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages - 1;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Enroll in a course
 */
export function useEnrollCourse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (courseId: number) => {
      const { data } = await lmsClient.post<EnrollmentResponse>(`/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: (enrollment) => {
      // Invalidate enrollments list
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      
      // Invalidate course to update enrollment count
      queryClient.invalidateQueries({ queryKey: ['course', enrollment.courseId] });
      
      // Navigate to course
      router.push(`/courses/${enrollment.courseId}`);
    },
  });
}

/**
 * Create a new course (instructor)
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: Partial<Course>) => {
      const { data } = await lmsClient.post<Course>('/courses', input);
      return data;
    },
    onSuccess: (newCourse) => {
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      // Add to cache
      queryClient.setQueryData(['course', newCourse.id], newCourse);
      
      // Navigate to course
      router.push(`/courses/${newCourse.id}`);
    },
  });
}

/**
 * Update course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string | number; input: Partial<Course> }) => {
      const { data } = await lmsClient.patch<Course>(`/courses/${id}`, input);
      return data;
    },
    onSuccess: (updatedCourse) => {
      // Update cache
      queryClient.setQueryData(['course', updatedCourse.id], updatedCourse);
      
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

/**
 * Update course progress
 */
export function useUpdateCourseProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: number; progress: number }) => {
      const { data } = await lmsClient.patch(`/enrollments/${courseId}/progress`, { progress });
      return data;
    },
    onSuccess: () => {
      // Invalidate enrollments
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

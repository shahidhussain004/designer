import lmsClient from './lms-api';

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  lessonsCount: number;
  enrollmentsCount: number;
  rating: number;
  reviewsCount: number;
  isPublished: boolean;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  completedAt?: string;
  progressPercentage: number;
  certificateUrl?: string;
}

export interface Lesson {
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

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: string;
}

// API functions
export async function getCourses(params?: {
  category?: string;
  skillLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
}): Promise<{ courses: Course[]; totalCount: number; page: number; size: number }> {
  const queryParams = new URLSearchParams();
  
  // Convert category to backend enum format (remove spaces and capitalize)
  if (params?.category) {
    const categoryEnum = params.category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    queryParams.append('category', categoryEnum);
  }
  
  if (params?.skillLevel) queryParams.append('level', params.skillLevel);
  if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page !== undefined) queryParams.append('page', (params.page + 1).toString());
  if (params?.size !== undefined) queryParams.append('pageSize', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  // Use global fetch when available (tests mock global.fetch). Fall back to axios lmsClient.
  let data: any;
  const url = `${lmsClient.defaults.baseURL}/courses?${queryParams.toString()}`;
  if (typeof fetch !== 'undefined') {
    const resp = await fetch(url);
    data = await resp.json();
  } else {
    const response = await lmsClient.get(`/courses?${queryParams.toString()}`);
    data = response.data;
  }
  
  // Transform LMS PagedResult { items, totalCount, page, pageSize } to expected format { courses, totalCount, page, size }
  type ApiCourse = {
    id: string;
    title?: string;
    shortDescription?: string;
    instructorName?: string;
    price?: number;
    currency?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: string;
    totalDurationMinutes?: number;
    totalLessons?: number;
    totalEnrollments?: number;
    averageRating?: number;
    reviewCount?: number;
  };

  return {
    courses: (data.items || []).map((item: ApiCourse) => ({
      id: item.id,
      title: item.title || '',
      description: item.shortDescription || '',
      instructorId: '',
      instructorName: item.instructorName || '',
      price: Math.round((item.price || 0) * 100),
      currency: item.currency || 'USD',
      thumbnailUrl: item.thumbnailUrl,
      category: item.category || '',
      skillLevel: (item.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
      durationMinutes: item.totalDurationMinutes || 0,
      lessonsCount: item.totalLessons || 0,
      enrollmentsCount: item.totalEnrollments || 0,
      rating: item.averageRating || 0,
      reviewsCount: item.reviewCount || 0,
      isPublished: true,
      tags: [],
      learningOutcomes: [],
      requirements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    totalCount: data.totalCount || 0,
    page: (data.page || 1) - 1,
    size: data.pageSize || 12,
  };
}

export async function getCourseById(id: string): Promise<Course> {
  const response = await lmsClient.get(`/courses/${id}`);
  return response.data;
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  const response = await lmsClient.get(`/courses/${courseId}/lessons`);
  return response.data;
}

export async function enrollInCourse(courseId: string): Promise<CourseEnrollment> {
  const response = await lmsClient.post('/enrollments', { courseId });
  return response.data;
}

export async function getMyEnrollments(): Promise<CourseEnrollment[]> {
  const response = await lmsClient.get('/enrollments/my');
  return response.data;
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const response = await lmsClient.get(`/enrollments/progress/${courseId}`);
  return response.data;
}

export async function markLessonComplete(courseId: string, lessonId: string): Promise<void> {
  await lmsClient.post(`/enrollments/progress/${courseId}/lessons/${lessonId}/complete`);
}

export async function getVideoStreamUrl(courseId: string, lessonId: string): Promise<string> {
  const response = await lmsClient.get(`/courses/${courseId}/lessons/${lessonId}/stream`);
  return response.data.streamUrl;
}

// Categories for filtering
export const COURSE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Business & Marketing',
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

// ==================== INSTRUCTOR COURSE MANAGEMENT ====================

/**
 * Create a new course as instructor
 */
export async function createCourse(data: {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  price: number;
  currency?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  tags?: string[];
  objectives?: string[];
  requirements?: string[];
}): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.post('/instructor/courses', data);
  return response.data;
}

/**
 * Update an existing course
 */
export async function updateCourse(
  courseId: string,
  data: Partial<{
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    level: string;
    price: number;
    currency: string;
    thumbnailUrl: string;
    previewVideoUrl: string;
    tags: string[];
    objectives: string[];
    requirements: string[];
  }>
): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.put(`/instructor/courses/${courseId}`, data);
  return response.data;
}

/**
 * Delete a course (draft only)
 */
export async function deleteCourse(courseId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  await lmsClient.delete(`/instructor/courses/${courseId}`);
}

/**
 * Publish a course (make it available for enrollment)
 */
export async function publishCourse(courseId: string): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.post(`/instructor/courses/${courseId}/publish`);
  return response.data;
}

/**
 * Get instructor's courses
 */
export async function getInstructorCourses(
  page = 0,
  size = 20
): Promise<{
  items: Course[];
  totalCount: number;
  page: number;
  pageSize: number;
}> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.get(`/instructor/courses`, { params: { page, pageSize: size } });
  return response.data;
}

/**
 * Add a module to a course
 */
export async function addModule(
  courseId: string,
  data: {
    title: string;
    description?: string;
    orderIndex?: number;
  }
): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.post(`/courses/${courseId}/modules`, data);
  return response.data;
}

/**
 * Add a lesson to a module
 */
export async function addLesson(
  courseId: string,
  data: {
    moduleId: string;
    title: string;
    description?: string;
    type: 'Video' | 'Text' | 'Quiz';
    content?: string;
    videoUrl?: string;
    durationMinutes?: number;
    orderIndex?: number;
    isFree?: boolean;
  }
): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.post(`/courses/${courseId}/lessons`, data);
  return response.data;
}

/**
 * Get course for instructor (with draft courses)
 */
export async function getInstructorCourseById(courseId: string): Promise<Course> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await lmsClient.get(`/courses/${courseId}`);
  return response.data;
}

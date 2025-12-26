const LMS_API_URL = process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8082/api';

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

  const response = await fetch(`${LMS_API_URL}/courses?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  const data = await response.json();
  
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
  const response = await fetch(`${LMS_API_URL}/courses/${id}`);
  if (!response.ok) throw new Error('Failed to fetch course');
  return response.json();
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  const response = await fetch(`${LMS_API_URL}/courses/${courseId}/lessons`);
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
}

export async function enrollInCourse(courseId: string): Promise<CourseEnrollment> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await fetch(`${LMS_API_URL}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ courseId }),
  });
  if (!response.ok) throw new Error('Failed to enroll in course');
  return response.json();
}

export async function getMyEnrollments(): Promise<CourseEnrollment[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await fetch(`${LMS_API_URL}/enrollments/my`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch enrollments');
  return response.json();
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await fetch(`${LMS_API_URL}/enrollments/progress/${courseId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch progress');
  return response.json();
}

export async function markLessonComplete(courseId: string, lessonId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await fetch(`${LMS_API_URL}/enrollments/progress/${courseId}/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error('Failed to mark lesson complete');
}

export async function getVideoStreamUrl(courseId: string, lessonId: string): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const response = await fetch(`${LMS_API_URL}/courses/${courseId}/lessons/${lessonId}/stream`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error('Failed to get video stream URL');
  const data = await response.json();
  return data.streamUrl;
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

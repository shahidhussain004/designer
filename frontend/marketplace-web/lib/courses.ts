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
  if (params?.category) queryParams.append('category', params.category);
  if (params?.skillLevel) queryParams.append('skillLevel', params.skillLevel);
  if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  const response = await fetch(`${LMS_API_URL}/courses?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
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

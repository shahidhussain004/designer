/**
 * Courses Service
 * Business logic for courses feature
 */

import { prismaService } from '@infrastructure/database';

class CoursesService {
  // =====================================================
  // PUBLIC METHODS
  // =====================================================

  async getAllCourses(
    publishedOnly: boolean = true,
    filters?: {
      category?: string;
      level?: string;
      search?: string;
      page?: number;
      pageSize?: number;
      sortBy?: string;
    }
  ) {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const skip = (page - 1) * pageSize;

    const whereClause: any = publishedOnly ? { isPublished: true } : {};

    if (filters?.category) {
      whereClause.category = filters.category;
    }

    if (filters?.level) {
      whereClause.level = filters.level;
    }

    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [courses, totalCount] = await Promise.all([
      prismaService.client.course.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy:
          filters?.sortBy === 'recent'
            ? { createdAt: 'desc' }
            : { displayOrder: 'asc', createdAt: 'desc' },
      }),
      prismaService.client.course.count({ where: whereClause }),
    ]);

    return {
      items: courses.map(this.formatCourse),
      totalCount,
      page,
      pageSize,
    };
  }

  async getCourseBySlug(slug: string) {
    const course = await prismaService.client.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course || !course.isPublished) {
      return null;
    }

    return {
      ...this.formatCourse(course),
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        videoDuration: lesson.videoDuration,
        contentUrl: lesson.contentUrl,
        order: lesson.order,
      })),
    };
  }

  async getCourseById(id: string) {
    const course = await prismaService.client.course.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course || !course.isPublished) {
      return null;
    }

    return {
      ...this.formatCourse(course),
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        videoDuration: lesson.videoDuration,
        contentUrl: lesson.contentUrl,
        order: lesson.order,
      })),
    };
  }

  async getCourseLessons(courseId: string) {
    const lessons = await prismaService.client.lesson.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      orderBy: { order: 'asc' },
    });

    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      videoDuration: lesson.videoDuration,
      contentUrl: lesson.contentUrl,
      order: lesson.order,
    }));
  }

  async getLessonById(courseId: string, lessonId: string) {
    const lesson = await prismaService.client.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
        isPublished: true,
      },
    });

    if (!lesson) {
      return null;
    }

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      videoDuration: lesson.videoDuration,
      contentUrl: lesson.contentUrl,
      order: lesson.order,
    };
  }

  async createCourse(data: {
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    instructorId: string;
    instructorName: string;
    price?: number;
    currency?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: string;
  }) {
    const course = await prismaService.client.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        instructorId: data.instructorId,
        instructorName: data.instructorName,
        price: data.price || 0,
        currency: data.currency || 'USD',
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        level: (data.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
      },
    });

    return this.formatCourse(course);
  }

  async updateCourse(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      shortDescription: string;
      price: number;
      currency: string;
      thumbnailUrl: string;
      category: string;
      level: string;
      totalDurationMinutes: number;
      totalLessons: number;
      isPublished: boolean;
      displayOrder: number;
    }>
  ) {
    const updateData: any = { ...data };
    if (updateData.level) {
      updateData.level = updateData.level as 'Beginner' | 'Intermediate' | 'Advanced';
    }

    const course = await prismaService.client.course.update({
      where: { id },
      data: updateData,
    });

    return this.formatCourse(course);
  }

  async deleteCourse(id: string) {
    await prismaService.client.course.delete({
      where: { id },
    });
  }

  // =====================================================
  // PRIVATE METHODS
  // =====================================================

  private formatCourse(course: any) {
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      shortDescription: course.shortDescription,
      instructorName: course.instructorName,
      price: course.price,
      currency: course.currency,
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      level: course.level,
      totalDurationMinutes: course.totalDurationMinutes,
      totalLessons: course.totalLessons,
      totalEnrollments: course.totalEnrollments,
      averageRating: course.averageRating,
      reviewCount: course.reviewCount,
      isPublished: course.isPublished,
    };
  }
}

export const coursesService = new CoursesService();

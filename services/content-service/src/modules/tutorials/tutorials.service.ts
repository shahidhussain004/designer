/**
 * Tutorials Service
 * Business logic for tutorials feature
 */

import { prismaService } from '@infrastructure/database';

class TutorialsService {
  // =====================================================
  // PUBLIC METHODS
  // =====================================================

  async getAllTutorials(publishedOnly: boolean = true) {
    const tutorials = await prismaService.client.tutorial.findMany({
      where: publishedOnly ? { isPublished: true } : {},
      include: {
        sections: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { title: 'asc' }],
    });

    return tutorials.map((tutorial) => ({
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      icon: tutorial.icon,
      difficulty_level: tutorial.difficultyLevel,
      color_theme: tutorial.colorTheme,
      estimated_hours: tutorial.estimatedHours,
      is_published: tutorial.isPublished,
      sections_count: tutorial.sections.length,
      stats: tutorial.stats,
      display_order: tutorial.displayOrder,
      created_at: tutorial.createdAt,
    }));
  }

  async getTutorialBySlug(slug: string) {
    const tutorial = await prismaService.client.tutorial.findUnique({
      where: { slug },
      include: {
        sections: {
          include: {
            topics: {
              where: { isPublished: true },
              select: {
                id: true,
                slug: true,
                title: true,
                estimatedReadTime: true,
                hasAudio: true,
                hasVideo: true,
                displayOrder: true,
              },
              orderBy: { displayOrder: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!tutorial || !tutorial.isPublished) {
      return null;
    }

    return {
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      icon: tutorial.icon,
      difficulty_level: tutorial.difficultyLevel,
      color_theme: tutorial.colorTheme,
      estimated_hours: tutorial.estimatedHours,
      is_published: tutorial.isPublished,
      stats: tutorial.stats,
      meta_tags: tutorial.metaTags,
      sections: tutorial.sections.map((section) => ({
        id: section.id,
        slug: section.slug,
        title: section.title,
        description: section.description,
        icon: section.icon,
        display_order: section.displayOrder,
        topics_count: section.topics.length,
        topics: section.topics.map((topic) => ({
          id: topic.id,
          slug: topic.slug,
          title: topic.title,
          estimated_read_time: topic.estimatedReadTime,
          has_audio: topic.hasAudio,
          has_video: topic.hasVideo,
          display_order: topic.displayOrder,
        })),
      })),
    };
  }

  async getSectionWithTopics(tutorialSlug: string, sectionSlug: string) {
    const section = await prismaService.client.tutorialSection.findFirst({
      where: {
        slug: sectionSlug,
        tutorial: {
          slug: tutorialSlug,
          isPublished: true,
        },
      },
      include: {
        tutorial: true,
        topics: {
          where: { isPublished: true },
          select: {
            id: true,
            slug: true,
            title: true,
            estimatedReadTime: true,
            hasAudio: true,
            hasVideo: true,
            displayOrder: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!section) {
      return null;
    }

    return {
      id: section.id,
      slug: section.slug,
      title: section.title,
      description: section.description,
      icon: section.icon,
      tutorial_id: section.tutorial.id,
      tutorial_title: section.tutorial.title,
      tutorial_slug: section.tutorial.slug,
      topics: section.topics.map((topic) => ({
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        estimated_read_time: topic.estimatedReadTime,
        has_audio: topic.hasAudio,
        has_video: topic.hasVideo,
        display_order: topic.displayOrder,
      })),
    };
  }

  async getTopicContent(
    tutorialSlug: string,
    sectionSlug: string,
    topicSlug: string,
    userId?: string
  ) {
    const topic = await prismaService.client.tutorialTopic.findFirst({
      where: {
        slug: topicSlug,
        section: {
          slug: sectionSlug,
          tutorial: {
            slug: tutorialSlug,
            isPublished: true,
          },
        },
        isPublished: true,
      },
      include: {
        section: {
          include: {
            tutorial: true,
            topics: {
              where: { isPublished: true },
              select: {
                id: true,
                slug: true,
                title: true,
              },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!topic) {
      return null;
    }

    // Increment view count
    await prismaService.client.tutorialTopic.update({
      where: { id: topic.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Get navigation (prev/next)
    const allTopics = topic.section.topics;
    const currentIndex = allTopics.findIndex((t) => t.id === topic.id);
    const navigation = {
      prev: currentIndex > 0 ? allTopics[currentIndex - 1] : null,
      next: currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null,
    };

    // Track user progress if userId provided
    if (userId) {
      await prismaService.client.tutorialProgress.upsert({
        where: {
          userId_topicId: {
            userId: parseInt(userId),
            topicId: topic.id,
          },
        },
        update: {
          lastReadAt: new Date(),
        },
        create: {
          userId: parseInt(userId),
          tutorialId: topic.section.tutorial.id,
          topicId: topic.id,
          lastReadAt: new Date(),
        },
      });
    }

    return {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      content: topic.content,
      code_examples: topic.codeExamples,
      estimated_read_time: topic.estimatedReadTime,
      views_count: topic.viewsCount + 1, // Include the increment
      has_audio: topic.hasAudio,
      audio_url: topic.audioUrl,
      audio_duration: topic.audioDuration,
      has_video: topic.hasVideo,
      video_url: topic.videoUrl,
      video_duration: topic.videoDuration,
      section_title: topic.section.title,
      section_slug: topic.section.slug,
      tutorial_title: topic.section.tutorial.title,
      tutorial_slug: topic.section.tutorial.slug,
      color_theme: topic.section.tutorial.colorTheme,
      navigation,
    };
  }

  // =====================================================
  // ADMIN METHODS
  // =====================================================

  async createTutorial(data: {
    slug: string;
    title: string;
    description?: string;
    icon?: string;
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
    colorTheme?: string;
    estimatedHours?: number;
  }) {
    return await prismaService.client.tutorial.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        icon: data.icon,
        difficultyLevel: data.difficultyLevel,
        colorTheme: data.colorTheme,
        estimatedHours: data.estimatedHours,
      },
    });
  }

  async createSection(
    tutorialId: number,
    data: {
      slug: string;
      title: string;
      description?: string;
      icon?: string;
      displayOrder?: number;
    }
  ) {
    return await prismaService.client.tutorialSection.create({
      data: {
        tutorialId,
        slug: data.slug,
        title: data.title,
        description: data.description,
        icon: data.icon,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async createTopic(
    sectionId: number,
    data: {
      slug: string;
      title: string;
      content: string;
      codeExamples?: any[];
      estimatedReadTime?: number;
      displayOrder?: number;
    }
  ) {
    return await prismaService.client.tutorialTopic.create({
      data: {
        sectionId,
        slug: data.slug,
        title: data.title,
        content: data.content,
        codeExamples: data.codeExamples,
        estimatedReadTime: data.estimatedReadTime || 5,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async updateTopic(
    topicId: number,
    data: Partial<{
      title: string;
      content: string;
      codeExamples: any[];
      estimatedReadTime: number;
      isPublished: boolean;
    }>
  ) {
    return await prismaService.client.tutorialTopic.update({
      where: { id: topicId },
      data,
    });
  }

  async generateAIContent(params: {
    topic: string;
    section: string;
    tutorial: string;
    contentType?: string;
  }) {
    // Placeholder for AI content generation
    // In production, this would call Anthropic API

    const mockContent = `# ${params.topic}

This is AI-generated content for ${params.topic} in the ${params.section} section of the ${params.tutorial} tutorial.

## Overview

${params.topic} is an important concept in ${params.tutorial}. Let's explore it in detail.

## Key Concepts

1. **Concept 1**: Understanding the basics
2. **Concept 2**: Advanced features
3. **Concept 3**: Best practices

## Example

\`\`\`
// Example code will be generated here
\`\`\`

## Practice

Try implementing the following exercises to master ${params.topic}.

## Next Steps

Continue to the next topic to build on what you've learned.`;

    return {
      content: mockContent,
      estimated_read_time: Math.ceil(mockContent.split(' ').length / 200),
    };
  }
}

export const tutorialsService = new TutorialsService();

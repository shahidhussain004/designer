'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { Breadcrumb, PageLayout } from '@/components/ui';
import { useTutorial } from '@/hooks/useContent';
import { BookOpen, ChevronRight, Clock, Code, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types matching backend
interface TutorialTopic {
  id: string;
  slug: string;
  title: string;
  estimated_read_time: number;
  is_published: boolean;
}

interface TutorialSection {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  topics: TutorialTopic[];
}

interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficultyLevel: string;
  colorTheme: string;
  estimatedHours: number;
  sections: TutorialSection[];
}

const TutorialDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: rawTutorial, isLoading, error, refetch } = useTutorial(slug);

  if (isLoading) {
    return (
      <PageLayout>
        <TutorialsSkeleton />
      </PageLayout>
    );
  }

  if (error || !rawTutorial) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {error ? (
              <ErrorMessage message={error.message} retry={refetch} />
            ) : (
              <>
                <p className="text-error-500 text-lg">Error: Tutorial not found</p>
                <Link
                  href="/tutorials"
                  className="mt-4 inline-block px-6 py-2 bg-secondary-800 text-white rounded-lg hover:bg-secondary-700"
                >
                  Back to Tutorials
                </Link>
              </>
            )}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Adapt API response to component format
  const p = rawTutorial as unknown as Record<string, unknown>;
  const tutorial: Tutorial = {
    id: String(p.id),
    slug: p.slug as string,
    title: p.title as string,
    description: (p.description ?? p.summary ?? p.excerpt ?? '') as string,
    icon: p.icon as string,
    difficultyLevel: (p.difficulty_level as string) || (p.difficultyLevel as string) || 'beginner',
    colorTheme: (p.color_theme ?? p.colorTheme) as string,
    estimatedHours: (p.estimated_hours ?? p.estimatedHours ?? 0) as number,
    sections: Array.isArray(p.sections)
      ? (p.sections as Record<string, unknown>[]).map((s) => ({
          id: String(s.id),
          slug: s.slug as string,
          title: s.title as string,
          description: (s.description ?? s.summary ?? '') as string,
          icon: s.icon as string,
          display_order: (s.display_order ?? s.displayOrder ?? 0) as number,
          topics: Array.isArray(s.topics)
            ? (s.topics as Record<string, unknown>[]).map((t) => ({
                id: String(t.id),
                slug: t.slug as string,
                title: t.title as string,
                estimated_read_time: (t.estimated_read_time ?? t.estimatedReadTime ?? 0) as number,
                is_published: typeof t.is_published === 'boolean' ? (t.is_published as boolean) : ((t.isPublished ?? true) as boolean),
              }))
            : [],
        }))
      : [],
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'intermediate':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'advanced':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400';
    }
  };

  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' },
    { label: tutorial.title, href: `/tutorials/${tutorial.slug}` },
  ];

  const sortedSections = tutorial.sections.sort((a, b) => a.display_order - b.display_order);
  const totalTopics = sortedSections.reduce(
    (sum, s) => sum + s.topics.filter((t) => (t.is_published ?? true)).length,
    0
  );

  return (
    <PageLayout>
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-secondary-900 text-white py-12 px-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 backdrop-blur-3xl"></div>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Hero Content */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-5xl md:text-6xl flex-shrink-0">
                {tutorial.icon || '📘'}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{tutorial.title}</h1>
                <p className="text-lg text-white/90 mb-6 max-w-2xl">{tutorial.description}</p>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-secondary-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-secondary-700">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">{sortedSections.length} Sections</span>
                  </div>
                  <div className="bg-secondary-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-secondary-700">
                    <Code className="w-5 h-5" />
                    <span className="font-medium">{totalTopics} Topics</span>
                  </div>
                  <div className="bg-secondary-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-secondary-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{tutorial.estimatedHours} Hours</span>
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 font-medium capitalize border ${getDifficultyColor(tutorial.difficultyLevel)}`}
                  >
                    {tutorial.difficultyLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Sections */}
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
              Tutorial Sections
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 text-lg">
              Learn step-by-step through organized sections and topics
            </p>

            <div className="space-y-6">
              {sortedSections.map((section, sectionIndex) => {
                const publishedTopics = section.topics.filter((t) => (t.is_published ?? true));

                return (
                  <div
                    key={section.id}
                    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-secondary-200 dark:border-secondary-700 overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/40">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 text-white font-bold bg-secondary-700">
                          {section.icon || sectionIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                              {section.title}
                            </h3>
                            <span
                              className="text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `rgba(107,114,128,0.12)` }}
                            >
                              {publishedTopics.length} topic{publishedTopics.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-secondary-600 dark:text-secondary-400">{section.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Topics List */}
                    <div className="px-6 md:px-8 py-6">
                      {publishedTopics.length > 0 ? (
                        <div className="space-y-3">
                          {publishedTopics.map((topic, topicIndex) => (
                            <Link
                              key={topic.id}
                              href={`/tutorials/${tutorial.slug}/${section.slug}/${topic.slug}`}
                              className="group flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-700/40 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors border border-transparent hover:border-secondary-300 dark:hover:border-secondary-600"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm bg-secondary-700">
                                  {topicIndex + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-secondary-900 dark:text-white group-hover:text-secondary-900 dark:group-hover:text-secondary-100 transition-colors">
                                    {topic.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                <span className="text-sm text-secondary-500 dark:text-secondary-400 whitespace-nowrap">
                                  {topic.estimated_read_time} min
                                </span>
                                <ChevronRight className="w-5 h-5 text-secondary-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-secondary-500 dark:text-secondary-400">No topics available in this section</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-secondary-900 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Learning?</h3>
            <p className="text-secondary-200 mb-6 text-lg max-w-2xl mx-auto">
              Begin with the first section to master {tutorial.title}
            </p>
            {sortedSections.length > 0 && sortedSections[0].topics.length > 0 && (
              <Link
                href={`/tutorials/${tutorial.slug}/${sortedSections[0].slug}/${sortedSections[0].topics[0].slug}`}
                className="inline-flex items-center gap-2 bg-white text-secondary-900 hover:bg-secondary-100 font-bold px-8 py-3 rounded-lg transition-colors"
              >
                <Zap className="w-5 h-5" />
                Start Learning Now
              </Link>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default TutorialDetailPage;

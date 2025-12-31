'use client';

import { Breadcrumb, PageLayout } from '@/components/ui';
import { BookOpen, ChevronRight, Clock, Code, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:8083/api/tutorials/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tutorial');
        return res.json();
      })
      .then((data) => {
        // Backend returns { success: true, data: tutorial }
        const payload = data?.data ?? data;
        if (!payload) {
          setError('Invalid tutorial response from server');
          setLoading(false);
          return;
        }

        // Adapt fields to camelCase and safe defaults
        const adapted: Tutorial = {
          id: payload.id,
          slug: payload.slug,
          title: payload.title,
          description: payload.description,
          icon: payload.icon,
          difficultyLevel: payload.difficulty_level,
          colorTheme: payload.color_theme,
          estimatedHours: payload.estimated_hours ?? 0,
          sections: Array.isArray(payload.sections)
            ? payload.sections.map((s: any) => ({
                id: s.id,
                slug: s.slug,
                title: s.title,
                description: s.description,
                icon: s.icon,
                display_order: s.display_order,
                topics: Array.isArray(s.topics)
                  ? s.topics.map((t: any) => ({
                      id: t.id,
                      slug: t.slug,
                      title: t.title,
                      estimated_read_time: t.estimated_read_time ?? t.estimatedReadTime ?? 0,
                      // Backend may not include is_published (topics were already filtered), default to true
                      is_published: typeof t.is_published === 'boolean' ? t.is_published : true,
                    }))
                  : [],
              }))
            : [],
        };

        setTutorial(adapted);
        // Debug: log adapted structure to help diagnose missing topics in dev
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('adapted tutorial:', adapted);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading tutorial...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !tutorial) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {error || 'Tutorial not found'}</p>
            <Link
              href="/tutorials"
              className="mt-4 inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Tutorials
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
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
        <div className="bg-gray-900 text-white py-12 px-4 relative overflow-hidden">
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
                  <div className="bg-gray-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-700">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">{sortedSections.length} Sections</span>
                  </div>
                  <div className="bg-gray-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-700">
                    <Code className="w-5 h-5" />
                    <span className="font-medium">{totalTopics} Topics</span>
                  </div>
                  <div className="bg-gray-800/40 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-700">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tutorial Sections
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Learn step-by-step through organized sections and topics
            </p>

            <div className="space-y-6">
              {sortedSections.map((section, sectionIndex) => {
                const publishedTopics = section.topics.filter((t) => (t.is_published ?? true));

                return (
                  <div
                    key={section.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 text-white font-bold bg-gray-700">
                          {section.icon || sectionIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {section.title}
                            </h3>
                            <span
                              className="text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `rgba(107,114,128,0.12)` }}
                            >
                              {publishedTopics.length} topic{publishedTopics.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{section.description}</p>
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
                              className="group flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm bg-gray-700">
                                  {topicIndex + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                    {topic.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {topic.estimated_read_time} min
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">No topics available in this section</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Learning?</h3>
            <p className="text-gray-200 mb-6 text-lg max-w-2xl mx-auto">
              Begin with the first section to master {tutorial.title}
            </p>
            {sortedSections.length > 0 && sortedSections[0].topics.length > 0 && (
              <Link
                href={`/tutorials/${tutorial.slug}/${sortedSections[0].slug}/${sortedSections[0].topics[0].slug}`}
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-colors"
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

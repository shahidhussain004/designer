'use client';

import { PageLayout } from '@/components/ui';
import { contentApi } from '@/lib/content-api';
import { BookOpen, Clock, Headphones, TrendingUp, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tutorial type matching our backend schema
interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  colorTheme: string;
  estimatedHours: number;
  isPublished: boolean;
  sectionsCount: number;
  stats?: {
    totalTopics?: number;
    totalReadTime?: number;
    completionRate?: number;
  } | null;
}

// Difficulty filter type
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  useEffect(() => {
    // Fetch tutorials from Content Service via contentApi
    (async () => {
      try {
        const resp = await contentApi.getPublished({ limit: 100, filters: { contentType: 'tutorial' } });
        const tutorialsPayload = resp.data ?? [];

        const adapt = (t: any): Tutorial => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          description: t.description,
          icon: t.icon,
          difficultyLevel: t.difficulty_level || t.difficultyLevel,
          colorTheme: t.color_theme || t.colorTheme,
          estimatedHours: t.estimated_hours ?? t.estimatedHours ?? 0,
          isPublished: t.is_published ?? t.isPublished ?? false,
          sectionsCount: t.sections_count ?? t.sectionsCount ?? 0,
          stats: t.stats
            ? {
                totalTopics: t.stats.total_topics ?? t.stats.totalTopics,
                totalReadTime: t.stats.total_read_time ?? t.stats.totalReadTime,
                completionRate: t.stats.completion_rate ?? t.stats.completionRate,
              }
            : null,
        });

        setTutorials(tutorialsPayload.map(adapt));
      } catch (err: any) {
        setError(err?.message || 'Failed to load tutorials');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredTutorials = tutorials.filter((tutorial) => {
    if (difficultyFilter === 'all') return true;
    return tutorial.difficultyLevel === difficultyFilter;
  });

  const getDifficultyBadgeClass = (level: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (level) {
      case 'beginner':
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`;
      case 'intermediate':
        return `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'advanced':
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`;
      default:
        return baseClasses;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading tutorials...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Master Programming Skills</h1>
          <p className="text-xl text-gray-200 mb-8">
            Learn at your own pace with interactive tutorials, audio guides, and video lessons
          </p>
          
          {/* Three Modes of Learning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
              <BookOpen className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Read</h3>
              <p className="text-gray-200 text-sm">
                Comprehensive text tutorials with code examples
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
              <Headphones className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Listen</h3>
              <p className="text-gray-200 text-sm">
                AI-generated audio guides for hands-free learning
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
              <Video className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Watch</h3>
              <p className="text-gray-200 text-sm">
                AI-powered video tutorials with visual demonstrations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setDifficultyFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Tutorials
          </button>
          <button
            onClick={() => setDifficultyFilter('beginner')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'beginner'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setDifficultyFilter('intermediate')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'intermediate'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setDifficultyFilter('advanced')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'advanced'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl mb-3 block">{tutorial.icon || '📘'}</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tutorial.title}
                    </h3>
                  </div>
                  <span className={getDifficultyBadgeClass(tutorial.difficultyLevel)}>
                    {tutorial.difficultyLevel}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{tutorial.sectionsCount} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.estimatedHours}h</span>
                  </div>
                  {tutorial.stats && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{tutorial.stats.totalTopics} topics</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/tutorials/${tutorial.slug}`}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No tutorials found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TutorialsPage;

'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useTutorials } from '@/hooks/useContent';
import { BookOpen, Clock, Headphones, TrendingUp, Video } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

// Difficulty filter type
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const TutorialsPage = () => {
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  const { data: tutorials = [], isLoading, error, refetch } = useTutorials(true);

  const filteredTutorials = useMemo(() => {
    return (tutorials as Record<string, unknown>[]).filter((tutorial) => {
      if (difficultyFilter === 'all') return true;
      return (tutorial.difficulty_level as string | undefined) === difficultyFilter;
    });
  }, [tutorials, difficultyFilter]);

  const getDifficultyBadgeClass = (level: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (level) {
      case 'beginner':
        return `${baseClasses} bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300`;
      case 'intermediate':
        return `${baseClasses} bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300`;
      case 'advanced':
        return `${baseClasses} bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300`;
      default:
        return baseClasses;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <TutorialsSkeleton />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Failed to load tutorials'} 
          retry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-secondary-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Master Programming Skills</h1>
          <p className="text-xl text-secondary-200 mb-8">
            Learn at your own pace with interactive tutorials, audio guides, and video lessons
          </p>
          
          {/* Three Modes of Learning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-secondary-800/50 backdrop-blur-md rounded-lg p-6 border border-secondary-700">
              <BookOpen className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Read</h3>
              <p className="text-secondary-200 text-sm">
                Comprehensive text tutorials with code examples
              </p>
            </div>
            <div className="bg-secondary-800/50 backdrop-blur-md rounded-lg p-6 border border-secondary-700">
              <Headphones className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Listen</h3>
              <p className="text-secondary-200 text-sm">
                AI-generated audio guides for hands-free learning
              </p>
            </div>
            <div className="bg-secondary-800/50 backdrop-blur-md rounded-lg p-6 border border-secondary-700">
              <Video className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Watch</h3>
              <p className="text-secondary-200 text-sm">
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
                ? 'bg-secondary-800 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600'
            }`}
          >
            All Tutorials
          </button>
          <button
            onClick={() => setDifficultyFilter('beginner')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'beginner'
                ? 'bg-success-600 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setDifficultyFilter('intermediate')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'intermediate'
                ? 'bg-warning-600 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setDifficultyFilter('advanced')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              difficultyFilter === 'advanced'
                ? 'bg-error-600 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div
              key={String(tutorial.id)}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-secondary-200 dark:border-secondary-700"
            >
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl mb-3 block">{(tutorial.icon as string | undefined) || '📘'}</span>
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                      {tutorial.title as string}
                    </h3>
                  </div>
                  <span className={getDifficultyBadgeClass((tutorial.difficulty_level as string | undefined) || 'beginner')}>
                    {tutorial.difficulty_level as string}
                  </span>
                </div>

                {/* Description */}
                <p className="text-secondary-600 dark:text-secondary-300 mb-4 line-clamp-2">
                  {tutorial.description as string}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 text-sm text-secondary-500 dark:text-secondary-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{tutorial.sections_count as number} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.estimated_hours as number}h</span>
                  </div>
                  {Boolean(tutorial.stats && (tutorial.stats as Record<string, unknown>).total_topics) && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{(tutorial.stats as Record<string, unknown>).total_topics as number} topics</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/tutorials/${tutorial.slug as string}`}
                    className="flex-1 bg-secondary-800 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
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
            <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
              No tutorials found
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TutorialsPage;

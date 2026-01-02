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
    return tutorials.filter((tutorial: any) => {
      if (difficultyFilter === 'all') return true;
      return tutorial.difficulty_level === difficultyFilter;
    });
  }, [tutorials, difficultyFilter]);

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
          {filteredTutorials.map((tutorial: any) => (
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
                  <span className={getDifficultyBadgeClass(tutorial.difficulty_level)}>
                    {tutorial.difficulty_level}
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
                    <span>{tutorial.sections_count} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.estimated_hours}h</span>
                  </div>
                  {tutorial.stats && tutorial.stats.total_topics && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{tutorial.stats.total_topics} topics</span>
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

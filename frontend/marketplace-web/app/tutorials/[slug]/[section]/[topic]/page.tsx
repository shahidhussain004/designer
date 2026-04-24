'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { Breadcrumb, PageLayout } from '@/components/ui';
import { useTutorial } from '@/hooks/useContent';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Types matching backend
interface NavigationLink {
  slug: string;
  title: string;
}

interface TopicContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  code_examples: unknown;
  estimated_read_time: number;
  views_count: number;
  section: {
    slug: string;
    title: string;
  };
  tutorial: {
    slug: string;
    title: string;
    icon: string;
    color_theme: string;
  };
  navigation: {
    prev: NavigationLink | null;
    next: NavigationLink | null;
  };
}

const TopicReadingPage = () => {
  const params = useParams();
  const tutorialSlug = params.slug as string;
  const sectionSlug = params.section as string;
  const topicSlug = params.topic as string;

  const composedSlug = `${tutorialSlug}/${sectionSlug}/${topicSlug}`;
  const { data, isLoading, isError, error, refetch } = useTutorial(composedSlug);

  if (isLoading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <ErrorMessage 
            message={error?.message || 'Failed to load topic'} 
            retry={() => refetch()}
          />
        </div>
      </PageLayout>
    );
  }

  const p = data as unknown as Record<string, unknown>;
  const topic: TopicContent = {
    id: String(p.id),
    slug: p.slug as string,
    title: p.title as string,
    content: (p.content ?? p.body ?? p.html ?? '') as string,
    code_examples: (p.code_examples ?? p.codeExamples ?? null) as string | null,
    estimated_read_time: (p.estimated_read_time ?? p.estimatedReadTime ?? 0) as number,
    views_count: (p.views_count ?? p.viewsCount ?? 0) as number,
    section: {
      slug: (p.section_slug ?? (p.section as Record<string, unknown> | undefined)?.slug ?? sectionSlug) as string,
      title: (p.section_title ?? (p.section as Record<string, unknown> | undefined)?.title ?? '') as string,
    },
    tutorial: {
      slug: (p.tutorial_slug ?? (p.tutorial as Record<string, unknown> | undefined)?.slug ?? tutorialSlug) as string,
      title: (p.tutorial_title ?? (p.tutorial as Record<string, unknown> | undefined)?.title ?? '') as string,
      icon: (p.tutorial_icon ?? (p.tutorial as Record<string, unknown> | undefined)?.icon ?? p.icon ?? '') as string,
      color_theme: (p.color_theme ?? (p.tutorial as Record<string, unknown> | undefined)?.color_theme ?? (p.tutorial as Record<string, unknown> | undefined)?.colorTheme ?? '#000000') as string,
    },
    navigation: {
      prev: ((p.navigation as Record<string, unknown> | undefined)?.prev ?? null) as NavigationLink | null,
      next: ((p.navigation as Record<string, unknown> | undefined)?.next ?? null) as NavigationLink | null,
    },
  };

  return (
    <PageLayout>
      <div className="container mx-auto max-w-5xl px-4 py-4">
        <Breadcrumb
          items={[
            { label: 'Tutorials', href: '/tutorials' },
            { label: topic.tutorial.title || 'Tutorial', href: `/tutorials/${tutorialSlug}` },
            { label: topic.section.title || 'Section', href: '#' },
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <article className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-8 md:p-12">
          {/* Topic Header */}
          <div className="mb-8 pb-6 border-b border-secondary-200 dark:border-secondary-700">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{topic.section.title}</span>
              </div>
              <span>•</span>
              <span>{topic.views_count} views</span>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-4
            prose-p:text-secondary-700 prose-p:dark:text-secondary-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-secondary-900 prose-a:dark:text-secondary-100 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-secondary-100 prose-code:dark:bg-secondary-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-secondary-900 prose-pre:dark:bg-secondary-950 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-secondary-700 prose-li:dark:text-secondary-300 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-secondary-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-secondary-700 prose-blockquote:dark:text-secondary-400
            prose-strong:text-secondary-900 prose-strong:dark:text-secondary-100 prose-strong:font-semibold
            prose-table:w-full prose-table:border-collapse
            prose-th:bg-secondary-100 prose-th:dark:bg-secondary-700 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-secondary-300 prose-th:dark:border-secondary-600
            prose-td:p-3 prose-td:border prose-td:border-secondary-300 prose-td:dark:border-secondary-600
          ">
            <ReactMarkdown>{topic.content}</ReactMarkdown>
          </div>
        </article>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {topic.navigation.prev ? (
            <Link
              href={`/tutorials/${tutorialSlug}/${sectionSlug}/${topic.navigation.prev.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-secondary-800 rounded-lg shadow hover:shadow-md transition-all border border-secondary-200 dark:border-secondary-700 group"
            >
              <ChevronLeft className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Previous</div>
                <div className="font-medium text-secondary-900 dark:text-white">
                  {topic.navigation.prev.title}
                </div>
              </div>
            </Link>
          ) : (
            <div /> // Empty div for spacing
          )}

          {topic.navigation.next ? (
            <Link
              href={`/tutorials/${tutorialSlug}/${sectionSlug}/${topic.navigation.next.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-secondary-800 rounded-lg shadow hover:shadow-md transition-all border border-secondary-200 dark:border-secondary-700 group ml-auto"
            >
              <div className="text-right">
                <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Next</div>
                <div className="font-medium text-secondary-900 dark:text-white">
                  {topic.navigation.next.title}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
};

export default TopicReadingPage;

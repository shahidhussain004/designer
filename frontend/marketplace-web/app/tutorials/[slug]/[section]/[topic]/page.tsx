'use client';

import { Breadcrumb, PageLayout } from '@/components/ui';
import { tutorialsApi } from '@/lib/content-api';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  code_examples: any;
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

  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorialSlug || !sectionSlug || !topicSlug) return;
    (async () => {
      try {
        // Some content services expose topics as nested slugs; attempt to fetch by composed slug
        const composedSlug = `${tutorialSlug}/${sectionSlug}/${topicSlug}`;
        const resp = await tutorialsApi.getBySlug(composedSlug);
        const payload = resp ?? null;
        if (!payload) {
          setError('Invalid topic response from server');
          setLoading(false);
          return;
        }

        const p: any = payload;

        const adapted: TopicContent = {
          id: p.id,
          slug: p.slug,
          title: p.title,
          content: p.content ?? p.body ?? p.html ?? '',
          code_examples: p.code_examples ?? p.codeExamples ?? null,
          estimated_read_time: p.estimated_read_time ?? p.estimatedReadTime ?? 0,
          views_count: p.views_count ?? p.viewsCount ?? 0,
          section: {
            slug: p.section_slug ?? p.section?.slug ?? sectionSlug,
            title: p.section_title ?? p.section?.title ?? '',
          },
          tutorial: {
            slug: p.tutorial_slug ?? p.tutorial?.slug ?? tutorialSlug,
            title: p.tutorial_title ?? p.tutorial?.title ?? '',
            icon: p.tutorial_icon ?? p.tutorial?.icon ?? p.icon ?? '',
            color_theme: p.color_theme ?? p.tutorial?.color_theme ?? p.tutorial?.colorTheme ?? '#000000',
          },
          navigation: {
            prev: p.navigation?.prev ?? null,
            next: p.navigation?.next ?? null,
          },
        };

        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('adapted topic payload:', adapted);
        }

        setTopic(adapted);
      } catch (err: any) {
        setError(err?.message || 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    })();
  }, [tutorialSlug, sectionSlug, topicSlug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading content...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !topic) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {error || 'Content not found'}</p>
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
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          {/* Topic Header */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
            prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-gray-900 prose-a:dark:text-gray-100 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-gray-100 prose-code:dark:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-gray-900 prose-pre:dark:bg-gray-950 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-gray-700 prose-li:dark:text-gray-300 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:dark:text-gray-400
            prose-strong:text-gray-900 prose-strong:dark:text-gray-100 prose-strong:font-semibold
            prose-table:w-full prose-table:border-collapse
            prose-th:bg-gray-100 prose-th:dark:bg-gray-700 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-300 prose-th:dark:border-gray-600
            prose-td:p-3 prose-td:border prose-td:border-gray-300 prose-td:dark:border-gray-600
          ">
            <ReactMarkdown>{topic.content}</ReactMarkdown>
          </div>
        </article>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {topic.navigation.prev ? (
            <Link
              href={`/tutorials/${tutorialSlug}/${sectionSlug}/${topic.navigation.prev.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Previous</div>
                <div className="font-medium text-gray-900 dark:text-white">
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
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 group ml-auto"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {topic.navigation.next.title}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
};

export default TopicReadingPage;

'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCategories, useContent, useTags } from '@/hooks/useContent';
import type { ContentType } from '@/lib/content-types';
import { useAuth } from '@/lib/context/AuthContext';
import { ENV } from '@/lib/env';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

const CONTENT_TYPES: { value: ContentType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'blog', label: 'Blog Posts' },
  { value: 'article', label: 'Articles' },
  { value: 'news', label: 'News' },
];

export default function ResourcesPage() {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<ContentType | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch categories and tags
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // Fetch content with filters
  const filters = useMemo(() => {
    const f: Record<string, unknown> = {
      page,
      limit: pageSize,
      sortBy,
      sortOrder,
    };
    
    // Add filter params at top level - API normalizes them
    if (selectedContentType) f.type = selectedContentType;
    if (selectedCategory) f.categoryId = selectedCategory;
    if (selectedTags.length > 0) f.tagIds = selectedTags;
    if (searchQuery) f.search = searchQuery;
    
    return f;
  }, [page, sortBy, sortOrder, selectedContentType, selectedCategory, selectedTags, searchQuery]);

  // DEBUG: log filters when they change to diagnose issues
  React.useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.info('[DEBUG] resources.filters', {
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        selectedContentType,
        selectedCategory,
        selectedTags,
        searchQuery,
      });
    } catch {
      // ignore
    }
  }, [page, pageSize, sortBy, sortOrder, selectedContentType, selectedCategory, selectedTags, searchQuery]);

  const { data: contentData, isLoading, error, refetch } = useContent(filters);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const content = contentData?.data || [];
  const totalCount = contentData?.meta?.total || 0;
  const totalPages = contentData?.meta?.totalPages || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedContentType('');
    setSelectedTags([]);
    setSortBy('publishedAt');
    setSortOrder('desc');
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeSlug = (contentType?: string) => {
    const map: Record<string, string> = {
      blog: 'blogs',
      article: 'articles',
      news: 'news',
    };
    return map[contentType?.toLowerCase() || ''] || 'articles';
  };

  const getContentTypeBadge = (type: ContentType) => {
    const styles: Record<ContentType, { bg: string; text: string }> = {
      blog: { bg: 'bg-primary-100', text: 'text-blue-800' },
      article: { bg: 'bg-success-100', text: 'text-success-800' },
      news: { bg: 'bg-warning-100', text: 'text-warning-800' },
    };
    return styles[type] || { bg: 'bg-secondary-100', text: 'text-secondary-800' };
  };

  return (
    <PageLayout title="Resources | Designer Marketplace">
      <div className="min-h-screen bg-secondary-50">
        {/* Page Header */}
        <div className="bg-secondary-900 text-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              Resources & Insights
            </h1>
            <p className="text-secondary-300 text-lg max-w-2xl">
              Explore our collection of articles, blogs and industry news to help you succeed in the design marketplace.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm border border-secondary-200 mb-8 p-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="search"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                  />
                </div>
                <select
                  value={selectedContentType}
                  onChange={(e) => {
                    setSelectedContentType(e.target.value as ContentType | '');
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {(categories as Record<string, unknown>[]).map((cat) => (
                    <option key={cat.id as string | number} value={cat.id as string | number}>
                      {(cat?.name as string | undefined) ?? 'Unnamed'}
                    </option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none"
                >
                  <option value="publishedAt-desc">Newest First</option>
                  <option value="publishedAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="likeCount-desc">Most Liked</option>
                </select>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
                <button 
                  type="button" 
                  onClick={clearFilters}
                  className="px-6 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Tags Filter */}
                  {tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-secondary-600 mb-2">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <button
                      key={(tag as Record<string, unknown>).id as string | number}
                      onClick={() => handleTagToggle(String((tag as Record<string, unknown>).id))}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(String((tag as Record<string, unknown>).id))
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                      }`}
                    >
                      {(tag as Record<string, unknown>).name as string} ({(tag as Record<string, unknown>).count as number})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-secondary-600">
              {isLoading ? 'Loading...' : `${totalCount} resources found`}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <ErrorMessage 
              message={error instanceof Error ? error.message : 'Failed to load resources'}
              retry={refetch}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <TutorialsSkeleton />
          )}

          {/* Content Grid */}
          {!isLoading && !error && (
            <>
              {content.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-12 text-center">
                  <p className="text-secondary-500 text-lg">
                    No resources found matching your criteria.
                  </p>
                  <button 
                    onClick={clearFilters} 
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item) => {
                    const itemRecord = item as Record<string, unknown>;
                    const contentTypeValue = (itemRecord.type ?? itemRecord.content_type ?? itemRecord.resource_type ?? '') as string;
                  return (
                      <Link key={itemRecord.id as number} href={`/resources/${getTypeSlug(contentTypeValue)}/${itemRecord.slug as string}`}>
                        <div className="h-full relative bg-white rounded-lg shadow-sm border border-secondary-200 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer overflow-hidden group">
                        {/* Featured Image */}
                        <div className="relative h-48 bg-secondary-200">
                          {itemRecord.featuredImageUrl ? (
                            <Image
                              src={itemRecord.featuredImageUrl as string}
                              alt={itemRecord.title as string}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-secondary-400">
                              <svg
                                className="w-16 h-16"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          {/* Content Type Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getContentTypeBadge(contentTypeValue as ContentType).bg} ${getContentTypeBadge(contentTypeValue as ContentType).text}`}>
                              {contentTypeValue}
                            </span>
                          </div>
                          {!!(itemRecord.isFeatured) && (
                            <div className="absolute top-3 right-3">
                              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-warning-500 text-white">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Category */}
                          {!!(itemRecord.category) && (
                            <p className="text-xs text-primary-600 font-medium mb-2">
                              {((itemRecord.category as Record<string, unknown>)?.name ?? 'Uncategorized') as string}
                            </p>
                          )}

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {itemRecord.title as string}
                          </h3>

                          {!!(itemRecord.excerpt) && (
                            <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                              {itemRecord.excerpt as string}
                            </p>
                          )}

                          <div className="border-t border-secondary-200 my-4" />

                          {/* Footer */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-secondary-500">
                                {!!(itemRecord.publishedAt) ? formatDate(itemRecord.publishedAt as string) : 'Draft'}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-secondary-400">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs">{(itemRecord.viewCount || 0) as number}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs">{(itemRecord.likeCount || 0) as number}</span>
                              </div>
                              {!!(itemRecord.readingTimeMinutes) && (
                                <span className="text-xs">{itemRecord.readingTimeMinutes as number} min read</span>
                              )}
                            </div>
                          </div>

                          {/* Tags */}
                          {!!(itemRecord.tags && Array.isArray(itemRecord.tags) && (itemRecord.tags as unknown[]).length > 0) && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {(itemRecord.tags as Record<string, unknown>[]).slice(0, 3).map((tag) => (
                                <span
                                  key={tag.id as number}
                                  className="inline-block px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded"
                                >
                                  {(tag?.name ?? 'tag') as string}
                                </span>
                              ))}
                              {!!(Array.isArray(itemRecord.tags) && (itemRecord.tags as unknown[]).length > 3) && (
                                <span className="inline-block px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded">
                                  +{(itemRecord.tags as unknown[]).length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Admin Edit Button (visible to admins) */}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Open admin dashboard in same window
                              window.location.href = `${ENV.ADMIN_DASHBOARD_URL}/admin/resources/${itemRecord.id as number}/edit`;
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-primary-600 text-white text-xs rounded font-medium hover:bg-primary-700"
                            title="Edit this resource"
                          >
                            ✎ Edit
                          </button>
                        )}
                      </div>
                    </Link>

                  )
                  }
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'border border-secondary-300 hover:bg-secondary-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

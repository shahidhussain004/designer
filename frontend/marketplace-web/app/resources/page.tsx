'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCategories, useContent, useTags } from '@/hooks/useContent';
import type { ContentType } from '@/lib/content-types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

const CONTENT_TYPES: { value: ContentType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'BLOG', label: 'Blog Posts' },
  { value: 'ARTICLE', label: 'Articles' },
  { value: 'NEWS', label: 'News' },
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
    const f: any = {
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

  const { data: contentData, isLoading, error, refetch } = useContent(filters);
  
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

  const getContentTypeBadge = (type: ContentType) => {
    const styles: Record<ContentType, { bg: string; text: string }> = {
      BLOG: { bg: 'bg-blue-100', text: 'text-blue-800' },
      ARTICLE: { bg: 'bg-green-100', text: 'text-green-800' },
      NEWS: { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    return styles[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  return (
    <PageLayout title="Resources | Designer Marketplace">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gray-900 text-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              Resources & Insights
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Explore our collection of articles, tutorials, and industry insights
              to help you succeed in the design marketplace.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="search"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
                <select
                  value={selectedContentType}
                  onChange={(e) => {
                    setSelectedContentType(e.target.value as ContentType | '');
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">
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
                  {content.map((item: any) => (
                    <Link key={item.id} href={`/resources/${item.slug}`}>
                      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer overflow-hidden group">
                        {/* Featured Image */}
                        <div className="relative h-48 bg-gray-200">
                          {item.featuredImageUrl ? (
                            <Image
                              src={item.featuredImageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
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
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getContentTypeBadge(item.type).bg} ${getContentTypeBadge(item.type).text}`}>
                              {item.type}
                            </span>
                          </div>
                          {item.isFeatured && (
                            <div className="absolute top-3 right-3">
                              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-amber-500 text-white">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Category */}
                          {item.category && (
                            <p className="text-xs text-primary-600 font-medium mb-2">
                              {item.category.name}
                            </p>
                          )}

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {item.title}
                          </h3>

                          {item.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {item.excerpt}
                            </p>
                          )}

                          <div className="border-t border-gray-200 my-4" />

                          {/* Footer */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {item.author?.avatarUrl && (
                                <Image
                                  src={item.author.avatarUrl}
                                  alt={item.author?.bio || 'Author'}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              )}
                              <p className="text-xs text-gray-500">
                                {item.publishedAt ? formatDate(item.publishedAt) : 'Draft'}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs">{item.viewCount || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs">{item.likeCount || 0}</span>
                              </div>
                              {item.readingTimeMinutes && (
                                <span className="text-xs">{item.readingTimeMinutes} min read</span>
                              )}
                            </div>
                          </div>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.tags.slice(0, 3).map((tag: any) => (
                                <span
                                  key={tag.id}
                                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                >
                                  {tag.name}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{item.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              : 'border border-gray-300 hover:bg-gray-50'
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
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

'use client';

import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Input,
    Spinner,
    Text,
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { categoriesApi, contentApi, tagsApi } from '@/lib/content-api';
import type { Category, ContentType, ContentWithRelations, Tag } from '@/lib/content-types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

const CONTENT_TYPES: { value: ContentType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'BLOG', label: 'Blog Posts' },
  { value: 'ARTICLE', label: 'Articles' },
  { value: 'NEWS', label: 'News' },
];

export default function ResourcesPage() {
  const [content, setContent] = useState<ContentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Categories and tags for filters
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<ContentType | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch categories and tags on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cats, tagsData] = await Promise.all([
          categoriesApi.getAll(),
          tagsApi.getAll(),
        ]);
        setCategories(cats);
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const result = await contentApi.getPublished({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        filters: {
          contentType: selectedContentType || undefined,
          categoryId: selectedCategory || undefined,
          tagIds: selectedTags.length > 0 ? selectedTags : undefined,
          search: searchQuery || undefined,
        },
      });

      setContent(result.data);
      setTotalCount(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, selectedContentType, selectedCategory, selectedTags, searchQuery]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContent();
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Text tag="h1" className="text-3xl font-bold mb-4">
              Resources & Insights
            </Text>
            <Text className="text-green-100 max-w-2xl">
              Explore our collection of articles, tutorials, and industry insights
              to help you succeed in the design marketplace.
            </Text>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <Card className="mb-8 p-6">
            <form onSubmit={handleSearch}>
              <Flex className="flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedContentType}
                  onChange={(e) => {
                    setSelectedContentType(e.target.value as ContentType | '');
                    setPage(1);
                  }}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
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
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="publishedAt-desc">Newest First</option>
                  <option value="publishedAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="likeCount-desc">Most Liked</option>
                </select>
                <Button type="submit" rank="primary">
                  Search
                </Button>
                <Button type="button" rank="tertiary" onClick={clearFilters}>
                  Clear
                </Button>
              </Flex>
            </form>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="mt-4">
                <Text className="text-sm text-gray-600 mb-2">Filter by tags:</Text>
                <Flex className="flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <Badge
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </Flex>
              </div>
            )}
          </Card>

          {/* Results Summary */}
          <Flex className="justify-between items-center mb-6">
            <Text className="text-gray-600">
              {loading ? 'Loading...' : `${totalCount} resources found`}
            </Text>
          </Flex>

          {/* Error State */}
          {error && (
            <Card className="p-8 text-center mb-8">
              <Text className="text-red-600 mb-4">{error}</Text>
              <Button onClick={fetchContent}>Try Again</Button>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Flex className="justify-center py-12">
              <Spinner />
            </Flex>
          )}

          {/* Content Grid */}
          {!loading && !error && (
            <>
              {content.length === 0 ? (
                <Card className="p-12 text-center">
                  <Text className="text-gray-500 text-lg">
                    No resources found matching your criteria.
                  </Text>
                  <Button onClick={clearFilters} className="mt-4" rank="primary">
                    Clear Filters
                  </Button>
                </Card>
              ) : (
                <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item) => (
                    <Link key={item.id} href={`/resources/${item.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        {/* Featured Image */}
                        <div className="relative h-48 bg-gray-200">
                          {item.featuredImageUrl ? (
                            <Image
                              src={item.featuredImageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
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
                            <Badge
                              className={`${getContentTypeBadge(item.type).bg} ${
                                getContentTypeBadge(item.type).text
                              }`}
                            >
                              {item.type}
                            </Badge>
                          </div>
                          {item.isFeatured && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-amber-500 text-white">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Category */}
                          {item.category && (
                            <Text className="text-xs text-green-600 font-medium mb-2">
                              {item.category.name}
                            </Text>
                          )}

                          <Text tag="h3" className="font-semibold text-lg mb-2 line-clamp-2">
                            {item.title}
                          </Text>

                          {item.excerpt && (
                            <Text className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {item.excerpt}
                            </Text>
                          )}

                          <Divider className="my-4" />

                          {/* Footer */}
                          <Flex className="justify-between items-center">
                            <Flex className="items-center gap-2">
                              {item.author?.avatarUrl && (
                                <Image
                                  src={item.author.avatarUrl}
                                  alt={item.author?.bio || 'Author'}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              )}
                              <Text className="text-xs text-gray-500">
                                {item.publishedAt ? formatDate(item.publishedAt) : 'Draft'}
                              </Text>
                            </Flex>
                            <Flex className="items-center gap-3 text-gray-400">
                              <Flex className="items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <Text className="text-xs">{item.viewCount || 0}</Text>
                              </Flex>
                              <Flex className="items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <Text className="text-xs">{item.likeCount || 0}</Text>
                              </Flex>
                              {item.readingTimeMinutes && (
                                <Text className="text-xs">{item.readingTimeMinutes} min read</Text>
                              )}
                            </Flex>
                          </Flex>

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <Flex className="flex-wrap gap-1 mt-3">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag.id}
                                  className="text-xs bg-gray-100 text-gray-600"
                                >
                                  {tag.name}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge className="text-xs bg-gray-100 text-gray-600">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </Flex>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </Grid>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Flex className="justify-center gap-2 mt-8">
                  <Button
                    rank="secondary"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Flex className="items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          rank={page === pageNum ? 'primary' : 'tertiary'}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </Flex>
                  <Button
                    rank="secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </Flex>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

'use client';

import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Spinner,
    Text,
} from '@/components/green';
import { PageLayout } from '@/components/layout';
import { commentsApi, contentApi } from '@/lib/content-api';
import type { Comment, ContentWithRelations } from '@/lib/content-types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [content, setContent] = useState<ContentWithRelations | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await contentApi.getBySlug(slug);
        setContent(data);
        
        // Track view
        contentApi.trackView(data.id).catch(console.error);
        
        // Fetch comments
        const commentsData = await commentsApi.getByContent(data.id);
        setComments(commentsData.data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Resource not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  const handleLike = async () => {
    if (!content) return;
    try {
      await contentApi.like(content.id);
      setContent((prev) =>
        prev ? { ...prev, likeCount: (prev.likeCount || 0) + 1 } : null
      );
    } catch (err) {
      console.error('Error liking content:', err);
    }
  };

  const handleShare = async () => {
    if (!content) return;
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.excerpt || '',
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await commentsApi.create({
        contentId: content.id,
        body: newComment,
      });
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getContentTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      BLOG: { bg: 'bg-blue-100', text: 'text-blue-800' },
      ARTICLE: { bg: 'bg-green-100', text: 'text-green-800' },
      NEWS: { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    return styles[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  if (loading) {
    return (
      <PageLayout title="Loading... | Designer Marketplace">
        <Flex className="min-h-screen items-center justify-center">
          <Spinner />
        </Flex>
      </PageLayout>
    );
  }

  if (error || !content) {
    return (
      <PageLayout title="Not Found | Designer Marketplace">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Text className="text-red-600 text-xl mb-4">
              {error || 'Resource not found'}
            </Text>
            <Button onClick={() => router.push('/resources')}>
              Back to Resources
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${content.title} | Designer Marketplace`}>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Flex className="items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-green-600">
                Resources
              </Link>
              <span>/</span>
              <span className="text-gray-900 truncate">{content.title}</span>
            </Flex>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Meta */}
          <Flex className="items-center gap-3 mb-4">
            <Badge
              className={`${getContentTypeBadge(content.type).bg} ${
                getContentTypeBadge(content.type).text
              }`}
            >
              {content.type}
            </Badge>
            {content.category && (
              <Badge className="bg-gray-100 text-gray-700">
                {content.category.name}
              </Badge>
            )}
            {content.isFeatured && (
              <Badge className="bg-amber-500 text-white">Featured</Badge>
            )}
          </Flex>

          {/* Title */}
          <Text tag="h1" className="text-4xl font-bold mb-4">
            {content.title}
          </Text>

          {/* Excerpt */}
          {content.excerpt && (
            <Text className="text-xl text-gray-600 mb-6">{content.excerpt}</Text>
          )}

          {/* Author & Date */}
          <Flex className="items-center justify-between mb-8">
            <Flex className="items-center gap-3">
              {content.author?.avatarUrl && (
                <Image
                  src={content.author.avatarUrl}
                  alt={content.author?.bio || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                {content.author?.bio && (
                  <Text className="font-medium">{content.author.bio}</Text>
                )}
                <Text className="text-sm text-gray-500">
                  {content.publishedAt ? formatDate(content.publishedAt) : 'Draft'}
                  {content.readingTimeMinutes && (
                    <span> · {content.readingTimeMinutes} min read</span>
                  )}
                </Text>
              </div>
            </Flex>

            {/* Actions */}
            <Flex className="gap-2">
              <Button rank="tertiary" onClick={handleLike} className="gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {content.likeCount || 0}
              </Button>
              <Button rank="tertiary" onClick={handleShare}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </Button>
            </Flex>
          </Flex>

          {/* Featured Image */}
          {content.featuredImageUrl && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={content.featuredImageUrl}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <Card className="p-8 mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600"
              dangerouslySetInnerHTML={{ __html: content.body || '' }}
            />
          </Card>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="mb-8">
              <Text className="font-medium mb-3">Tags:</Text>
              <Flex className="flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/resources?tag=${tag.id}`}
                    className="hover:opacity-80"
                  >
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </Flex>
            </div>
          )}

          {/* Stats */}
          <Card className="p-4 mb-8 bg-gray-50">
            <Flex className="justify-around text-center">
              <div>
                <Text className="text-2xl font-bold text-green-600">
                  {content.viewCount || 0}
                </Text>
                <Text className="text-sm text-gray-500">Views</Text>
              </div>
              <div>
                <Text className="text-2xl font-bold text-red-500">
                  {content.likeCount || 0}
                </Text>
                <Text className="text-sm text-gray-500">Likes</Text>
              </div>
              <div>
                <Text className="text-2xl font-bold text-blue-500">
                  {content.shareCount || 0}
                </Text>
                <Text className="text-sm text-gray-500">Shares</Text>
              </div>
              <div>
                <Text className="text-2xl font-bold text-purple-500">
                  {comments.length}
                </Text>
                <Text className="text-sm text-gray-500">Comments</Text>
              </div>
            </Flex>
          </Card>

          <Divider className="my-8" />

          {/* Comments Section */}
          <section>
            <Text tag="h2" className="text-2xl font-bold mb-6">
              Comments ({comments.length})
            </Text>

            {/* Comment Form */}
            <Card className="p-6 mb-8">
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
                <Flex className="justify-end mt-3">
                  <Button
                    type="submit"
                    rank="primary"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? 'Submitting...' : 'Post Comment'}
                  </Button>
                </Flex>
              </form>
            </Card>

            {/* Comments List */}
            {comments.length === 0 ? (
              <Card className="p-8 text-center">
                <Text className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </Text>
              </Card>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-5">
                    <Flex className="gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <Flex className="items-center gap-2 mb-2">
                          <Text className="font-medium">
                            {comment.authorId || 'Anonymous'}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </Text>
                          {comment.isEdited && (
                            <Badge className="text-xs bg-gray-100 text-gray-500">
                              Edited
                            </Badge>
                          )}
                        </Flex>
                        <Text className="text-gray-700">{comment.body}</Text>
                        <Flex className="items-center gap-4 mt-3 text-sm text-gray-500">
                          <button className="hover:text-green-600">
                            <Flex className="items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              Like ({comment.likeCount || 0})
                            </Flex>
                          </button>
                          <button className="hover:text-green-600">Reply</button>
                        </Flex>
                      </div>
                    </Flex>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Navigation */}
          <Flex className="justify-between mt-12">
            <Button
              rank="tertiary"
              onClick={() => router.push('/resources')}
              className="gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Resources
            </Button>
          </Flex>
        </article>
      </div>
    </PageLayout>
  );
}

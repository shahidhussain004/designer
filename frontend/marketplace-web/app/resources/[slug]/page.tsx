'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useComments, useCreateComment, useIncrementViews, useLikeContent, useResource } from '@/hooks/useContent';
import { ArrowLeft, Heart, Share2, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [newComment, setNewComment] = useState('');

  const { data: content, isLoading, error, refetch } = useResource(slug);
  const { data: commentsData } = useComments(content?.id || null);
  const createCommentMutation = useCreateComment();
  const likeMutation = useLikeContent();
  const incrementViewsMutation = useIncrementViews();

  const comments = commentsData?.data || [];

  // Track view when content loads
  useEffect(() => {
    if (content?.id) {
      incrementViewsMutation.mutate(content.id);
    }
  }, [content?.id]);

  const handleLike = async () => {
    if (!content) return;
    try {
      await likeMutation.mutateAsync(content.id);
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
      await createCommentMutation.mutateAsync({
        contentId: content.id,
        input: { 
          contentId: content.id.toString(),
          body: newComment 
        },
      });
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
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

  if (isLoading) {
    return (
      <PageLayout title="Loading... | Designer Marketplace">
        <TutorialsSkeleton />
      </PageLayout>
    );
  }

  if (error || !content) {
    return (
      <PageLayout title="Not Found | Designer Marketplace">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {error ? (
            <ErrorMessage message={error.message} retry={refetch} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md">
              <p className="text-red-600 text-xl mb-4">Resource not found</p>
              <button
                onClick={() => router.push('/resources')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Back to Resources
              </button>
            </div>
          )}
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-primary-600">
                Resources
              </Link>
              <span>/</span>
              <span className="text-gray-900 truncate">{content.title}</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContentTypeBadge(content.type).bg} ${getContentTypeBadge(content.type).text}`}>
              {content.type}
            </span>
            {content.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {content.category.name}
              </span>
            )}
            {content.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          {/* Excerpt */}
          {content.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{content.excerpt}</p>
          )}

          {/* Author & Date */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
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
                  <p className="font-medium text-gray-900">{content.author.bio}</p>
                )}
                <p className="text-sm text-gray-500">
                  {content.publishedAt ? formatDate(content.publishedAt) : 'Draft'}
                  {content.readingTimeMinutes && (
                    <span> · {content.readingTimeMinutes} min read</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {content.likeCount || 0}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600"
              dangerouslySetInnerHTML={{ __html: content.body || '' }}
            />
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="mb-8">
              <p className="font-medium text-gray-900 mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    href={`/resources?tag=${tag.id}`}
                    className="hover:opacity-80"
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                      #{tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-8">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {content.viewCount || 0}
                </p>
                <p className="text-sm text-gray-500">Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {content.likeCount || 0}
                </p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {content.shareCount || 0}
                </p>
                <p className="text-sm text-gray-500">Shares</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">
                  {comments.length}
                </p>
                <p className="text-sm text-gray-500">Comments</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Comments Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none outline-none"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={createCommentMutation.isPending || !newComment.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createCommentMutation.isPending ? 'Submitting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex gap-4">
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
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-gray-900">
                            {comment.authorId || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                          {comment.isEdited && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                              Edited
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{comment.body}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <button className="hover:text-primary-600 flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            Like ({comment.likeCount || 0})
                          </button>
                          <button className="hover:text-primary-600">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => router.push('/resources')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Resources
            </button>
          </div>
        </article>
      </div>
    </PageLayout>
  );
}

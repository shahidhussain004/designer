"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { TutorialsSkeleton } from '@/components/Skeletons';
import { Breadcrumb, PageLayout } from '@/components/ui';
import { useComments, useContentSlug, useCreateComment, useLikeContent } from '@/hooks/useContent';
import { ArrowLeft, Heart, Share2, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ResourceCatchAllPage() {
  const params = useParams();
  const router = useRouter();

  // params.slug may be string | string[] | undefined for catch-all
  const raw = params?.slug as string | string[] | undefined;
  let slug: string | undefined = undefined;

  // Extract slug from catch-all
  // For /resources/blogs/my-slug, raw = ['blogs', 'my-slug'], we want slug = 'my-slug'
  // For /resources/my-slug, raw = ['my-slug'], we want slug = 'my-slug'
  if (Array.isArray(raw)) {
    // Always take the last element as the slug
    slug = raw[raw.length - 1];
  } else if (typeof raw === 'string') {
    slug = raw;
  }

  const [newComment, setNewComment] = useState('');

  const { data: content, isLoading, error, refetch } = useContentSlug(slug || null);
  const { data: commentsData } = useComments(content?.id || null);
  const createCommentMutation = useCreateComment();
  const likeMutation = useLikeContent();

  const comments = commentsData?.data || [];
  
  const handleLike = async () => {
    if (!content) return;
    try { await likeMutation.mutateAsync(content.id); } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    if (!content) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: content.title, text: content.excerpt || '', url }); } catch (err) { console.error(err); }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !newComment.trim()) return;
    try {
      await createCommentMutation.mutateAsync({ contentId: content.id, input: { contentId: content.id.toString(), body: newComment } });
      setNewComment('');
    } catch (err) { console.error(err); alert('Failed to submit comment.'); }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const getContentTypeBadge = (t: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      blog: { bg: 'bg-blue-100', text: 'text-blue-800' },
      article: { bg: 'bg-green-100', text: 'text-green-800' },
      news: { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    return styles[t?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const formatResourceType = (t?: string) => {
    if (!t) return 'Unknown';
    const map: Record<string, string> = {
      blog: 'Blog',
      article: 'Article',
      news: 'News',
    };
    return map[t.toLowerCase()] || t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  };

  const getTypeSlug = (contentType?: string) => {
    const map: Record<string, string> = {
      blog: 'blogs',
      article: 'articles',
      news: 'news',
    };
    return map[contentType?.toLowerCase() || ''] || contentType?.toLowerCase() || '';
  };

  if (isLoading) return <TutorialsSkeleton />;
  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {error ? <ErrorMessage message={error.message} retry={refetch} /> : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md">
            <p className="text-red-600 text-xl mb-4">Resource not found</p>
            <button onClick={() => router.push('/resources')} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Back to Resources</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <PageLayout title={`${content.title} | Resources | Designer Marketplace`}>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gray-900 text-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            {content.excerpt && (
              <p className="text-gray-300 text-lg max-w-2xl">
                {content.excerpt}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: 'Resources', href: '/resources' },
                { label: formatResourceType(content.content_type), href: `/resources/${getTypeSlug(content.content_type)}` },
                { label: content.title, href: `#` },
              ]}
            />
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContentTypeBadge(content.type).bg} ${getContentTypeBadge(content.type).text}`}>{content.type}</span>
          {content.category && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">{content.category?.name ?? 'Uncategorized'}</span>}
          {content.isFeatured && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-white">Featured</span>}
        </div>

        {/* title and excerpt shown in page header above */}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {content.author?.avatarUrl && <Image src={content.author.avatarUrl} alt={content.author?.bio || 'Author'} width={48} height={48} className="rounded-full" />}
            <div>
              {content.author?.bio && <p className="font-medium text-gray-900">{content.author.bio}</p>}
              <p className="text-sm text-gray-500">{content.publishedAt ? formatDate(content.publishedAt) : 'Draft'}{content.readingTimeMinutes && <span> · {content.readingTimeMinutes} min read</span>}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleLike} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"><Heart className="w-5 h-5" />{content.likeCount || 0}</button>
            <button onClick={handleShare} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>

        {content.featuredImageUrl && <div className="relative h-96 rounded-lg overflow-hidden mb-8"><Image src={content.featuredImageUrl} alt={content.title} fill className="object-cover" /></div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"><div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content.body || '' }} /></div>

        {content.tags && content.tags.length > 0 && (
          <div className="mb-8">
            <p className="font-medium text-gray-900 mb-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag: any) => (
                <Link key={tag.id} href={`/resources?tag=${tag.id}`} className="hover:opacity-80"><span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">#{tag?.name ?? 'tag'}</span></Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex justify-around text-center">
            <div><p className="text-2xl font-bold text-primary-600">{content.viewCount || 0}</p><p className="text-sm text-gray-500">Views</p></div>
            <div><p className="text-2xl font-bold text-red-500">{content.likeCount || 0}</p><p className="text-sm text-gray-500">Likes</p></div>
            <div><p className="text-2xl font-bold text-blue-500">{content.shareCount || 0}</p><p className="text-sm text-gray-500">Shares</p></div>
            <div><p className="text-2xl font-bold text-purple-500">{comments.length}</p><p className="text-sm text-gray-500">Comments</p></div>
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <form onSubmit={handleSubmitComment}>
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." className="w-full p-4 border border-gray-300 rounded-lg resize-none outline-none" rows={4} />
              <div className="flex justify-end mt-3"><button type="submit" disabled={createCommentMutation.isPending || !newComment.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">{createCommentMutation.isPending ? 'Submitting...' : 'Post Comment'}</button></div>
            </form>
          </div>

          {comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"><p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p></div>
          ) : (
            <div className="space-y-4">{comments.map((comment: any) => (<div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"><div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div><div className="flex-1"><div className="flex items-center gap-2 mb-2"><p className="font-medium text-gray-900">{comment.authorId || 'Anonymous'}</p><p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>{comment.isEdited && (<span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">Edited</span>)}</div><p className="text-gray-700">{comment.body}</p><div className="flex items-center gap-4 mt-3 text-sm text-gray-500"><button className="hover:text-primary-600 flex items-center gap-1"><ThumbsUp className="w-4 h-4"/>Like ({comment.likeCount || 0})</button><button className="hover:text-primary-600">Reply</button></div></div></div></div>))}</div>
          )}
        </section>

        <div className="flex justify-between mt-12"><button onClick={() => router.push('/resources')} className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"><ArrowLeft className="w-5 h-5"/>Back to Resources</button></div>
      </article>
      </div>
    </PageLayout>
  );
}

'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { getSavedJobsCount } from '@/lib/jobs';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Saved Jobs link with count badge for navbar
 * Only shown for FREELANCER users
 */
export function SavedJobsLink() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [_isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only load saved jobs for freelancers
    if (user?.role === 'FREELANCER') {
      loadCount();
    } else {
      setCount(0);
    }
  }, [user]);

  const loadCount = async () => {
    setIsLoading(true);
    try {
      const savedCount = await getSavedJobsCount();
      setCount(savedCount);
    } catch (error) {
      console.error('Failed to load saved jobs count:', error);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for authenticated FREELANCER users
  if (!user || user.role !== 'FREELANCER') {
    return null;
  }

  return (
    <Link
      href="/jobs/saved"
      className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors rounded-lg hover:bg-secondary-50"
      title="Saved Jobs"
    >
      <Heart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-primary-600 rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

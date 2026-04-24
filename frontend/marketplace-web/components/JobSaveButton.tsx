'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { saveJob, unsaveJob } from '@/lib/jobs';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface JobSaveButtonProps {
  jobId: string | number;
  initialSaved?: boolean;
  onSaveChange?: (isSaved: boolean) => void;
  className?: string;
}

/**
 * Button to save/favorite a job
 * Shows heart icon that fills when saved
 * Only shown and functional for FREELANCER users
 */
export function JobSaveButton({ 
  jobId, 
  initialSaved = false, 
  onSaveChange,
  className = '' 
}: JobSaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Only show for freelancers
  if (user && user.role !== 'FREELANCER') {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking on the button
    e.stopPropagation(); // Stop event from bubbling to parent Link

    // Require freelancer login
    if (!user) {
      router.push('/auth/login?redirect=/jobs');
      return;
    }

    // Only freelancers can save jobs
    if (user.role !== 'FREELANCER') {
      console.warn('Only freelancers can save jobs');
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
        onSaveChange?.(false);
        console.log(`Job ${jobId} unsaved`);
      } else {
        await saveJob(jobId);
        setIsSaved(true);
        onSaveChange?.(true);
        console.log(`Job ${jobId} saved`);
      }
    } catch (error) {
      console.error('Failed to toggle save status:', error);
      // Revert on error (optimistic update rollback)
      // We don't revert here to keep it simple, but you could
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group/save p-2 rounded-lg transition-all hover:bg-secondary-100 ${className}`}
      title={isSaved ? 'Unsave job' : 'Save job'}
      aria-label={isSaved ? 'Unsave job' : 'Save job'}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          isSaved 
            ? 'fill-red-500 text-red-500' 
            : 'text-secondary-400 group-hover/save:text-red-500'
        } ${isLoading ? 'opacity-50' : ''}`}
      />
    </button>
  );
}

import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { Suspense } from 'react'
import JobsContent from './jobs-content'

export default function JobsPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner /></div>}>
        <JobsContent />
      </Suspense>
    </PageLayout>
  )
}

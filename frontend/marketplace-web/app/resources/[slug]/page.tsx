import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { Suspense } from 'react'
import ResourceContent from './resource-content'

export default function ResourceDetailPage() {
  return (
    <PageLayout title="Resource | Designer Marketplace">
      <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner /></div>}>
        <ResourceContent />
      </Suspense>
    </PageLayout>
  )
}

import { LoadingSpinner } from '@/components/Skeletons'
import { PageLayout } from '@/components/ui'
import { Suspense } from 'react'
import TalentsContent from './talents-content'

export default function TalentsPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner /></div>}>
        <TalentsContent />
      </Suspense>
    </PageLayout>
  )
}

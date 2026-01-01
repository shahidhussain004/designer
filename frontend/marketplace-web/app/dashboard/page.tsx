'use server'

import { PageLayout } from '@/components/ui'
import Link from 'next/link'

export default async function DashboardPage() {
  // Render a simple server-side landing with links to role-specific dashboards.
  // The client-side auth flow will redirect users after mount; this ensures
  // the page exists during build-time page data collection.
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-8">Choose your dashboard view:</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard/client" className="px-4 py-2 bg-blue-600 text-white rounded">Client Dashboard</Link>
          <Link href="/dashboard/freelancer" className="px-4 py-2 bg-gray-100 text-gray-800 rounded">Freelancer Dashboard</Link>
        </div>
      </div>
    </PageLayout>
  )
}

'use client'

import { PageLayout } from '@/components/ui'
import LandingPage from './landing/page'

export default function Home() {
  return (
    <PageLayout showNavbar={true}>
      <LandingPage />
    </PageLayout>
  )
}

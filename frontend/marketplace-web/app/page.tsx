'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { GdsFlex, GdsGrid, GdsCard, GdsText, GdsDiv, GdsButton, GdsDialog, GdsLink } from '@sebgroup/green-core/react'
import { PageLayout } from '@/components/layout'
import ClientOnly from '@/components/layout/ClientOnly'
import LandingPage from './landing/page'

export default function Home() {
  const dialogRef = useRef<any>(null)
  const [hasShownModal, setHasShownModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we only run on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !hasShownModal && dialogRef.current) {
      // Small delay to ensure web components are registered
      const timer = setTimeout(() => {
        dialogRef.current.show()
        setHasShownModal(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isClient, hasShownModal])

  const handleCloseModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close()
    }
  }

  return (
    <PageLayout showNavbar={false}>
      <ClientOnly fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      {/* Hero Section */}
      <LandingPage />

      {/* Main Content */}
      <GdsDiv padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        {/* Feature Cards */}
        <GdsGrid columns="1; m{2}; l{4}" gap="m" margin-bottom="xl">
          <Link href="/jobs/create" style={{ textDecoration: 'none' } as any}>
            <GdsCard padding="l" variant="secondary" height="100%">
              <GdsFlex flex-direction="column" gap="m" height="100%">
                <GdsText font="heading-m">Post a Job</GdsText>
                <GdsText font="body-regular-m" color="neutral-02">
                  Describe your project and find the perfect freelancer
                </GdsText>
                <GdsDiv margin-top="auto">
                  <GdsButton rank="primary" size="small">
                    Get Started
                  </GdsButton>
                </GdsDiv>
              </GdsFlex>
            </GdsCard>
          </Link>

          <Link href="/freelancers" style={{ textDecoration: 'none' } as any}>
            <GdsCard padding="l" variant="secondary" height="100%">
              <GdsFlex flex-direction="column" gap="m" height="100%">
                <GdsText font="heading-m">Browse Talent</GdsText>
                <GdsText font="body-regular-m" color="neutral-02">
                  Explore profiles of skilled designers and developers
                </GdsText>
                <GdsDiv margin-top="auto">
                  <GdsButton rank="primary" size="small">
                    Find Talent
                  </GdsButton>
                </GdsDiv>
              </GdsFlex>
            </GdsCard>
          </Link>

          <Link href="/jobs" style={{ textDecoration: 'none' } as any}>
            <GdsCard padding="l" variant="secondary" height="100%">
              <GdsFlex flex-direction="column" gap="m" height="100%">
                <GdsText font="heading-m">Find Work</GdsText>
                <GdsText font="body-regular-m" color="neutral-02">
                  Browse available jobs and submit proposals
                </GdsText>
                <GdsDiv margin-top="auto">
                  <GdsButton rank="primary" size="small">
                    View Jobs
                  </GdsButton>
                </GdsDiv>
              </GdsFlex>
            </GdsCard>
          </Link>

          <Link href="/courses" style={{ textDecoration: 'none' } as any}>
            <GdsCard padding="l" variant="notice" height="100%">
              <GdsFlex flex-direction="column" gap="m" height="100%">
                <GdsText font="heading-m">Learn Skills</GdsText>
                <GdsText font="body-regular-m" color="neutral-02">
                  Take courses from industry experts
                </GdsText>
                <GdsDiv margin-top="auto">
                  <GdsButton rank="secondary" variant="notice" size="small">
                    Browse Courses
                  </GdsButton>
                </GdsDiv>
              </GdsFlex>
            </GdsCard>
          </Link>
        </GdsGrid>

        {/* How it Works Section */}
        <GdsCard padding="xl" variant="tertiary" margin-bottom="xl">
          <GdsText tag="h2" font="heading-l" text-align="center" margin-bottom="l">
            How it Works
          </GdsText>
          <GdsGrid columns="1; m{2}; l{4}" gap="l">
            <GdsFlex flex-direction="column" align-items="center" gap="m" text-align="center">
              <GdsFlex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <GdsText font="heading-m" color="inversed">1</GdsText>
              </GdsFlex>
              <GdsText font="heading-s">Post Your Project</GdsText>
              <GdsText font="body-regular-s" color="neutral-02">
                Describe what you need and set your budget
              </GdsText>
            </GdsFlex>

            <GdsFlex flex-direction="column" align-items="center" gap="m" text-align="center">
              <GdsFlex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <GdsText font="heading-m" color="inversed">2</GdsText>
              </GdsFlex>
              <GdsText font="heading-s">Review Proposals</GdsText>
              <GdsText font="body-regular-s" color="neutral-02">
                Get bids from qualified freelancers
              </GdsText>
            </GdsFlex>

            <GdsFlex flex-direction="column" align-items="center" gap="m" text-align="center">
              <GdsFlex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <GdsText font="heading-m" color="inversed">3</GdsText>
              </GdsFlex>
              <GdsText font="heading-s">Fund Milestones</GdsText>
              <GdsText font="body-regular-s" color="neutral-02">
                Securely deposit funds into escrow
              </GdsText>
            </GdsFlex>

            <GdsFlex flex-direction="column" align-items="center" gap="m" text-align="center">
              <GdsFlex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <GdsText font="heading-m" color="inversed">4</GdsText>
              </GdsFlex>
              <GdsText font="heading-s">Approve &amp; Pay</GdsText>
              <GdsText font="body-regular-s" color="neutral-02">
                Release payment when work is complete
              </GdsText>
            </GdsFlex>
          </GdsGrid>
        </GdsCard>

        {/* Featured Courses Section */}
        <GdsDiv margin-bottom="xl">
          <GdsFlex justify-content="space-between" align-items="center" margin-bottom="l">
            <GdsText tag="h2" font="heading-l">Learn New Skills</GdsText>
            <Link href="/courses" style={{ textDecoration: 'none' } as any}>
              <GdsText font="body-regular-m" color="brand-01">
                View all courses →
              </GdsText>
            </Link>
          </GdsFlex>
          <GdsGrid columns="1; m{2}; l{3}" gap="m">
            <GdsCard padding="0" variant="secondary" overflow="hidden">
              <GdsDiv background="notice-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <GdsText font="heading-2xl">🎨</GdsText>
              </GdsDiv>
              <GdsDiv padding="l">
                <GdsText font="detail-regular-s" color="brand-01">UI/UX Design</GdsText>
                <GdsText font="heading-s" margin-top="xs">Master Modern UI Design</GdsText>
                <GdsText font="body-regular-s" color="neutral-02" margin-top="s">
                  12 lessons • 4h 30m
                </GdsText>
              </GdsDiv>
            </GdsCard>

            <GdsCard padding="0" variant="secondary" overflow="hidden">
              <GdsDiv background="positive-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <GdsText font="heading-2xl">💻</GdsText>
              </GdsDiv>
              <GdsDiv padding="l">
                <GdsText font="detail-regular-s" color="brand-01">Web Development</GdsText>
                <GdsText font="heading-s" margin-top="xs">React &amp; Next.js Fundamentals</GdsText>
                <GdsText font="body-regular-s" color="neutral-02" margin-top="s">
                  20 lessons • 8h 15m
                </GdsText>
              </GdsDiv>
            </GdsCard>

            <GdsCard padding="0" variant="secondary" overflow="hidden">
              <GdsDiv background="warning-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <GdsText font="heading-2xl">📱</GdsText>
              </GdsDiv>
              <GdsDiv padding="l">
                <GdsText font="detail-regular-s" color="brand-01">Mobile Development</GdsText>
                <GdsText font="heading-s" margin-top="xs">Build iOS &amp; Android Apps</GdsText>
                <GdsText font="body-regular-s" color="neutral-02" margin-top="s">
                  18 lessons • 7h 45m
                </GdsText>
              </GdsDiv>
            </GdsCard>
          </GdsGrid>
        </GdsDiv>
      </GdsDiv>

      {/* Modal Dialog */}
      <GdsDialog ref={dialogRef} heading="Welcome to Designer Hub">
        <GdsGrid columns="s{1} m{2}" gap="0" width="100%">
          {/* Left Panel */}
          <GdsDiv background="brand-01" color="inversed" padding="s{l} m{2xl}" display="s{none} m{flex}" flex-direction="column" justify-content="center" align-items="flex-start">
            <GdsFlex flex-direction="column" gap="l" align-items="flex-start">
              <GdsText tag="h2" font="heading-l" color="inversed" text-align="start">
                Welcome to Designer Hub
              </GdsText>
              
              {/* Features List */}
              <GdsFlex flex-direction="column" gap="m">
                {/* Feature 1 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsDiv width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </GdsDiv>
                  <GdsText font="body-regular-m" color="inversed">
                      Hundreds of curated categories
                  </GdsText>
                </GdsFlex>

                {/* Feature 2 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsDiv width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </GdsDiv>
                  <GdsText font="body-regular-m" color="inversed">
                    Exceptional outcomes, delivered reliably
                  </GdsText>
                </GdsFlex>

                {/* Feature 3 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsDiv width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </GdsDiv>
                  <GdsText font="body-regular-m" color="inversed">
                    Connect with skilled professionals worldwide
                  </GdsText>
                </GdsFlex>
              </GdsFlex>
            </GdsFlex>
          </GdsDiv>

          {/* Right Panel */}
          <GdsDiv padding="s{l} m{2xl}" display="flex" flex-direction="column" justify-content="center" align-items="center">
            <GdsFlex flex-direction="column" gap="l" align-items="center" width="100%">
              <GdsFlex flex-direction="column" gap="m" width="100%" align-items="flex-start">
                <GdsText tag="h2" font="heading-m">
                  Start your journey
                </GdsText>
                <GdsText font="body-regular-m" color="neutral-02">
                  Connect with professionals and projects that match your goals
                </GdsText>
              </GdsFlex>

              {/* Action Buttons */}
              <GdsFlex flex-direction="column" gap="m" width="100%">
                <GdsButton rank="primary" width="100%" onClick={handleCloseModal}>
                  Create Account
                </GdsButton>
                <GdsButton rank="tertiary" variant="neutral" width="100%" onClick={handleCloseModal}>
                  Continue Without Signing Up
                </GdsButton>
              </GdsFlex>

              {/* Divider */}
              <GdsFlex gap="m" align-items="center" width="100%">
                <GdsDiv flex="1" height="1px" background="subtle-01" />
                <GdsText font="detail-regular-s" color="neutral-02">
                  or choose an alternative sign-in method
                </GdsText>
                <GdsDiv flex="1" height="1px" background="subtle-01" />
              </GdsFlex>

              {/* Social Buttons */}
              <GdsFlex flex-direction="column" gap="s" width="100%">
                <GdsButton rank="secondary" variant="neutral" width="100%">
                  Sign in with Google
                </GdsButton>
                <GdsButton rank="secondary" variant="neutral" width="100%">
                  Sign in with Email
                </GdsButton>
              </GdsFlex>

              {/* Terms Text */}
              <GdsText font="detail-regular-s" color="neutral-02" text-align="center">
                By continuing you accept our{' '}
                <GdsLink href="/terms" text-decoration="hover:underline">Terms</GdsLink>{' '}
                and acknowledge the{' '}
                <GdsLink href="/privacy" text-decoration="hover:underline">Privacy Policy</GdsLink>.
              </GdsText>
            </GdsFlex>
          </GdsDiv>
        </GdsGrid>
      </GdsDialog>
      </ClientOnly>
    </PageLayout>
  )
}

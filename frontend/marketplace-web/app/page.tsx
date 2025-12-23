'use client'

import Link from 'next/link'
<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react'
import { GdsFlex, GdsGrid, GdsCard, GdsText, GdsDiv, GdsButton, GdsDivider, GdsDialog } from '@sebgroup/green-core/react'
=======
import { GdsFlex, GdsGrid, GdsCard, GdsText, GdsDiv, GdsButton, GdsDivider } from '@sebgroup/green-core/react'
>>>>>>> main
import { PageLayout } from '@/components/layout'

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
    <PageLayout>
<<<<<<< HEAD
      {/* Welcome Signup Modal - Auto-opens on page load */}
      <GdsDialog
        ref={dialogRef}
        max-width="1200px"
        padding="0"
        scrollable
      >
        {/* Modal Content - Two Panel Layout */}
        <GdsFlex
          flex-direction="row"
          min-height="600px"
          width="100%"
        >
          {/* Left Panel - Features */}
          <GdsDiv
            flex="1"
            background="brand-01"
            padding="2xl"
            display="flex"
            flex-direction="column"
            justify-content="center"
            align-items="flex-start"
          >
            <GdsDiv max-width="500px">
              <GdsText tag="h1" font="heading-xl" color="inversed" margin-bottom="l">
                Success starts here
              </GdsText>

              {/* Feature List */}
              <GdsFlex flex-direction="column" gap="m" margin-bottom="xl">
                {/* Feature 1 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsFlex
                    width="m"
                    height="m"
                    background="brand-02"
                    border-radius="s"
                    align-items="center"
                    justify-content="center"
                    flex-shrink="0"
                  >
                    <GdsText color="inversed">✓</GdsText>
                  </GdsFlex>
                  <GdsText font="body-regular-m" color="inversed">
                    Over 700 categories to find the perfect match
                  </GdsText>
                </GdsFlex>

                {/* Feature 2 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsFlex
                    width="m"
                    height="m"
                    background="brand-02"
                    border-radius="s"
                    align-items="center"
                    justify-content="center"
                    flex-shrink="0"
                  >
                    <GdsText color="inversed">✓</GdsText>
                  </GdsFlex>
                  <GdsText font="body-regular-m" color="inversed">
                    Quality work done faster with vetted professionals
                  </GdsText>
                </GdsFlex>

                {/* Feature 3 */}
                <GdsFlex gap="m" align-items="flex-start">
                  <GdsFlex
                    width="m"
                    height="m"
                    background="brand-02"
                    border-radius="s"
                    align-items="center"
                    justify-content="center"
                    flex-shrink="0"
                  >
                    <GdsText color="inversed">✓</GdsText>
                  </GdsFlex>
                  <GdsText font="body-regular-m" color="inversed">
                    Access to talent and businesses across the globe
                  </GdsText>
                </GdsFlex>
              </GdsFlex>

              {/* Feature Image */}
              <GdsDiv margin-top="xl" border-radius="m" overflow="hidden">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop"
                  alt="Professional workspace"
                  width="100%"
                  height="auto"
                />
              </GdsDiv>
            </GdsDiv>
          </GdsDiv>

          {/* Right Panel - Signup Form */}
          <GdsDiv
            flex="1"
            background="neutral-01"
            padding="2xl"
            display="flex"
            flex-direction="column"
            justify-content="center"
            align-items="center"
          >
            <GdsDiv max-width="420px" width="100%">
              <GdsText tag="h2" font="heading-l" margin-bottom="s">
                Create a new account
              </GdsText>
              <GdsText font="body-regular-m" color="neutral-02" margin-bottom="l">
                Already have an account?{' '}
                <Link href="/auth/login">
                  <GdsText font="body-regular-m" color="brand-01" text-decoration="underline">
                    Sign in
                  </GdsText>
                </Link>
              </GdsText>

              {/* Auth Buttons */}
              <GdsFlex flex-direction="column" gap="m" margin-bottom="m">
                <Link href="/auth/register">
                  <GdsButton rank="primary" width="100%">
                    Continue with Email
                  </GdsButton>
                </Link>

                <GdsButton rank="secondary" width="100%">
                  Continue with Google
                </GdsButton>

                <GdsButton rank="secondary" width="100%">
                  Continue with Apple
                </GdsButton>
              </GdsFlex>

              {/* Divider */}
              <GdsFlex gap="m" align-items="center" margin="m 0">
                <GdsDiv flex="1" background="neutral-03" height="1px"></GdsDiv>
                <GdsText font="body-regular-s" color="neutral-02">OR</GdsText>
                <GdsDiv flex="1" background="neutral-03" height="1px"></GdsDiv>
              </GdsFlex>

              {/* Social Buttons */}
              <GdsGrid columns="1fr 1fr" gap="m" margin-top="m" margin-bottom="l">
                <GdsButton rank="secondary" width="100%">
                  Apple
                </GdsButton>
                <GdsButton rank="secondary" width="100%">
                  Facebook
                </GdsButton>
              </GdsGrid>

              {/* Terms & Privacy */}
              <GdsText font="body-regular-s" color="neutral-02">
                By joining, you agree to the Designer Marketplace{' '}
                <Link href="#">
                  <GdsText color="brand-01" font="body-regular-s" text-decoration="underline">
                    Terms of Service
                  </GdsText>
                </Link>
                {' '}and to occasionally receive emails from us. Please read our{' '}
                <Link href="#">
                  <GdsText color="brand-01" font="body-regular-s" text-decoration="underline">
                    Privacy Policy
                  </GdsText>
                </Link>
                {' '}to learn how we use your personal data.
              </GdsText>

              {/* Close Button */}
              <GdsButton
                rank="secondary"
                width="100%"
                margin-top="l"
                onClick={handleCloseModal}
              >
                Explore as Guest
              </GdsButton>
            </GdsDiv>
          </GdsDiv>
        </GdsFlex>
      </GdsDialog>

=======
>>>>>>> main
      {/* Hero Section */}
      <GdsDiv background="brand-01" padding="2xl l">
        <GdsFlex 
          flex-direction="column" 
          align-items="center" 
          gap="l"
          max-width="1280px"
          margin="0 auto"
        >
          <GdsText tag="h1" font="heading-2xl" color="inversed" text-align="center">
            Designer Marketplace
          </GdsText>
          <GdsText font="body-regular-l" color="inversed" text-align="center">
            Find talented freelancers for your next project or learn new skills
          </GdsText>
          <GdsFlex gap="m">
            <Link href="/jobs">
              <GdsButton rank="primary" variant="neutral">
                Browse Jobs
              </GdsButton>
            </Link>
            <Link href="/auth/register">
              <GdsButton rank="secondary" variant="neutral">
                Get Started
              </GdsButton>
            </Link>
          </GdsFlex>
        </GdsFlex>
      </GdsDiv>

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
    </PageLayout>
  )
}

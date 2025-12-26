'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Card, Text, Div, Button, Dialog, LinkComponent } from '@/components/green'
import { PageLayout } from '@/components/layout'
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
      {/* Hero Section */}
      <LandingPage />

      {/* Main Content */}
      <Div padding="xl l" max-width="1280px" margin="0 auto" width="100%">
        {/* Feature Cards */}
        <Grid columns="1; m{2}; l{4}" gap="m" margin-bottom="xl">
          <Link href="/jobs/create">
            <Card padding="l" variant="secondary" height="100%">
              <Flex flex-direction="column" gap="m" height="100%">
                <Text font="heading-m">Post a Job</Text>
                <Text font="body-regular-m" color="neutral-02">
                  Describe your project and find the perfect freelancer
                </Text>
                <Div margin-top="auto">
                  <Button rank="primary" size="small">
                    Get Started
                  </Button>
                </Div>
              </Flex>
            </Card>
          </Link>

          <Link href="/freelancers">
            <Card padding="l" variant="secondary" height="100%">
              <Flex flex-direction="column" gap="m" height="100%">
                <Text font="heading-m">Browse Talent</Text>
                <Text font="body-regular-m" color="neutral-02">
                  Explore profiles of skilled designers and developers
                </Text>
                <Div margin-top="auto">
                  <Button rank="primary" size="small">
                    Find Talent
                  </Button>
                </Div>
              </Flex>
            </Card>
          </Link>

          <Link href="/jobs">
            <Card padding="l" variant="secondary" height="100%">
              <Flex flex-direction="column" gap="m" height="100%">
                <Text font="heading-m">Find Work</Text>
                <Text font="body-regular-m" color="neutral-02">
                  Browse available jobs and submit proposals
                </Text>
                <Div margin-top="auto">
                  <Button rank="primary" size="small">
                    View Jobs
                  </Button>
                </Div>
              </Flex>
            </Card>
          </Link>

          <Link href="/courses">
            <Card padding="l" variant="notice" height="100%">
              <Flex flex-direction="column" gap="m" height="100%">
                <Text font="heading-m">Learn Skills</Text>
                <Text font="body-regular-m" color="neutral-02">
                  Take courses from industry experts
                </Text>
                <Div margin-top="auto">
                  <Button rank="secondary" variant="notice" size="small">
                    Browse Courses
                  </Button>
                </Div>
              </Flex>
            </Card>
          </Link>
        </Grid>

        {/* How it Works Section */}
        <Card padding="xl" variant="tertiary" margin-bottom="xl">
          <Text tag="h2" font="heading-l" text-align="center" margin-bottom="l">
            How it Works
          </Text>
          <Grid columns="1; m{2}; l{4}" gap="l">
            <Flex flex-direction="column" align-items="center" gap="m" text-align="center">
              <Flex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <Text font="heading-m" color="inversed">1</Text>
              </Flex>
              <Text font="heading-s">Post Your Project</Text>
              <Text font="body-regular-s" color="neutral-02">
                Describe what you need and set your budget
              </Text>
            </Flex>

            <Flex flex-direction="column" align-items="center" gap="m" text-align="center">
              <Flex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <Text font="heading-m" color="inversed">2</Text>
              </Flex>
              <Text font="heading-s">Review Proposals</Text>
              <Text font="body-regular-s" color="neutral-02">
                Get bids from qualified freelancers
              </Text>
            </Flex>

            <Flex flex-direction="column" align-items="center" gap="m" text-align="center">
              <Flex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <Text font="heading-m" color="inversed">3</Text>
              </Flex>
              <Text font="heading-s">Fund Milestones</Text>
              <Text font="body-regular-s" color="neutral-02">
                Securely deposit funds into escrow
              </Text>
            </Flex>

            <Flex flex-direction="column" align-items="center" gap="m" text-align="center">
              <Flex 
                width="4xl" 
                height="4xl" 
                background="brand-01" 
                border-radius="max"
                align-items="center"
                justify-content="center"
              >
                <Text font="heading-m" color="inversed">4</Text>
              </Flex>
              <Text font="heading-s">Approve &amp; Pay</Text>
              <Text font="body-regular-s" color="neutral-02">
                Release payment when work is complete
              </Text>
            </Flex>
          </Grid>
        </Card>

        {/* Featured Courses Section */}
        <Div margin-bottom="xl">
          <Flex justify-content="space-between" align-items="center" margin-bottom="l">
            <Text tag="h2" font="heading-l">Learn New Skills</Text>
            <Link href="/courses" style={{ textDecoration: 'none' } as any}>
              <Text font="body-regular-m" color="brand-01">
                View all courses →
              </Text>
            </Link>
          </Flex>
          <Grid columns="1; m{2}; l{3}" gap="m">
            <Card padding="0" variant="secondary" overflow="hidden">
              <Div background="notice-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <Text font="heading-2xl">🎨</Text>
              </Div>
              <Div padding="l">
                <Text font="detail-regular-s" color="brand-01">UI/UX Design</Text>
                <Text font="heading-s" margin-top="xs">Master Modern UI Design</Text>
                <Text font="body-regular-s" color="neutral-02" margin-top="s">
                  12 lessons • 4h 30m
                </Text>
              </Div>
            </Card>

            <Card padding="0" variant="secondary" overflow="hidden">
              <Div background="positive-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <Text font="heading-2xl">💻</Text>
              </Div>
              <Div padding="l">
                <Text font="detail-regular-s" color="brand-01">Web Development</Text>
                <Text font="heading-s" margin-top="xs">React &amp; Next.js Fundamentals</Text>
                <Text font="body-regular-s" color="neutral-02" margin-top="s">
                  20 lessons • 8h 15m
                </Text>
              </Div>
            </Card>

            <Card padding="0" variant="secondary" overflow="hidden">
              <Div background="warning-01" padding="xl" display="flex" align-items="center" justify-content="center">
                <Text font="heading-2xl">📱</Text>
              </Div>
              <Div padding="l">
                <Text font="detail-regular-s" color="brand-01">Mobile Development</Text>
                <Text font="heading-s" margin-top="xs">Build iOS &amp; Android Apps</Text>
                <Text font="body-regular-s" color="neutral-02" margin-top="s">
                  18 lessons • 7h 45m
                </Text>
              </Div>
            </Card>
          </Grid>
        </Div>
      </Div>

      {/* Modal Dialog */}
      <Dialog ref={dialogRef} heading="Welcome to Designer Hub">
        <Grid columns="s{1} m{2}" gap="0" width="100%">
          {/* Left Panel */}
          <Div background="brand-01" color="inversed" padding="s{l} m{2xl}" display="s{none} m{flex}" flex-direction="column" justify-content="center" align-items="flex-start">
            <Flex flex-direction="column" gap="l" align-items="flex-start">
              <Text tag="h2" font="heading-l" color="inversed" text-align="start">
                Welcome to Designer Hub
              </Text>
              
              {/* Features List */}
              <Flex flex-direction="column" gap="m">
                {/* Feature 1 */}
                <Flex gap="m" align-items="flex-start">
                  <Div width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Div>
                  <Text font="body-regular-m" color="inversed">
                      Hundreds of curated categories
                  </Text>
                </Flex>

                {/* Feature 2 */}
                <Flex gap="m" align-items="flex-start">
                  <Div width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Div>
                  <Text font="body-regular-m" color="inversed">
                    Exceptional outcomes, delivered reliably
                  </Text>
                </Flex>

                {/* Feature 3 */}
                <Flex gap="m" align-items="flex-start">
                  <Div width="24px" height="24px" display="flex" align-items="center" justify-content="center" flex-shrink="0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Div>
                  <Text font="body-regular-m" color="inversed">
                    Connect with skilled professionals worldwide
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Div>

          {/* Right Panel */}
          <Div padding="s{l} m{2xl}" display="flex" flex-direction="column" justify-content="center" align-items="center">
            <Flex flex-direction="column" gap="l" align-items="center" width="100%">
              <Flex flex-direction="column" gap="m" width="100%" align-items="flex-start">
                <Text tag="h2" font="heading-m">
                  Start your journey
                </Text>
                <Text font="body-regular-m" color="neutral-02">
                  Connect with professionals and projects that match your goals
                </Text>
              </Flex>

              {/* Action Buttons */}
              <Flex flex-direction="column" gap="m" width="100%">
                <Button rank="primary" width="100%" onClick={handleCloseModal}>
                  Create Account
                </Button>
                <Button rank="tertiary" variant="neutral" width="100%" onClick={handleCloseModal}>
                  Continue Without Signing Up
                </Button>
              </Flex>

              {/* Divider */}
              <Flex gap="m" align-items="center" width="100%">
                <Div flex="1" height="1px" background="subtle-01" />
                <Text font="detail-regular-s" color="neutral-02">
                  or choose an alternative sign-in method
                </Text>
                <Div flex="1" height="1px" background="subtle-01" />
              </Flex>

              {/* Social Buttons */}
              <Flex flex-direction="column" gap="s" width="100%">
                <Button rank="secondary" variant="neutral" width="100%">
                  Sign in with Google
                </Button>
                <Button rank="secondary" variant="neutral" width="100%">
                  Sign in with Email
                </Button>
              </Flex>

              {/* Terms Text */}
              <Text font="detail-regular-s" color="neutral-02" text-align="center">
                By continuing you accept our{' '}
                <LinkComponent href="/terms" text-decoration="hover:underline">Terms</LinkComponent>{' '}
                and acknowledge the{' '}
                <LinkComponent href="/privacy" text-decoration="hover:underline">Privacy Policy</LinkComponent>.
              </Text>
            </Flex>
          </Div>
        </Grid>
      </Dialog>
    </PageLayout>
  )
}

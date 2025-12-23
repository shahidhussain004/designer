'use client'

import Link from 'next/link'
import { GdsFlex, GdsGrid, GdsCard, GdsText, GdsDiv, GdsButton, GdsDivider } from '@sebgroup/green-core/react'
import { PageLayout } from '@/components/layout'

export default function Home() {
  return (
    <PageLayout>
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

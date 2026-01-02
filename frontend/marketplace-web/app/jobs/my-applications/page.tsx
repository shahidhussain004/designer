'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import {
  Badge,
  Card,
  Flex,
  Text
} from '@/components/green';
import { LoadingSpinner } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useMyApplications } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: applications = [], isLoading, isError, error, refetch } = useMyApplications();

  useEffect(() => {
    if (user) {
      if (user.role !== 'FREELANCER') {
        router.push('/jobs');
      }
    }
  }, [router, user]);

  if (isLoading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" padding="xl">
          <LoadingSpinner />
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {isError && (
        <div style={{ padding: '1rem' }}>
          <ErrorMessage 
            message={error?.message || 'Failed to load applications'} 
            retry={() => refetch()}
          />
        </div>
      )}

      <Flex flex-direction="column" gap="s" padding="l">
        <Link href="/jobs">← Back to Jobs</Link>
        <Text tag="h1" font-size="heading-xl">
          My Applications
        </Text>
        <Text color="secondary">
          Track the status of your job applications
        </Text>
      </Flex>

      <Flex padding="l">
        {applications.length === 0 ? (
          <Card padding="xl" style={{ width: '100%' }}>
            <Flex flex-direction="column" gap="m" align-items="center">
              <Text font-size="heading-m">No applications yet</Text>
              <Text color="secondary">
                Start applying to jobs to track them here
              </Text>
              <Link href="/jobs">
                Browse Jobs →
              </Link>
            </Flex>
          </Card>
        ) : (
          <Flex flex-direction="column" gap="m" style={{ width: '100%' }}>
            {applications.map((application: any) => (
              <Link
                key={application.id}
                href={`/jobs/${application.jobId}`}
              >
                <Card padding="l" variant="information">
                  <Flex
                    flex-direction="column"
                    gap="m"
                    justify-content="space-between"
                  >
                    <Flex
                      justify-content="space-between"
                      align-items="start"
                    >
                      <Flex flex-direction="column" gap="xs" flex="1">
                        <Text tag="h2" font-size="heading-m">
                          {application.jobTitle}
                        </Text>
                        <Text color="secondary">
                          {application.companyName}
                        </Text>
                      </Flex>
                      <Badge
                        variant={
                          application.status === 'PENDING'
                            ? 'information'
                            : application.status === 'ACCEPTED'
                            ? 'positive'
                            : 'negative'
                        }
                      >
                        {application.status}
                      </Badge>
                    </Flex>

                    <Text>{application.coverLetter.substring(0, 150)}...</Text>

                    <Flex justify-content="space-between" align-items="center">
                      <Text font-size="body-s" color="secondary">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </Text>
                      <Text font-size="body-s" color="secondary">
                        Last updated {new Date(application.updatedAt).toLocaleDateString()}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Flex>
        )}
      </Flex>
    </PageLayout>
  );
}

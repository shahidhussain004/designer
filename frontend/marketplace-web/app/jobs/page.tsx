'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Select,
  Text
} from '@/components/green';
import { JobsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function JobsListPage() {
  const { data: jobs, isLoading, error, refetch } = useJobs();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('OPEN');

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter(
      (job: any) => filterStatus === 'ALL' || job.status === filterStatus
    );
  }, [jobs, filterStatus]);

  if (isLoading) {
    return (
      <PageLayout>
        <JobsSkeleton />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Failed to load jobs'} 
          retry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Flex flex-direction="column" gap="m" justify-content="space-between" padding="l">
        <Flex flex-direction="column" gap="s">
          <Text tag="h1" font-size="heading-xl">Employment Opportunities</Text>
          <Text color="secondary">Browse job openings and apply</Text>
        </Flex>
        {user && user.role === 'CLIENT' && (
          <Link href="/jobs/create">
            <Button variant="brand">Post a New Job</Button>
          </Link>
        )}
      </Flex>

      <Flex gap="m" padding="l" align-items="end">
        <Flex flex-direction="column" gap="xs" flex="1">
          <Text tag="label" font-size="body-s">Status</Text>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="FILLED">Filled</option>
          </Select>
        </Flex>
      </Flex>

      <Flex padding="l">
        {filteredJobs.length === 0 ? (
          <Card padding="xl" style={{ width: '100%' }}>
            <Flex flex-direction="column" gap="m" align-items="center">
              <Text font-size="heading-m">No jobs found</Text>
              <Text color="secondary">Try adjusting your filters or check back later</Text>
            </Flex>
          </Card>
        ) : (
          <Grid columns="1" gap="m" style={{ width: '100%' }}>
            {filteredJobs.map((job: any) => (
              <Link key={job.id} href={"/jobs/" + job.id}>
                <Card padding="l" variant="information">
                  <Flex flex-direction="column" gap="m" justify-content="space-between">
                    <Flex flex-direction="column" gap="s">
                      <Flex justify-content="space-between" align-items="start">
                        <Flex flex-direction="column" gap="xs" flex="1">
                          <Text tag="h2" font-size="heading-m">{job.title}</Text>
                          <Text color="secondary">{job.companyName}</Text>
                        </Flex>
                        <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'}>{job.status}</Badge>
                      </Flex>
                      <Text>{(job.description || '').substring(0, 150)}{(job.description && job.description.length > 150) ? '...' : ''}</Text>
                      <Flex gap="m" flex-wrap="wrap">
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">Salary</Text>
                          <Text font-size="heading-s"></Text>
                        </Flex>
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">Type</Text>
                          <Text font-size="heading-s">{job.jobType}</Text>
                        </Flex>
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">Location</Text>
                          <Text font-size="heading-s">{job.location}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Text font-size="body-s" color="secondary">Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}</Text>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Grid>
        )}
      </Flex>
    </PageLayout>
  );
}

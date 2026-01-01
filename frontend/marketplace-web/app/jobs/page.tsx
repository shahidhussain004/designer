'use client';

import {
    Alert,
    Badge,
    Button,
    Card,
    Flex,
    Grid,
    Select,
    Spinner,
    Text
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { authService } from '@/lib/auth';
import logger from '@/lib/logger';
import { User } from '@/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface EmploymentJob {
  id: number;
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState<EmploymentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState('OPEN');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    // Abort any previous pending request
    try {
      abortControllerRef.current?.abort();
    } catch (e) {
      // ignore
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Timeout the request after 10s
    const timeoutMs = 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const rawBase = process.env.NEXT_PUBLIC_API_URL || '';
    const base = rawBase.replace(/\/api\/?$/, '');
    const url = `${base}/api/employment-jobs`;

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs (${response.status})`);
      }
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      // Ignore AbortError caused by timeout or component unmount
      if ((err as any)?.name === 'AbortError') {
        // do not set error state or log as an application error
      } else {
        const msg = err instanceof Error ? err.message : 'An error occurred';
        setError(msg);
        logger.error('Error fetching jobs', err as Error);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    fetchJobs();

    return () => {
      // ensure we don't update state after unmount
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleRetry = () => {
    fetchJobs();
  };

  const filteredJobs = jobs.filter(
    (job) => filterStatus === 'ALL' || job.status === filterStatus
  );

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" padding="xl">
          <Spinner />
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {error && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="negative">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>{error}</div>
              <div>
                <Button variant="neutral" onClick={handleRetry}>Retry</Button>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Header */}
      <Flex
        flex-direction="column"
        gap="m"
        justify-content="space-between"
        padding="l"
      >
        <Flex flex-direction="column" gap="s">
          <Text tag="h1" font-size="heading-xl">
            Employment Opportunities
          </Text>
          <Text color="secondary">Browse job openings and apply</Text>
        </Flex>

        {user && user.role === 'CLIENT' && (
          <Link href="/jobs/create">
            <Button variant="brand">Post a New Job</Button>
          </Link>
        )}
      </Flex>

      {/* Filters */}
      <Flex gap="m" padding="l" align-items="end">
        <Flex flex-direction="column" gap="xs" flex="1">
          <Text tag="label" font-size="body-s">
            Status
          </Text>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="FILLED">Filled</option>
          </Select>
        </Flex>
      </Flex>

      {/* Jobs List */}
      <Flex padding="l">
        {filteredJobs.length === 0 ? (
          <Card padding="xl" style={{ width: '100%' }}>
            <Flex flex-direction="column" gap="m" align-items="center">
              <Text font-size="heading-m">No jobs found</Text>
              <Text color="secondary">
                Try adjusting your filters or check back later
              </Text>
            </Flex>
          </Card>
        ) : (
          <Grid columns="1" gap="m" style={{ width: '100%' }}>
            {filteredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card padding="l" variant="information">
                  <Flex
                    flex-direction="column"
                    gap="m"
                    justify-content="space-between"
                  >
                    <Flex flex-direction="column" gap="s">
                      <Flex
                        justify-content="space-between"
                        align-items="start"
                      >
                        <Flex flex-direction="column" gap="xs" flex="1">
                          <Text tag="h2" font-size="heading-m">
                            {job.title}
                          </Text>
                          <Text color="secondary">{job.companyName}</Text>
                        </Flex>
                        <Badge
                          variant={
                            job.status === 'OPEN' ? 'positive' : 'information'
                          }
                        >
                          {job.status}
                        </Badge>
                      </Flex>

                      <Text>{job.description.substring(0, 150)}...</Text>

                      <Flex gap="m" flex-wrap="wrap">
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">
                            Salary
                          </Text>
                          <Text font-size="heading-s">
                            ${job.salary?.toLocaleString()}
                          </Text>
                        </Flex>
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">
                            Type
                          </Text>
                          <Text font-size="heading-s">{job.jobType}</Text>
                        </Flex>
                        <Flex flex-direction="column" gap="xs">
                          <Text font-size="body-s" color="secondary">
                            Location
                          </Text>
                          <Text font-size="heading-s">{job.location}</Text>
                        </Flex>
                      </Flex>
                    </Flex>

                    <Text font-size="body-s" color="secondary">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </Text>
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

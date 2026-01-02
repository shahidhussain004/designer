"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import {
  Alert,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Text,
  Textarea,
} from '@/components/green';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useApplyForJob, useJob } from '@/hooks/useJobs';
import { useUserProfile } from '@/hooks/useUsers';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const { user } = useAuth();

  // Fetch job details
  const { data: job, isLoading: jobLoading, error: jobError, refetch } = useJob(jobId);
  
  // Fetch employer details (dependent query)
  const { data: employer } = useUserProfile(job?.employerId || null);

  // Application mutation
  const applyForJob = useApplyForJob();

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({ 
    jobId: 0, 
    coverLetter: '', 
    resumeUrl: '' 
  });
  const [fieldErrors, setFieldErrors] = useState<{ coverLetter?: string; resumeUrl?: string }>({});

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      return;
    }

    setFieldErrors({});

    const newFieldErrors: { coverLetter?: string; resumeUrl?: string } = {};

    if (!applicationData.coverLetter || applicationData.coverLetter.trim().length === 0) {
      newFieldErrors.coverLetter = 'Cover letter is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await applyForJob.mutateAsync({
        jobId: job!.id,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl,
      });
      
      setApplicationOpen(false);
      setApplicationData({ jobId: job!.id, coverLetter: '', resumeUrl: '' });
    } catch (err) {
      // Error is handled by mutation
    }
  };

  if (jobLoading) {
    return (
      <PageLayout>
        <JobDetailsSkeleton />
      </PageLayout>
    );
  }

  if (jobError || !job) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={jobError instanceof Error ? jobError.message : 'Job not found'} 
          retry={refetch}
        />
        <Flex padding="l">
          <Link href="/jobs">← Back to Jobs</Link>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {applyForJob.isSuccess && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="positive">
            Application submitted successfully! The employer will review your application.
          </Alert>
        </div>
      )}

      {applyForJob.error && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="negative">
            {applyForJob.error instanceof Error ? applyForJob.error.message : 'Failed to submit application'}
          </Alert>
        </div>
      )}

      <Flex flex-direction="column" gap="s" padding="l">
        <Link href="/jobs">← Back to Jobs</Link>
        <Text tag="h1" font-size="heading-xl">{job.title}</Text>
      </Flex>

      <Flex padding="l">
        <Grid columns="1; m{3}" gap="l">
          <Flex flex-direction="column" gap="m">
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">Job Description</Text>
                <Text>{job.description}</Text>
              </Flex>
            </Card>

            {job.requirements && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text tag="h2" font-size="heading-m">Requirements</Text>
                  <Text>{job.requirements}</Text>
                </Flex>
              </Card>
            )}

            {job.benefits && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text tag="h2" font-size="heading-m">Benefits</Text>
                  <Text>{job.benefits}</Text>
                </Flex>
              </Card>
            )}

            <Grid columns="2" gap="m">
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Job Type</Text>
                  <Text font-size="heading-s">{job.jobType}</Text>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Location</Text>
                  <Text font-size="heading-s">{job.location}</Text>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Status</Text>
                  <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'}>{job.status}</Badge>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Posted</Text>
                  <Text font-size="heading-s">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</Text>
                </Flex>
              </Card>
            </Grid>

            {employer && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text tag="h2" font-size="heading-m">About the Employer</Text>
                  <Flex justify-content="space-between" align-items="center">
                    <Flex flex-direction="column" gap="xs">
                      <Text font-size="heading-s">{employer.fullName}</Text>
                      <Text font-size="body-s" color="secondary">@{employer.username}</Text>
                      {employer.email && (
                        <Text font-size="body-s" color="secondary">{employer.email}</Text>
                      )}
                    </Flex>
                    <Link href={`/users/${employer.id}/profile`}>View Profile →</Link>
                  </Flex>
                </Flex>
              </Card>
            )}
          </Flex>

          <Flex flex-direction="column" gap="m">
            <Card padding="l" variant="positive">
              <Flex flex-direction="column" gap="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s">Salary Range</Text>
                  <Text font-size="heading-xl">${job.salary?.toLocaleString()}</Text>
                </Flex>

                {user && user.role === 'FREELANCER' && user.id !== job.employerId ? (
                  <Button 
                    variant={applicationOpen ? 'neutral' : 'brand'} 
                    onClick={() => setApplicationOpen(!applicationOpen)}
                  >
                    {applicationOpen ? 'Cancel' : 'Apply Now'}
                  </Button>
                ) : null}
              </Flex>
            </Card>

            {applicationOpen && (
              <Card padding="l">
                <form onSubmit={handleApplicationSubmit}>
                  <Flex flex-direction="column" gap="m">
                    <Text tag="h3" font-size="heading-s">Submit Your Application</Text>

                    <Flex flex-direction="column" gap="xs">
                      <Text tag="label" font-size="body-s">Cover Letter *</Text>
                      <Textarea
                        placeholder="Tell the employer why you're interested in this role"
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                        style={{ minHeight: '150px' }}
                      />
                      {fieldErrors.coverLetter && (
                        <Text font-size="body-s" color="negative">{fieldErrors.coverLetter}</Text>
                      )}
                    </Flex>

                    <Flex flex-direction="column" gap="xs">
                      <Text tag="label" font-size="body-s">Resume URL</Text>
                      <Input 
                        type="url" 
                        placeholder="https://example.com/resume.pdf" 
                        value={applicationData.resumeUrl} 
                        onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })} 
                      />
                    </Flex>

                    <Button 
                      type="submit" 
                      variant="brand" 
                      disabled={applyForJob.isPending}
                    >
                      {applyForJob.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </Flex>
                </form>
              </Card>
            )}
          </Flex>
        </Grid>
      </Flex>
    </PageLayout>
  );
}


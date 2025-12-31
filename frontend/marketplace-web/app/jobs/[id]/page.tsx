'use client';

import {
    Alert,
    Badge,
    Button,
    Card,
    Flex,
    Grid,
    Input,
    Spinner,
    Text,
    Textarea
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { authService } from '@/lib/auth';
import logger from '@/lib/logger';
import { User } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface EmploymentJob {
  id: number;
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  requirements: string;
  benefits: string;
  status: string;
  employerId: number;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationRequest {
  jobId: number;
  coverLetter: string;
  resumeUrl?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<EmploymentJob | null>(null);
  const [employer, setEmployer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationRequest>({
    jobId: 0,
    coverLetter: '',
    resumeUrl: '',
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ coverLetter?: string; resumeUrl?: string }>({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/employment-jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);

        setApplicationData((prev) => ({ ...prev, jobId: data.id }));

        if (data.employerId) {
          try {
            const employerResponse = await fetch(
              `http://localhost:8080/api/users/${data.employerId}/profile`
            );
            if (employerResponse.ok) {
              const employerData = await employerResponse.json();
              setEmployer(employerData);
            }
          } catch (err) {
            logger.error('Error fetching employer details', err as Error);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      setApplicationError('Only freelancers can apply for jobs');
      return;
    }

    setFieldErrors({});
    setApplicationError(null);

    const newFieldErrors: { coverLetter?: string; resumeUrl?: string } = {};

    if (!applicationData.jobId || applicationData.jobId <= 0) {
      setApplicationError('Invalid job selected');
      return;
    }

    if (!applicationData.coverLetter || applicationData.coverLetter.trim().length === 0) {
      newFieldErrors.coverLetter = 'Cover letter is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setSubmittingApplication(true);
    setApplicationSuccess(false);

    try {
      await apiClient.post('/job-applications', applicationData);
      setApplicationSuccess(true);
      setApplicationOpen(false);
      setApplicationData({ jobId: job!.id, coverLetter: '', resumeUrl: '' });

      setTimeout(() => setApplicationSuccess(false), 5000);
    } catch (err: any) {
      logger.error('Application submission failed', err);
      let message = 'Failed to submit application';
      
      if (err?.response?.data) {
        const data = err.response.data;
        if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        }
      } else if (err?.message) {
        message = err.message;
      }

      setApplicationError(message);
    } finally {
      setSubmittingApplication(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Flex justify-content="center" align-items="center" padding="xl">
          <Spinner />
        </Flex>
      </PageLayout>
    );
  }

  if (error || !job) {
    return (
      <PageLayout>
        <Flex flex-direction="column" padding="l" gap="m">
          <Alert variant="negative">
            Error: {error || 'Job not found'}
          </Alert>
          <Link href="/jobs">
            ← Back to Jobs
          </Link>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {applicationSuccess && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="positive">
            Application submitted successfully! The employer will review your application.
          </Alert>
        </div>
      )}

      {applicationError && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="negative">
            {applicationError}
          </Alert>
        </div>
      )}

      <Flex flex-direction="column" gap="s" padding="l">
        <Link href="/jobs">
          ← Back to Jobs
        </Link>
        <Text tag="h1" font-size="heading-xl">
          {job.title}
        </Text>
      </Flex>

      <Flex padding="l">
        <Grid columns="1; m{3}" gap="l">
          <Flex flex-direction="column" gap="m">
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Job Description
                </Text>
                <Text>{job.description}</Text>
              </Flex>
            </Card>

            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Requirements
                </Text>
                <Text>{job.requirements}</Text>
              </Flex>
            </Card>

            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Benefits
                </Text>
                <Text>{job.benefits}</Text>
              </Flex>
            </Card>

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
                  <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                    {job.status}
                  </Badge>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Posted</Text>
                  <Text font-size="heading-s">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
              </Card>
            </Grid>

            {employer && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text tag="h2" font-size="heading-m">
                    About the Employer
                  </Text>
                  <Flex justify-content="space-between" align-items="center">
                    <Flex flex-direction="column" gap="xs">
                      <Text font-size="heading-s">{employer.fullName}</Text>
                      <Text font-size="body-s" color="secondary">@{employer.username}</Text>
                      <Text font-size="body-s" color="secondary">{employer.email}</Text>
                    </Flex>
                    <Link href={`/users/${employer.id}/profile`}>
                      View Profile →
                    </Link>
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
                    <Text tag="h3" font-size="heading-s">
                      Submit Your Application
                    </Text>

                    <Flex flex-direction="column" gap="xs">
                      <Text tag="label" font-size="body-s">
                        Cover Letter *
                      </Text>
                      <Textarea
                        placeholder="Tell the employer why you're interested in this role"
                        value={applicationData.coverLetter}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            coverLetter: e.target.value,
                          })
                        }
                        style={{ minHeight: '150px' }}
                      />
                      {fieldErrors.coverLetter && (
                        <Text font-size="body-s" color="negative">
                          {fieldErrors.coverLetter}
                        </Text>
                      )}
                    </Flex>

                    <Flex flex-direction="column" gap="xs">
                      <Text tag="label" font-size="body-s">
                        Resume URL
                      </Text>
                      <Input
                        type="url"
                        placeholder="https://example.com/resume.pdf"
                        value={applicationData.resumeUrl}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            resumeUrl: e.target.value,
                          })
                        }
                      />
                    </Flex>

                    <Button
                      type="submit"
                      variant="brand"
                      disabled={submittingApplication}
                    >
                      {submittingApplication ? 'Submitting...' : 'Submit Application'}
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

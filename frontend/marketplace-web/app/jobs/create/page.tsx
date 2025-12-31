'use client';

import {
    Alert,
    Button,
    Card,
    Flex,
    Input,
    Select,
    Spinner,
    Text,
    Textarea,
} from '@/components/green';
import { PageLayout } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { authService } from '@/lib/auth';
import logger from '@/lib/logger';
import { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CreateJobRequest {
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  requirements: string;
  benefits: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    description: '',
    companyName: '',
    salary: 0,
    jobType: 'FULL_TIME',
    location: '',
    requirements: '',
    benefits: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role !== 'CLIENT') {
        router.push('/jobs');
      } else {
        setUser(currentUser);
      }
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = 'Valid salary is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiClient.post('/employment-jobs', formData);
      setSuccess(true);

      setTimeout(() => {
        router.push(`/jobs/${response.data.id}`);
      }, 1500);
    } catch (err: any) {
      logger.error('Job creation failed', err);
      let message = 'Failed to create job';

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setSubmitting(false);
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

  if (!user || user.role !== 'CLIENT') {
    return (
      <PageLayout>
        <Flex flex-direction="column" padding="l" gap="m">
          <Alert variant="negative">
            Only clients can post jobs
          </Alert>
          <Link href="/jobs">← Back to Jobs</Link>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {success && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="positive">
            Job posted successfully! Redirecting...
          </Alert>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="negative">{error}</Alert>
        </div>
      )}

      <Flex flex-direction="column" gap="s" padding="l">
        <Link href="/jobs">← Back to Jobs</Link>
        <Text tag="h1" font-size="heading-xl">
          Post a New Job
        </Text>
      </Flex>

      <Flex padding="l">
        <Card padding="l" style={{ maxWidth: '800px', width: '100%' }}>
          <form onSubmit={handleSubmit}>
            <Flex flex-direction="column" gap="l">
              {/* Basic Information */}
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Basic Information
                </Text>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Job Title *
                  </Text>
                  <Input
                    type="text"
                    placeholder="e.g., Senior Full Stack Developer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {fieldErrors.title && (
                    <Text font-size="body-s" color="negative">
                      {fieldErrors.title}
                    </Text>
                  )}
                </Flex>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Company Name *
                  </Text>
                  <Input
                    type="text"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                  {fieldErrors.companyName && (
                    <Text font-size="body-s" color="negative">
                      {fieldErrors.companyName}
                    </Text>
                  )}
                </Flex>

                <Flex gap="m">
                  <Flex flex-direction="column" gap="xs" flex="1">
                    <Text tag="label" font-size="body-s">
                      Job Type *
                    </Text>
                    <Select
                      value={formData.jobType}
                      onChange={(e) =>
                        setFormData({ ...formData, jobType: e.target.value })
                      }
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="TEMPORARY">Temporary</option>
                    </Select>
                  </Flex>

                  <Flex flex-direction="column" gap="xs" flex="1">
                    <Text tag="label" font-size="body-s">
                      Location *
                    </Text>
                    <Input
                      type="text"
                      placeholder="e.g., Remote, New York, NY"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                    {fieldErrors.location && (
                      <Text font-size="body-s" color="negative">
                        {fieldErrors.location}
                      </Text>
                    )}
                  </Flex>
                </Flex>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Salary (Annual) *
                  </Text>
                  <Input
                    type="number"
                    placeholder="e.g., 100000"
                    value={formData.salary || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  {fieldErrors.salary && (
                    <Text font-size="body-s" color="negative">
                      {fieldErrors.salary}
                    </Text>
                  )}
                </Flex>
              </Flex>

              {/* Job Details */}
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Job Details
                </Text>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Description *
                  </Text>
                  <Textarea
                    placeholder="Describe the job role, responsibilities, and what you're looking for"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{ minHeight: '200px' }}
                  />
                  {fieldErrors.description && (
                    <Text font-size="body-s" color="negative">
                      {fieldErrors.description}
                    </Text>
                  )}
                </Flex>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Requirements *
                  </Text>
                  <Textarea
                    placeholder="List the key skills and experience required"
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: e.target.value,
                      })
                    }
                    style={{ minHeight: '150px' }}
                  />
                  {fieldErrors.requirements && (
                    <Text font-size="body-s" color="negative">
                      {fieldErrors.requirements}
                    </Text>
                  )}
                </Flex>

                <Flex flex-direction="column" gap="xs">
                  <Text tag="label" font-size="body-s">
                    Benefits
                  </Text>
                  <Textarea
                    placeholder="Describe benefits, perks, and what makes your company great"
                    value={formData.benefits}
                    onChange={(e) =>
                      setFormData({ ...formData, benefits: e.target.value })
                    }
                    style={{ minHeight: '150px' }}
                  />
                </Flex>
              </Flex>

              {/* Actions */}
              <Flex gap="m" justify-content="flex-end">
                <Link href="/jobs">
                  <Button variant="neutral">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  variant="brand"
                  disabled={submitting}
                >
                  {submitting ? 'Posting...' : 'Post Job'}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </PageLayout>
  );
}

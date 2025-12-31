'use client';

import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Input,
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
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  experienceLevel: {
    id: number;
    name: string;
    code: string;
    description: string;
    yearsMin: number;
    yearsMax: number | null;
    displayOrder: number;
  };
  clientId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProposalRequest {
  projectId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalRequest>({
    projectId: 0,
    coverLetter: '',
    proposedRate: 0,
    estimatedDuration: 30,
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ coverLetter?: string; proposedRate?: string; estimatedDuration?: string }>({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        setProject(data);

        setProposalData((prev) => ({ ...prev, projectId: data.id }));

        if (data.clientId) {
          try {
            const clientResponse = await fetch(
              `http://localhost:8080/api/users/${data.clientId}/profile`
            );
            if (clientResponse.ok) {
              const clientData = await clientResponse.json();
              setClient(clientData);
            }
          } catch (err) {
                logger.error('Error fetching client details', err as Error);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      setProposalError('Only freelancers can submit proposals');
      return;
    }

    // Clear previous errors
    setFieldErrors({});
    setProposalError(null);

    // Client-side validation - populate fieldErrors map for field-level display
    const newFieldErrors: { coverLetter?: string; proposedRate?: string; estimatedDuration?: string } = {};
    if (!proposalData.projectId || proposalData.projectId <= 0) {
      setProposalError('Invalid project selected for proposal');
      return;
    }

    if (!proposalData.coverLetter || proposalData.coverLetter.trim().length === 0) {
      newFieldErrors.coverLetter = 'Cover letter is required';
    }

    if (!isFinite(proposalData.proposedRate) || proposalData.proposedRate <= 0) {
      newFieldErrors.proposedRate = 'Please enter a valid proposed rate';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setSubmittingProposal(true);
    setProposalSuccess(false);
    
    try {
      const { data } = await apiClient.post('/proposals', proposalData)

      setProposalSuccess(true)
      setProposalOpen(false)
      setProposalData({ projectId: project!.id, coverLetter: '', proposedRate: 0, estimatedDuration: 30 })

      // Auto-hide success message after 5 seconds
      setTimeout(() => setProposalSuccess(false), 5000)
    } catch (err: any) {
      logger.error('Proposal submission failed', err)

      // Try to extract a user-friendly message from axios error structure
      let message = 'Failed to submit proposal'
      if (err?.response?.data) {
        const data = err.response.data

        // If backend returned a map of field errors, map them
        // e.g., { errors: [{ field: 'coverLetter', message: 'required' }, ...] }
        if (data.errors && Array.isArray(data.errors)) {
          const fe: typeof fieldErrors = {}
          data.errors.forEach((e: any) => {
            if (e.field && e.message) {
              const fieldKey = e.field as keyof typeof fieldErrors
              fe[fieldKey] = e.message
            }
          })
          setFieldErrors(fe)
          message = 'Please fix the highlighted fields'
        } else if (typeof data === 'object') {
          // Try common patterns
          if (data.field && data.message) {
            setFieldErrors({ [data.field]: data.message })
            message = data.message
          } else if (data.message) {
            message = data.message
          } else if (data.error) {
            message = data.error
          }
        } else if (typeof data === 'string') {
          message = data
        }
      } else if (err?.message) {
        message = err.message
      }

      setProposalError(message)
    } finally {
      setSubmittingProposal(false)
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

  if (error || !project) {
    return (
      <PageLayout>
        <Flex flex-direction="column" padding="l" gap="m">
          <Alert variant="negative">
            Error: {error || 'Project not found'}
          </Alert>
          <Link href="/projects">
            ← Back to Browse Projects
          </Link>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Success/Error Notifications */}
      {proposalSuccess && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="positive">
            Proposal submitted successfully! The client will review your proposal.
          </Alert>
        </div>
      )}
      
      {proposalError && (
        <div style={{ padding: '1rem' }}>
          <Alert variant="negative">
            {proposalError}
          </Alert>
        </div>
      )}

      {/* Header */}
      <Flex flex-direction="column" gap="s" padding="l">
        <Link href="/projects">
          ← Back to Browse Projects
        </Link>
        <Text tag="h1" font-size="heading-xl">
          {project.title}
        </Text>
      </Flex>

      <Flex padding="l">
        <Grid columns="1; m{3}" gap="l">
          {/* Main Content */}
          <Flex flex-direction="column" gap="m">
            {/* Project Description */}
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Project Description
                </Text>
                <Text>
                  {project.description}
                </Text>
              </Flex>
            </Card>

            {/* Project Meta */}
            <Grid columns="2" gap="m">
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Category</Text>
                  <Text font-size="heading-s">{project.category.name}</Text>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Experience Level</Text>
                  <Text font-size="heading-s">{project.experienceLevel.name}</Text>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Status</Text>
                  <Badge variant={project.status === 'OPEN' ? 'positive' : 'information'}>
                    {project.status}
                  </Badge>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Posted</Text>
                  <Text font-size="heading-s">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
              </Card>
            </Grid>

            {/* Client Info */}
            {client && (
              <Card padding="l">
                <Flex flex-direction="column" gap="m">
                  <Text tag="h2" font-size="heading-m">
                    About the Client
                  </Text>
                  <Flex justify-content="space-between" align-items="center">
                    <Flex flex-direction="column" gap="xs">
                      <Text font-size="heading-s">{client.fullName}</Text>
                      <Text font-size="body-s" color="secondary">@{client.username}</Text>
                      <Text font-size="body-s" color="secondary">{client.email}</Text>
                    </Flex>
                    <Link
                      href={`/users/${client.id}/profile`}
                    >
                      View Profile →
                    </Link>
                  </Flex>
                </Flex>
              </Card>
            )}
          </Flex>

          {/* Sidebar */}
          <Flex flex-direction="column" gap="m">
            {/* Budget Card */}
            <Card padding="l" variant="positive">
              <Flex flex-direction="column" gap="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s">Budget</Text>
                  <Text font-size="heading-xl">${project.budget}</Text>
                </Flex>
                
                {user && user.role === 'FREELANCER' && user.id !== project.clientId ? (
                  <Button
                    variant={proposalOpen ? 'neutral' : 'brand'}
                    onClick={() => {
                      if (!proposalOpen) {
                        // Initialize proposal data with correct jobId when opening form
                        setProposalData({
                          jobId: job.id,
                          coverLetter: '',
                          proposedRate: 0,
                          estimatedDuration: 30
                        });
                      }
                      setProposalOpen(!proposalOpen);
                    }}
                  >
                    {proposalOpen ? 'Cancel' : 'Send Proposal'}
                  </Button>
                ) : user && user.id === job.clientId ? (
                  <Card padding="m" variant="information">
                    <Text font-size="body-s">
                      This is your job posting
                    </Text>
                  </Card>
                ) : (
                  <Link href="/auth/login">
                    <Button rank="secondary">
                      Sign In to Propose
                    </Button>
                  </Link>
                )}
              </Flex>
            </Card>

            {/* Proposal Form */}
            {proposalOpen && user && user.role === 'FREELANCER' && (
              <Card padding="l">
                <form onSubmit={handleProposalSubmit}>
                  <Flex flex-direction="column" gap="m">
                    <Text tag="h3" font-size="heading-s">
                      Submit Your Proposal
                    </Text>

                    <Input
                      label="Your Proposed Rate ($)"
                      type="number"
                      value={proposalData.proposedRate.toString()}
                      onInput={(e: Event) =>
                        setProposalData({
                          ...proposalData,
                          proposedRate: parseFloat((e.target as HTMLInputElement).value),
                        })
                      }
                      required
                    />
                    {fieldErrors.proposedRate && (
                      <div className="text-red-600 text-sm mt-1">{fieldErrors.proposedRate}</div>
                    )}

                    <Input
                      label="Estimated Duration (days)"
                      type="number"
                      value={(proposalData.estimatedDuration || 30).toString()}
                      onInput={(e: Event) =>
                        setProposalData({
                          ...proposalData,
                          estimatedDuration: parseInt((e.target as HTMLInputElement).value),
                        })
                      }
                    />
                    {fieldErrors.estimatedDuration && (
                      <div className="text-red-600 text-sm mt-1">{fieldErrors.estimatedDuration}</div>
                    )}

                    <Flex flex-direction="column" gap="xs">
                      <Textarea
                        label="Cover Letter"
                        value={proposalData.coverLetter}
                        onChange={(e) =>
                          setProposalData({
                            ...proposalData,
                            coverLetter: e.target.value,
                          })
                        }
                        rows={6}
                        required
                      />
                      {fieldErrors.coverLetter && (
                        <div className="text-red-600 text-sm mt-1">{fieldErrors.coverLetter}</div>
                      )}
                    </Flex>

                    <Button type="submit" disabled={submittingProposal}>
                      {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                    </Button>
                  </Flex>
                </form>
              </Card>
            )}

            {/* Quick Stats */}
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h3" font-size="heading-s">
                  Quick Stats
                </Text>
                <Flex flex-direction="column" gap="s">
                  <Flex justify-content="space-between">
                    <Text color="secondary">Budget</Text>
                    <Text font-weight="book">${job.budget}</Text>
                  </Flex>
                  <Flex justify-content="space-between">
                    <Text color="secondary">Status</Text>
                    <Badge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                      {job.status}
                    </Badge>
                  </Flex>
                  <Divider />
                  <Flex justify-content="space-between">
                    <Text font-size="body-s" color="secondary">Posted</Text>
                    <Text font-size="body-s">{new Date(job.createdAt).toLocaleDateString()}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Grid>
      </Flex>
    </PageLayout>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Flex,
  Card,
  Text,
  Button,
  Input,
  Alert,
  Badge,
  Spinner,
  Divider,
} from '@/components/green';
import { PageLayout } from '@/components/layout';
import { authService } from '@/lib/auth';
import { User } from '@/types';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  experienceLevel: string;
  clientId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProposalRequest {
  jobId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalRequest>({
    jobId: 0,
    coverLetter: '',
    proposedRate: 0,
    estimatedDuration: 30,
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);

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
        const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);

        setProposalData((prev) => ({ ...prev, jobId: data.id }));

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
            console.error('Error fetching client details:', err);
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

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      alert('Only freelancers can submit proposals');
      return;
    }

    setSubmittingProposal(true);
    try {
      const response = await fetch(`http://localhost:8080/api/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(proposalData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      alert('Proposal submitted successfully!');
      setProposalOpen(false);
      setProposalData({ jobId: job!.id, coverLetter: '', proposedRate: 0, estimatedDuration: 30 });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
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
      {/* Header */}
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
          {/* Main Content */}
          <Flex flex-direction="column" gap="m">
            {/* Job Description */}
            <Card padding="l">
              <Flex flex-direction="column" gap="m">
                <Text tag="h2" font-size="heading-m">
                  Job Description
                </Text>
                <Text>
                  {job.description}
                </Text>
              </Flex>
            </Card>

            {/* Job Meta */}
            <Grid columns="2" gap="m">
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Category</Text>
                  <Text font-size="heading-s">{job.category}</Text>
                </Flex>
              </Card>
              <Card padding="m">
                <Flex flex-direction="column" gap="xs">
                  <Text font-size="body-s" color="secondary">Experience Level</Text>
                  <Text font-size="heading-s">{job.experienceLevel}</Text>
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
                  <Text font-size="heading-xl">${job.budget}</Text>
                </Flex>
                
                {user && user.role === 'FREELANCER' && user.id !== job.clientId ? (
                  <Button
                    variant={proposalOpen ? 'neutral' : 'brand'}
                    onClick={() => setProposalOpen(!proposalOpen)}
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

                    <Flex flex-direction="column" gap="xs">
                      <Text font-size="body-s" font-weight="book">
                        Cover Letter
                      </Text>
                      <textarea
                        value={proposalData.coverLetter}
                        onChange={(e) =>
                          setProposalData({
                            ...proposalData,
                            coverLetter: e.target.value,
                          })
                        }
                        rows={6}
                      />
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

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  GdsGrid,
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsAlert,
  GdsBadge,
  GdsSpinner,
  GdsDivider,
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
        <GdsFlex justify-content="center" align-items="center" padding="xl" style={{ minHeight: '50vh' } as any}>
          <GdsSpinner />
        </GdsFlex>
      </PageLayout>
    );
  }

  if (error || !job) {
    return (
      <PageLayout>
        <GdsFlex flex-direction="column" padding="l" gap="m">
          <GdsAlert variant="negative">
            Error: {error || 'Job not found'}
          </GdsAlert>
          <Link href="/jobs" style={{ color: 'var(--gds-color-l3-content-positive)', textDecoration: 'none' } as any}>
            ← Back to Jobs
          </Link>
        </GdsFlex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <GdsFlex flex-direction="column" gap="s" padding="l" style={{ borderBottom: '1px solid var(--gds-color-l3-border-primary)' } as any}>
        <Link href="/jobs" style={{ color: 'var(--gds-color-l3-content-positive)', textDecoration: 'none' } as any}>
          ← Back to Jobs
        </Link>
        <GdsText tag="h1" font-size="heading-xl">
          {job.title}
        </GdsText>
      </GdsFlex>

      <GdsFlex padding="l">
        <GdsGrid columns="1; m{3}" gap="l" style={{ width: '100%' } as any}>
          {/* Main Content */}
          <GdsFlex flex-direction="column" gap="m" style={{ gridColumn: 'span 2' } as any}>
            {/* Job Description */}
            <GdsCard padding="l">
              <GdsFlex flex-direction="column" gap="m">
                <GdsText tag="h2" font-size="heading-m">
                  Job Description
                </GdsText>
                <GdsText style={{ whiteSpace: 'pre-wrap' } as any}>
                  {job.description}
                </GdsText>
              </GdsFlex>
            </GdsCard>

            {/* Job Meta */}
            <GdsGrid columns="2" gap="m">
              <GdsCard padding="m">
                <GdsFlex flex-direction="column" gap="xs">
                  <GdsText font-size="body-s" color="secondary">Category</GdsText>
                  <GdsText font-size="heading-s">{job.category}</GdsText>
                </GdsFlex>
              </GdsCard>
              <GdsCard padding="m">
                <GdsFlex flex-direction="column" gap="xs">
                  <GdsText font-size="body-s" color="secondary">Experience Level</GdsText>
                  <GdsText font-size="heading-s">{job.experienceLevel}</GdsText>
                </GdsFlex>
              </GdsCard>
              <GdsCard padding="m">
                <GdsFlex flex-direction="column" gap="xs">
                  <GdsText font-size="body-s" color="secondary">Status</GdsText>
                  <GdsBadge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                    {job.status}
                  </GdsBadge>
                </GdsFlex>
              </GdsCard>
              <GdsCard padding="m">
                <GdsFlex flex-direction="column" gap="xs">
                  <GdsText font-size="body-s" color="secondary">Posted</GdsText>
                  <GdsText font-size="heading-s">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </GdsText>
                </GdsFlex>
              </GdsCard>
            </GdsGrid>

            {/* Client Info */}
            {client && (
              <GdsCard padding="l">
                <GdsFlex flex-direction="column" gap="m">
                  <GdsText tag="h2" font-size="heading-m">
                    About the Client
                  </GdsText>
                  <GdsFlex justify-content="space-between" align-items="center">
                    <GdsFlex flex-direction="column" gap="xs">
                      <GdsText font-size="heading-s">{client.fullName}</GdsText>
                      <GdsText font-size="body-s" color="secondary">@{client.username}</GdsText>
                      <GdsText font-size="body-s" color="secondary">{client.email}</GdsText>
                    </GdsFlex>
                    <Link
                      href={`/users/${client.id}/profile`}
                      style={{ color: 'var(--gds-color-l3-content-positive)', textDecoration: 'none' } as any}
                    >
                      View Profile →
                    </Link>
                  </GdsFlex>
                </GdsFlex>
              </GdsCard>
            )}
          </GdsFlex>

          {/* Sidebar */}
          <GdsFlex flex-direction="column" gap="m">
            {/* Budget Card */}
            <GdsCard padding="l" variant="positive">
              <GdsFlex flex-direction="column" gap="m">
                <GdsFlex flex-direction="column" gap="xs">
                  <GdsText font-size="body-s">Budget</GdsText>
                  <GdsText font-size="heading-xl">${job.budget}</GdsText>
                </GdsFlex>
                
                {user && user.role === 'FREELANCER' && user.id !== job.clientId ? (
                  <GdsButton
                    variant={proposalOpen ? 'neutral' : 'brand'}
                    onClick={() => setProposalOpen(!proposalOpen)}
                  >
                    {proposalOpen ? 'Cancel' : 'Send Proposal'}
                  </GdsButton>
                ) : user && user.id === job.clientId ? (
                  <GdsCard padding="m" variant="information">
                    <GdsText font-size="body-s" style={{ textAlign: 'center' } as any}>
                      This is your job posting
                    </GdsText>
                  </GdsCard>
                ) : (
                  <Link href="/auth/login">
                    <GdsButton rank="secondary" style={{ width: '100%' } as any}>
                      Sign In to Propose
                    </GdsButton>
                  </Link>
                )}
              </GdsFlex>
            </GdsCard>

            {/* Proposal Form */}
            {proposalOpen && user && user.role === 'FREELANCER' && (
              <GdsCard padding="l">
                <form onSubmit={handleProposalSubmit}>
                  <GdsFlex flex-direction="column" gap="m">
                    <GdsText tag="h3" font-size="heading-s">
                      Submit Your Proposal
                    </GdsText>

                    <GdsInput
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

                    <GdsInput
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

                    <GdsFlex flex-direction="column" gap="xs">
                      <GdsText font-size="body-s" font-weight="book">
                        Cover Letter
                      </GdsText>
                      <textarea
                        value={proposalData.coverLetter}
                        onChange={(e) =>
                          setProposalData({
                            ...proposalData,
                            coverLetter: e.target.value,
                          })
                        }
                        rows={6}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid var(--gds-color-l3-border-primary)',
                          backgroundColor: 'var(--gds-color-l3-background-primary)',
                          color: 'var(--gds-color-l3-content-primary)',
                          fontSize: '0.875rem',
                          width: '100%',
                          resize: 'vertical',
                        } as any}
                      />
                    </GdsFlex>

                    <GdsButton type="submit" disabled={submittingProposal}>
                      {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                    </GdsButton>
                  </GdsFlex>
                </form>
              </GdsCard>
            )}

            {/* Quick Stats */}
            <GdsCard padding="l">
              <GdsFlex flex-direction="column" gap="m">
                <GdsText tag="h3" font-size="heading-s">
                  Quick Stats
                </GdsText>
                <GdsFlex flex-direction="column" gap="s">
                  <GdsFlex justify-content="space-between">
                    <GdsText color="secondary">Budget</GdsText>
                    <GdsText font-weight="book">${job.budget}</GdsText>
                  </GdsFlex>
                  <GdsFlex justify-content="space-between">
                    <GdsText color="secondary">Status</GdsText>
                    <GdsBadge variant={job.status === 'OPEN' ? 'positive' : 'information'}>
                      {job.status}
                    </GdsBadge>
                  </GdsFlex>
                  <GdsDivider />
                  <GdsFlex justify-content="space-between">
                    <GdsText font-size="body-s" color="secondary">Posted</GdsText>
                    <GdsText font-size="body-s">{new Date(job.createdAt).toLocaleDateString()}</GdsText>
                  </GdsFlex>
                </GdsFlex>
              </GdsFlex>
            </GdsCard>
          </GdsFlex>
        </GdsGrid>
      </GdsFlex>
    </PageLayout>
  );
}

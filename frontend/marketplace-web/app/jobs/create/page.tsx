'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import {
  GdsCard,
  GdsFlex,
  GdsGrid,
  GdsText,
  GdsButton,
  GdsInput,
  GdsDiv,
  GdsDivider,
  GdsSpinner,
  GdsAlert,
} from '@/components/green';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'WEB_DESIGN',
    experienceLevel: 'INTERMEDIATE',
    budget: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'CLIENT') {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create job (${response.status})`
        );
      }

      const newJob = await response.json();
      alert('Job created successfully!');
      router.push(`/jobs/${newJob.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GdsFlex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <GdsSpinner />
      </GdsFlex>
    );
  }

  return (
    <GdsDiv style={{ minHeight: '100vh', background: 'var(--gds-color-l3-background-secondary)' } as any}>
      {/* Header */}
      <GdsDiv style={{ background: 'var(--gds-color-l3-background-positive)', color: 'white', padding: '3rem 0' } as any}>
        <GdsFlex flex-direction="column" gap="m" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' } as any}>
          <GdsText tag="h1" style={{ fontSize: '2.5rem', fontWeight: 700 } as any}>Post a New Job</GdsText>
          <GdsText style={{ fontSize: '1.125rem', opacity: 0.9 } as any}>
            Find the right freelancer for your project
          </GdsText>
        </GdsFlex>
      </GdsDiv>

      <GdsFlex flex-direction="column" gap="xl" padding="xl" style={{ maxWidth: '800px', margin: '0 auto' } as any}>
        {error && (
          <GdsAlert variant="negative">
            Error: {error}
          </GdsAlert>
        )}

        <GdsCard>
          <form onSubmit={handleSubmit}>
            <GdsFlex flex-direction="column" gap="l" padding="l">
              {/* Job Title */}
              <GdsDiv>
                <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Job Title *</GdsText>
                <GdsInput
                  label=""
                  name="title"
                  value={formData.title}
                  onInput={(e: Event) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  required
                />
              </GdsDiv>

              {/* Job Description */}
              <GdsDiv>
                <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Job Description *</GdsText>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    borderRadius: '4px',
                    background: 'var(--gds-color-l3-background-secondary)',
                    color: 'var(--gds-color-l3-content-primary)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical',
                  } as any}
                />
              </GdsDiv>

              {/* Category and Experience Level */}
              <GdsGrid columns="1; m{2}" gap="l">
                <GdsDiv>
                  <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Category *</GdsText>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gds-color-l3-border-primary)',
                      borderRadius: '4px',
                      background: 'var(--gds-color-l3-background-secondary)',
                      color: 'var(--gds-color-l3-content-primary)',
                      fontSize: '1rem',
                    } as any}
                  >
                    <option value="WEB_DESIGN">Web Design</option>
                    <option value="GRAPHIC_DESIGN">Graphic Design</option>
                    <option value="MOBILE_DEV">Mobile Development</option>
                    <option value="WEB_DEV">Web Development</option>
                    <option value="DATA_ENTRY">Data Entry</option>
                    <option value="WRITING">Writing</option>
                  </select>
                </GdsDiv>

                <GdsDiv>
                  <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Required Experience Level *</GdsText>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--gds-color-l3-border-primary)',
                      borderRadius: '4px',
                      background: 'var(--gds-color-l3-background-secondary)',
                      color: 'var(--gds-color-l3-content-primary)',
                      fontSize: '1rem',
                    } as any}
                  >
                    <option value="ENTRY">Entry</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </GdsDiv>
              </GdsGrid>

              {/* Budget */}
              <GdsDiv>
                <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Budget ($) *</GdsText>
                <GdsFlex align-items="center" gap="s">
                  <GdsText style={{ fontSize: '1.25rem' } as any}>$</GdsText>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    required
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid var(--gds-color-l3-border-primary)',
                      borderRadius: '4px',
                      background: 'var(--gds-color-l3-background-secondary)',
                      color: 'var(--gds-color-l3-content-primary)',
                      fontSize: '1rem',
                    } as any}
                  />
                </GdsFlex>
              </GdsDiv>

              <GdsDivider />

              {/* Submit Buttons */}
              <GdsFlex gap="m" justify-content="flex-end">
                <Link href="/dashboard">
                  <GdsButton rank="secondary" type="button">
                    Cancel
                  </GdsButton>
                </Link>
                <GdsButton rank="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Creating Job...' : 'Post Job'}
                </GdsButton>
              </GdsFlex>
            </GdsFlex>
          </form>
        </GdsCard>

        {/* Helpful Tips */}
        <GdsCard>
          <GdsFlex flex-direction="column" gap="l" padding="l">
            <GdsText tag="h2" style={{ fontSize: '1.5rem', fontWeight: 600 } as any}>
              Tips for Writing a Great Job Post
            </GdsText>
            <GdsFlex flex-direction="column" gap="m">
              {[
                { num: 1, title: 'Be Specific:', desc: 'Clearly describe what you need, the deliverables, and the timeline.' },
                { num: 2, title: 'Set Realistic Budget:', desc: 'Research market rates to attract quality freelancers.' },
                { num: 3, title: 'Include Examples:', desc: "Provide references or examples of what you're looking for." },
                { num: 4, title: 'Mention Timeline:', desc: 'Let freelancers know your project deadline.' },
              ].map((tip) => (
                <GdsFlex key={tip.num} align-items="flex-start" gap="m">
                  <GdsDiv
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--gds-color-l3-background-positive)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      flexShrink: 0,
                    } as any}
                  >
                    {tip.num}
                  </GdsDiv>
                  <GdsDiv>
                    <GdsText>
                      <strong>{tip.title}</strong> {tip.desc}
                    </GdsText>
                  </GdsDiv>
                </GdsFlex>
              ))}
            </GdsFlex>
          </GdsFlex>
        </GdsCard>
      </GdsFlex>
    </GdsDiv>
  );
}

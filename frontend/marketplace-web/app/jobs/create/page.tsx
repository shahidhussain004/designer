'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Input,
  Div,
  Divider,
  Spinner,
  Alert,
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
      <Flex justify-content="center" align-items="center" padding="xl">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Div>
      {/* Header */}
      <Div padding="xl">
        <Flex flex-direction="column" gap="m">
          <Text tag="h1">Post a New Job</Text>
          <Text>
            Find the right freelancer for your project
          </Text>
        </Flex>
      </Div>

      <Flex flex-direction="column" gap="xl" padding="xl">
        {error && (
          <Alert variant="negative">
            Error: {error}
          </Alert>
        )}

        <Card>
          <form onSubmit={handleSubmit}>
            <Flex flex-direction="column" gap="l" padding="l">
              {/* Job Title */}
              <Div>
                <Text>Job Title *</Text>
                <Input
                  label=""
                  name="title"
                  value={formData.title}
                  onInput={(e: Event) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  required
                />
              </Div>

              {/* Job Description */}
              <Div>
                <Text>Job Description *</Text>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  required
                />
              </Div>

              {/* Category and Experience Level */}
              <Grid columns="1; m{2}" gap="l">
                <Div>
                  <Text>Category *</Text>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="WEB_DESIGN">Web Design</option>
                    <option value="GRAPHIC_DESIGN">Graphic Design</option>
                    <option value="MOBILE_DEV">Mobile Development</option>
                    <option value="WEB_DEV">Web Development</option>
                    <option value="DATA_ENTRY">Data Entry</option>
                    <option value="WRITING">Writing</option>
                  </select>
                </Div>

                <Div>
                  <Text>Required Experience Level *</Text>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="ENTRY">Entry</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </Div>
              </Grid>

              {/* Budget */}
              <Div>
                <Text>Budget ($) *</Text>
                <Flex align-items="center" gap="s">
                  <Text>$</Text>
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
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      background: '#f3f4f6',
                      color: '#111827',
                      fontSize: '1rem',
                    } as any}
                  />
                </Flex>
              </Div>

              <Divider />

              {/* Submit Buttons */}
              <Flex gap="m" justify-content="flex-end">
                <Link href="/dashboard">
                  <Button rank="secondary" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button rank="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Creating Job...' : 'Post Job'}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>

        {/* Helpful Tips */}
        <Card>
          <Flex flex-direction="column" gap="l" padding="l">
            <Text tag="h2">
              Tips for Writing a Great Job Post
            </Text>
            <Flex flex-direction="column" gap="m">
              {[
                { num: 1, title: 'Be Specific:', desc: 'Clearly describe what you need, the deliverables, and the timeline.' },
                { num: 2, title: 'Set Realistic Budget:', desc: 'Research market rates to attract quality freelancers.' },
                { num: 3, title: 'Include Examples:', desc: "Provide references or examples of what you're looking for." },
                { num: 4, title: 'Mention Timeline:', desc: 'Let freelancers know your project deadline.' },
              ].map((tip) => (
                <Flex key={tip.num} align-items="flex-start" gap="m">
                  <Div>
                    {tip.num}
                  </Div>
                  <Div>
                    <Text>
                      <strong>{tip.title}</strong> {tip.desc}
                    </Text>
                  </Div>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Div>
  );
}

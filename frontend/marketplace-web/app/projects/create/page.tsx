'use client';

import {
  Alert,
  Button,
  Card,
  Div,
  Divider,
  Flex,
  Grid,
  Input,
  Spinner,
  Text,
} from '@/components/green';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import type { ExperienceLevel, JobCategory } from '@/lib/apiTypes';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 1,
    experienceLevelId: 2,
    budget: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'CLIENT') {
      router.push('/auth/login');
      return;
    }
    
    // Fetch categories and experience levels
    const fetchFilters = async () => {
      try {
        const [catsResponse, levelsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/job-categories'),
          fetch('http://localhost:8080/api/experience-levels')
        ]);
        
        if (catsResponse.ok) {
          const catsData = await catsResponse.json();
          const mappedCats = parseCategories(catsData);
          setCategories(mappedCats);
          if (mappedCats.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: mappedCats[0].id }));
          }
        }
        
        if (levelsResponse.ok) {
          const levelsData = await levelsResponse.json();
          const mappedLevels = parseExperienceLevels(levelsData);
          setExperienceLevels(mappedLevels);
          if (mappedLevels.length > 0) {
            setFormData(prev => ({ ...prev, experienceLevelId: mappedLevels[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    };
    
    fetchFilters();
    setLoading(false);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) : 
              (name === 'categoryId' || name === 'experienceLevelId') ? parseInt(value) : value,
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

      const response = await fetch('http://localhost:8080/api/projects', {
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
          errorData.message || `Failed to create project (${response.status})`
        );
      }

      const newProject = await response.json();
      alert('Project created successfully!');
      router.push(`/projects/${newProject.id}`);
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
                  onChange={handleChange}
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
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </Div>

                <Div>
                  <Text>Required Experience Level *</Text>
                  <select
                    name="experienceLevelId"
                    value={formData.experienceLevelId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
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

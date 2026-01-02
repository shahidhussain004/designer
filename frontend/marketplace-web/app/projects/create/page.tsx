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
  Text,
} from '@/components/green';
import { LoadingSpinner } from '@/components/Skeletons';
import { useCreateProject, useExperienceLevels, useProjectCategories } from '@/hooks/useProjects';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function CreateProjectPage() {
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  const { data: categoriesData, isLoading: categoriesLoading } = useProjectCategories();
  const { data: experienceLevelsData, isLoading: levelsLoading } = useExperienceLevels();
  
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => parseCategories(categoriesData), [categoriesData]);
  const experienceLevels = useMemo(() => parseExperienceLevels(experienceLevelsData), [experienceLevelsData]);
  const loading = categoriesLoading || levelsLoading;

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
  }, [router]);

  useEffect(() => {
    if (categories.length > 0 && formData.categoryId === 1) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);

  useEffect(() => {
    if (experienceLevels.length > 0 && formData.experienceLevelId === 2) {
      setFormData(prev => ({ ...prev, experienceLevelId: experienceLevels[0].id }));
    }
  }, [experienceLevels]);

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
    setError(null);

    try {
      const newProject = await createProjectMutation.mutateAsync(formData);
      alert('Project created successfully!');
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <Div>
      {/* Header */}
      <Div padding="xl">
        <Flex flex-direction="column" gap="m">
          <Text tag="h1">Post a New Project</Text>
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
              {/* Project Title */}
              <Div>
                <Text>Project Title *</Text>
                <Input
                  label=""
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Div>

              {/* Project Description */}
              <Div>
                <Text>Project Description *</Text>
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
                <Button rank="primary" type="submit" disabled={createProjectMutation.isPending}>
                  {createProjectMutation.isPending ? 'Creating Project...' : 'Post Project'}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>

        {/* Helpful Tips */}
        <Card>
          <Flex flex-direction="column" gap="l" padding="l">
            <Text tag="h2">
              Tips for Writing a Great Project Post
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

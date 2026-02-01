'use client';

import { LoadingSpinner } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useCreateProject, useExperienceLevels, useProjectCategories } from '@/hooks/useProjects';
import { parseCategories, parseExperienceLevels } from '@/lib/apiParsers';
import { authService } from '@/lib/auth';
import { AlertCircle, ArrowLeft, Briefcase, DollarSign, Lightbulb } from 'lucide-react';
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
    budgetType: 'FIXED' as const,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'COMPANY') {
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
      <PageLayout>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  const tips = [
    { num: 1, title: 'Be Specific:', desc: 'Clearly describe what you need, the deliverables, and the timeline.' },
    { num: 2, title: 'Set Realistic Budget:', desc: 'Research market rates to attract quality freelancers.' },
    { num: 3, title: 'Include Examples:', desc: "Provide references or examples of what you're looking for." },
    { num: 4, title: 'Mention Timeline:', desc: 'Let freelancers know your project deadline.' },
  ];

  return (
    <PageLayout whiteBg={false}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Post a New Project</h1>
              <p className="text-gray-400 mt-1">Find the right freelancer for your project</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="e.g., Website Redesign for E-commerce Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Describe your project in detail. Include goals, requirements, and any specific preferences..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Experience Level *
                  </label>
                  <select
                    name="experienceLevelId"
                    value={formData.experienceLevelId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="flex items-center justify-end gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                >
                  {createProjectMutation.isPending ? 'Creating Project...' : 'Post Project'}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h2 className="font-semibold text-gray-900">Tips for a Great Project Post</h2>
              </div>
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.num} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      {tip.num}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{tip.title}</span> {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}

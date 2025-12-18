'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';

interface User {
  role: string;
  id: number;
}

export default function CreateJobPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
    setUser(currentUser);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Post a New Job</h1>
          <p className="text-lg text-primary-100">
            Find the right freelancer for your project
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Design a Modern Website"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project in detail, requirements, timeline, etc."
              rows={8}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="WEB_DESIGN">Web Design</option>
                <option value="GRAPHIC_DESIGN">Graphic Design</option>
                <option value="MOBILE_DEV">Mobile Development</option>
                <option value="WEB_DEV">Web Development</option>
                <option value="DATA_ENTRY">Data Entry</option>
                <option value="WRITING">Writing</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget ($) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                step="100"
                required
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition"
            >
              {submitting ? 'Creating Job...' : 'Post Job'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Helpful Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Tips for Writing a Great Job Post</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-center text-sm font-bold mr-4 flex-shrink-0">1</span>
              <div>
                <strong>Be Specific:</strong> Clearly describe what you need, the deliverables, and the timeline.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-center text-sm font-bold mr-4 flex-shrink-0">2</span>
              <div>
                <strong>Set Realistic Budget:</strong> Research market rates to attract quality freelancers.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-center text-sm font-bold mr-4 flex-shrink-0">3</span>
              <div>
                <strong>Include Examples:</strong> Provide references or examples of what you're looking for.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-center text-sm font-bold mr-4 flex-shrink-0">4</span>
              <div>
                <strong>Mention Timeline:</strong> Let freelancers know your project deadline.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

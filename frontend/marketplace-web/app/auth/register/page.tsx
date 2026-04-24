'use client';

import { PageLayout, SocialAuthButtons } from '@/components/ui';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    email: string;
    username: string;
    password: string;
    fullName: string;
    role: 'COMPANY' | 'FREELANCER';
  }>({
    email: '',
    username: '',
    password: '',
    fullName: '',
    role: 'FREELANCER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      router.push('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Register Card */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-900">Create your account</h1>
              <p className="mt-2 text-secondary-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-error-700 text-sm">{error}</p>
              </div>
            )}

            {/* Social sign-up */}
            <SocialAuthButtons mode="register" />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-secondary-500">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="johndoe"
                />
                <p className="mt-1 text-xs text-secondary-500">Letters, numbers, and underscores only (3-50 characters)</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="Minimum 8 characters"
                />
                <p className="mt-1 text-xs text-secondary-500">Minimum 8 characters</p>
              </div>

              <div className="border-t border-secondary-200 pt-5">
                <p className="text-sm font-medium text-secondary-700 mb-3">I want to:</p>
                <div className="space-y-3">
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.role === 'FREELANCER'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-300 hover:border-secondary-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="FREELANCER"
                      checked={formData.role === 'FREELANCER'}
                      onChange={() => setFormData({ ...formData, role: 'FREELANCER' })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-input-focus"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-secondary-900">Work as a Freelancer</p>
                      <p className="text-sm text-secondary-500">Find jobs and get hired</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.role === 'COMPANY'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-300 hover:border-secondary-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="COMPANY"
                      checked={formData.role === 'COMPANY'}
                      onChange={() => setFormData({ ...formData, role: 'COMPANY' })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-input-focus"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-secondary-900">Hire as a Company</p>
                      <p className="text-sm text-secondary-500">Post jobs and find talent</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-xs text-secondary-500 text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

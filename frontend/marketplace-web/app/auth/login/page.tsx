'use client'

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(formData)
      router.push('/dashboard')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Designer<span className="text-primary-600">Hub</span>
            </Link>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
              <p className="mt-2 text-gray-600">
                Or{' '}
                <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  create a new account
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <input
                  id="emailOrUsername"
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="Enter your email or username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-input-focus"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 mb-4">Test Credentials</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Client:</span> client1@example.com / password123</p>
                <p><span className="font-medium">Freelancer:</span> freelancer1@example.com / password123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

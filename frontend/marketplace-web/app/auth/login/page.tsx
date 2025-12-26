'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { GdsFlex, GdsCard, GdsText, GdsInput, GdsButton, GdsAlert, GdsDivider, GdsCheckbox, GdsDiv } from '@/components/green'
import { PageLayout } from '@/components/layout'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      <GdsFlex 
        justify-content="center" 
        align-items="center" 
        padding="xl"
        min-height="calc(100vh - 200px)"
      >
        <GdsCard padding="xl" variant="secondary" max-width="400px" width="100%">
          <GdsFlex flex-direction="column" gap="l">
            <GdsFlex flex-direction="column" align-items="center" gap="s">
              <GdsText tag="h1" font="heading-l">Sign in to your account</GdsText>
              <GdsText font="body-regular-m" color="neutral-02">
                Or{' '}
                <Link href="/auth/register" style={{ color: 'var(--gds-sys-color-content-brand-01)' } as any}>
                  create a new account
                </Link>
              </GdsText>
            </GdsFlex>

            {error && (
              <GdsAlert variant="negative" role="alert">
                Error: {error}
              </GdsAlert>
            )}

            <form onSubmit={handleSubmit}>
              <GdsFlex flex-direction="column" gap="m">
                <GdsInput
                  label="Email or Username"
                  value={formData.emailOrUsername}
                  onInput={(e: unknown) => {
                    const target = e as { target?: { value?: string } }
                    setFormData({ ...formData, emailOrUsername: target?.target?.value ?? '' })
                  }}
                  required
                />
                
                <GdsInput
                  label="Password"
                  type="password"
                  value={formData.password}
                  onInput={(e: unknown) => {
                    const target = e as { target?: { value?: string } }
                    setFormData({ ...formData, password: target?.target?.value ?? '' })
                  }}
                  required
                />

                <GdsFlex justify-content="space-between" align-items="center">
                  <GdsCheckbox>
                    <GdsText slot="label">Remember me</GdsText>
                  </GdsCheckbox>
                  <Link href="#" style={{ textDecoration: 'none' } as any}>
                    <GdsText font="body-regular-s" color="brand-01">
                      Forgot your password?
                    </GdsText>
                  </Link>
                </GdsFlex>

                <GdsButton 
                  rank="primary" 
                  type="submit" 
                  disabled={loading}
                  width="100%"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </GdsButton>
              </GdsFlex>
            </form>

            <GdsDivider />

            <GdsDiv>
              <GdsText font="body-regular-s" color="neutral-02" text-align="center" margin-bottom="s">
                Test Credentials
              </GdsText>
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font="body-regular-s" color="neutral-02">
                  <strong>Client:</strong> client1@example.com / password123
                </GdsText>
                <GdsText font="body-regular-s" color="neutral-02">
                  <strong>Freelancer:</strong> freelancer1@example.com / password123
                </GdsText>
              </GdsFlex>
            </GdsDiv>
          </GdsFlex>
        </GdsCard>
      </GdsFlex>
    </PageLayout>
  )
}

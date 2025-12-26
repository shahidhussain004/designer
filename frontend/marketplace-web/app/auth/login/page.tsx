'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { Flex, Card, Text, Input, Button, Alert, Divider, Checkbox, Div } from '@/components/green'
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
      <Flex 
        justify-content="center" 
        align-items="center" 
        padding="xl"
        min-height="calc(100vh - 200px)"
      >
        <Card padding="xl" variant="secondary" max-width="400px" width="100%">
          <Flex flex-direction="column" gap="l">
            <Flex flex-direction="column" align-items="center" gap="s">
              <Text tag="h1" font="heading-l">Sign in to your account</Text>
              <Text font="body-regular-m" color="neutral-02">
                Or{' '}
                <Link href="/auth/register">
                  create a new account
                </Link>
              </Text>
            </Flex>

            {error && (
              <Alert variant="negative" role="alert">
                Error: {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Flex flex-direction="column" gap="m">
                <Input
                  label="Email or Username"
                  value={formData.emailOrUsername}
                  onInput={(e: unknown) => {
                    const target = e as { target?: { value?: string } }
                    setFormData({ ...formData, emailOrUsername: target?.target?.value ?? '' })
                  }}
                  required
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onInput={(e: unknown) => {
                    const target = e as { target?: { value?: string } }
                    setFormData({ ...formData, password: target?.target?.value ?? '' })
                  }}
                  required
                />

                <Flex justify-content="space-between" align-items="center">
                  <Checkbox>
                    <Text slot="label">Remember me</Text>
                  </Checkbox>
                  <Link href="#">
                    <Text font="body-regular-s" color="brand-01">
                      Forgot your password?
                    </Text>
                  </Link>
                </Flex>

                <Button 
                  rank="primary" 
                  type="submit" 
                  disabled={loading}
                  width="100%"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Flex>
            </form>

            <Divider />

            <Div>
              <Text font="body-regular-s" color="neutral-02" text-align="center" margin-bottom="s">
                Test Credentials
              </Text>
              <Flex flex-direction="column" gap="xs">
                <Text font="body-regular-s" color="neutral-02">
                  <strong>Client:</strong> client1@example.com / password123
                </Text>
                <Text font="body-regular-s" color="neutral-02">
                  <strong>Freelancer:</strong> freelancer1@example.com / password123
                </Text>
              </Flex>
            </Div>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}

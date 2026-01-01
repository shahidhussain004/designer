"use client"

import { Button, Flex, Input, Textarea } from '@/components/green'
import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
          // Keeping the fetch call as is
          const resp = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message }),
          });

      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data?.error || 'Failed to send')
      }

      setSuccess('Your message has been sent — we will reply soon.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : String(err ?? 'Failed to submit form')
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex flex-direction="column" gap="m">
        <div>
          <Input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Input type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <Input placeholder="What is this about?" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>

        <div>
          <Textarea placeholder="Tell us more about your inquiry..." rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>

        <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</Button>
        {success && <div style={{ color: 'green', marginTop: '0.5rem' }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
      </Flex>
    </form>
  )
}

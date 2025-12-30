import { NextResponse } from 'next/server'

type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json()

    // Basic validation
    if (!body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Forward to backend or external service.
    // Configure SUPPORT_ENDPOINT in environment (e.g., https://api.example.com/support/contact)
    const supportEndpoint = process.env.SUPPORT_ENDPOINT || ''

    if (supportEndpoint) {
      const resp = await fetch(supportEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!resp.ok) {
        const text = await resp.text()
        return NextResponse.json({ error: 'Failed to forward message', detail: text }, { status: 502 })
      }

      return NextResponse.json({ success: true })
    }

    // No external endpoint - as fallback, log the message on server and return success
    console.log('[contact]', body)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

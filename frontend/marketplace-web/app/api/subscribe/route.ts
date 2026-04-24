import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'footer' } = body

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const backendRes = await fetch(`${BACKEND_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.message ?? 'Failed to subscribe' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({ success: true, message: data.message }, { status: 200 })
  } catch (error) {
    console.error('Subscription proxy error:', error)
    return NextResponse.json({ error: 'Service unavailable. Please try again.' }, { status: 503 })
  }
}

'use client'

import { authService } from '@/lib/auth'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Window-level typings for the Google GSI and MSAL browser SDKs loaded via CDN
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          renderButton: (element: HTMLElement, options: object) => void
          prompt: () => void
        }
      }
    }
    msal?: {
      PublicClientApplication: new (config: object) => {
        loginPopup: (request: object) => Promise<{ accessToken: string }>
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RoleInfo {
  email: string
  fullName: string | null
  pictureUrl: string | null
}

interface PendingOAuth {
  provider: string
  token: string
  info: RoleInfo
}

export interface SocialAuthButtonsProps {
  /** Show on login vs register page (affects button label text). */
  mode?: 'login' | 'register'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders "Continue with Google" / "Continue with Microsoft" buttons.
 *
 * When the OAuth response indicates that the email is new, the component
 * switches into an inline role-selection view, then completes the sign-up.
 *
 * Required environment variables (set in .env.local):
 *   NEXT_PUBLIC_GOOGLE_CLIENT_ID      – Google OAuth 2 client ID
 *   NEXT_PUBLIC_MICROSOFT_CLIENT_ID   – Azure AD app (client) ID
 */
export function SocialAuthButtons({ mode = 'login' }: SocialAuthButtonsProps) {
  const router = useRouter()
  const { refreshUser } = useAuth()

  const [googleReady, setGoogleReady] = useState(false)
  const [msalReady, setMsalReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Role-selection state – non-null when the email is new
  const [pending, setPending] = useState<PendingOAuth | null>(null)
  const [selectedRole, setSelectedRole] = useState<'FREELANCER' | 'COMPANY'>('FREELANCER')

  const googleBtnRef = useRef<HTMLDivElement>(null)
  const googleInitializedRef = useRef(false)  // Track if Google GSI has been initialized

  const googleClientId  = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const msalClientId    = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID

  // ── Core: send OAuth token to our backend ─────────────────────────────────

  const handleOAuthToken = useCallback(
    async (provider: string, token: string, role?: string) => {
      setBusy(true)
      setErrorMsg(null)

      try {
        const result = await authService.oauthLogin(provider, token, role)

        if (result.requiresRoleSelection) {
          // Email is new – show role selection
          setPending({
            provider,
            token,
            info: {
              email:      result.email     ?? '',
              fullName:   result.fullName  ?? null,
              pictureUrl: result.pictureUrl ?? null,
            },
          })
          setBusy(false)
          return
        }

        // Logged in – sync auth state and navigate
        await refreshUser()
        router.push('/dashboard')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
        setBusy(false)
      }
    },
    [refreshUser, router],
  )

  // ── Google Sign-In via Google Identity Services (GSI) ─────────────────────

  useEffect(() => {
    // Only initialize once per component lifetime
    if (googleInitializedRef.current || !googleReady || !googleClientId || !window.google?.accounts?.id) return
    googleInitializedRef.current = true

    window.google.accounts.id.initialize({
      client_id:             googleClientId,
      callback:              (response: { credential: string }) =>
                               handleOAuthToken('google', response.credential),
      use_fedcm_for_prompt:  false,
    })

    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme:  'outline',
        size:   'large',
        width:  googleBtnRef.current.offsetWidth || 360,
        text:   mode === 'register' ? 'signup_with' : 'signin_with',
        shape:  'rectangular',
        locale: 'en',
      })
    }
  }, [googleReady, googleClientId, mode, handleOAuthToken])

  // ── Microsoft Sign-In via MSAL browser SDK ────────────────────────────────

  const handleMicrosoftLogin = useCallback(async () => {
    if (!msalClientId || !window.msal) {
      setErrorMsg('Microsoft Sign-In is not configured for this environment.')
      return
    }

    try {
      setBusy(true)
      const msalInstance = new window.msal.PublicClientApplication({
        auth: {
          clientId:    msalClientId,
          redirectUri: window.location.origin,
        },
        cache: { cacheLocation: 'sessionStorage' },
      })

      const result = await msalInstance.loginPopup({
        scopes: ['User.Read', 'email', 'profile', 'openid'],
      })

      await handleOAuthToken('microsoft', result.accessToken)
    } catch (err) {
      setBusy(false)
      setErrorMsg(err instanceof Error ? err.message : 'Microsoft Sign-In failed.')
    }
  }, [msalClientId, handleOAuthToken])

  // ── Role selection (new users only) ──────────────────────────────────────

  const handleRoleSubmit = () => {
    if (!pending) return
    handleOAuthToken(pending.provider, pending.token, selectedRole)
  }

  const handleRoleCancel = () => {
    setPending(null)
    setErrorMsg(null)
  }

  // ── Render: role-selection screen ─────────────────────────────────────────

  if (pending) {
    return (
      <div className="space-y-5">
        {/* Profile preview */}
        <div className="text-center">
          {pending.info.pictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pending.info.pictureUrl}
              alt=""
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
              {(pending.info.fullName ?? pending.info.email)[0].toUpperCase()}
            </div>
          )}
          {pending.info.fullName && (
            <p className="font-semibold text-gray-900">{pending.info.fullName}</p>
          )}
          <p className="text-sm text-gray-500">{pending.info.email}</p>
        </div>

        <p className="text-sm font-medium text-gray-700 text-center">
          Almost there! How will you use the platform?
        </p>

        {/* Role picker */}
        <div className="space-y-3">
          {(
            [
              { value: 'FREELANCER', title: 'Work as a Freelancer', sub: 'Find jobs and get hired' },
              { value: 'COMPANY',    title: 'Hire as a Company',     sub: 'Post jobs and find talent' },
            ] as const
          ).map(({ value, title, sub }) => (
            <label
              key={value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRole === value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="oauth_role"
                value={value}
                checked={selectedRole === value}
                onChange={() => setSelectedRole(value)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-input-focus"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{sub}</p>
              </div>
            </label>
          ))}
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600 text-center">{errorMsg}</p>
        )}

        <button
          type="button"
          onClick={handleRoleSubmit}
          disabled={busy}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={handleRoleCancel}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to sign-in options
        </button>
      </div>
    )
  }

  // ── Render: OAuth buttons ─────────────────────────────────────────────────

  const hasAnyProvider = !!googleClientId || !!msalClientId

  if (!hasAnyProvider) return null

  return (
    <div className="space-y-3">
      {/* Google – rendered by Google GSI inside the ref div */}
      {googleClientId && (
        <>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => setGoogleReady(true)}
          />
          {/* Google renders its iframe button here */}
          <div
            ref={googleBtnRef}
            className="w-full rounded-lg overflow-hidden"
            style={{ minHeight: 44 }}
          />
        </>
      )}

      {/* Microsoft */}
      {msalClientId && (
        <>
          <Script
            src="https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js"
            strategy="afterInteractive"
            onLoad={() => setMsalReady(true)}
          />
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={busy || !msalReady}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Microsoft logomark */}
            <svg viewBox="0 0 21 21" width="20" height="20" aria-hidden="true">
              <path fill="#f25022" d="M0 0h10v10H0z" />
              <path fill="#00a4ef" d="M11 0h10v10H11z" />
              <path fill="#7fba00" d="M0 11h10v10H0z" />
              <path fill="#ffb900" d="M11 11h10v10H11z" />
            </svg>
            {mode === 'register' ? 'Sign up with Microsoft' : 'Continue with Microsoft'}
          </button>
        </>
      )}

      {errorMsg && (
        <p className="text-sm text-red-600 text-center">{errorMsg}</p>
      )}

      {busy && !pending && (
        <p className="text-sm text-gray-500 text-center">Authenticating…</p>
      )}
    </div>
  )
}

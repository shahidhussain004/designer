"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * The portfolio has been consolidated to a single route: /portfolio
 * This redirect ensures any links to the old dashboard sub-route
 * continue to work without a dead end.
 */
export default function PortfolioRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/portfolio")
  }, [router])

  return null
}

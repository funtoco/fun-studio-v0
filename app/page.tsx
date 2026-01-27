"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const searchParams = new URLSearchParams(window.location.search)
    const type = hashParams.get("type") || searchParams.get("type")
    const hasAccessToken = hashParams.has("access_token")
    const hasRecoveryToken = searchParams.has("token")

    if (type && (hasAccessToken || hasRecoveryToken)) {
      const search = window.location.search
      const hash = window.location.hash
      router.replace(`/auth/set-password${search}${hash}`)
      return
    }

    router.replace("/login")
  }, [router])

  return null
}

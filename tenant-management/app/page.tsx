"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // デフォルトでテナントページにリダイレクト
    redirect("/tenants")
  }, [])

  return null
}

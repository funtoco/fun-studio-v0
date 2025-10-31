import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ConditionalLayout } from "@/components/layout/conditional-layout"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "FunStudio - 外国人管理システム",
  description: "外国人人材のビザ進捗と面談記録などを管理するシステム",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <ConditionalLayout>
            <Suspense fallback={null}>{children}</Suspense>
          </ConditionalLayout>
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

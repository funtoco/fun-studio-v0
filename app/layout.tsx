import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CompanyProvider } from "@/contexts/company-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ConditionalLayout } from "@/components/layout/conditional-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "FunStudio - ビザ進捗管理システム",
  description: "外国人人材のビザ進捗と面談記録を管理するシステム",
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
          <CompanyProvider>
            <ConditionalLayout>
              <Suspense fallback={null}>{children}</Suspense>
            </ConditionalLayout>
          </CompanyProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

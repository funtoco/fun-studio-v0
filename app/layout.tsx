import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
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
          <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
            </div>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

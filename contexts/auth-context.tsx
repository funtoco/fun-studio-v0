"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  role: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, tenantName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()
  
  // 環境変数が設定されていない場合は認証を無効化
  const isAuthEnabled = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    if (!isAuthEnabled) {
      console.log("認証機能が無効化されています（環境変数未設定）")
      setUser(null)
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("AuthContext - Initial session:", session)
        console.log("AuthContext - Initial user:", session?.user)
        setUser(session?.user ?? null)
        setRole(session?.user?.user_metadata?.role ?? null)
        setLoading(false)
      } catch (error) {
        console.error("認証セッション取得エラー:", error)
        setUser(null)
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("AuthContext - Auth state change:", event, session)
      setUser(session?.user ?? null)
      setRole(session?.user?.user_metadata?.role ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, isAuthEnabled])

  const signIn = async (email: string, password: string) => {
    if (!isAuthEnabled) {
      console.log("認証機能が無効化されているため、ログインをスキップします")
      return { error: new Error("認証機能が無効化されています") }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (!error) {
        // ログイン成功時はミドルウェアがリダイレクトを処理
        window.location.href = "/dashboard"
      }
      
      return { error }
    } catch (error) {
      console.error("ログインエラー:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, tenantName?: string) => {
    if (!isAuthEnabled) {
      console.log("認証機能が無効化されているため、サインアップをスキップします")
      return { error: new Error("認証機能が無効化されています") }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            tenant_name: tenantName,
          },
        },
      })

      if (error) {
        return { error }
      }

      // If tenant name is provided, create tenant and user_tenants record
      if (tenantName && data.user) {
        try {
          const response = await fetch('/api/auth/signup-with-tenant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              tenantName: tenantName,
            }),
          })

          if (!response.ok) {
            console.error('Failed to create tenant during signup')
          }
        } catch (tenantError) {
          console.error('Error creating tenant during signup:', tenantError)
        }
      }

      return { error: null }
    } catch (error) {
      console.error("サインアップエラー:", error)
      return { error }
    }
  }

  const signOut = async () => {
    if (!isAuthEnabled) {
      console.log("認証機能が無効化されているため、ログアウトをスキップします")
      if (typeof window !== 'undefined') {
        window.location.href = "/login"
      }
      return
    }

    console.log("AuthContext - ログアウト開始")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("ログアウトエラー:", error)
      } else {
        console.log("AuthContext - ログアウト成功")
        // ログアウト成功後、ログインページにリダイレクト
        if (typeof window !== 'undefined') {
          window.location.href = "/login"
        }
      }
    } catch (error) {
      console.error("ログアウトエラー:", error)
    }
  }

  const refreshUser = async () => {
    if (!isAuthEnabled) {
      console.log("認証機能が無効化されているため、リフレッシュをスキップします")
      return
    }

    console.log("AuthContext - ユーザー情報リフレッシュ開始")
    try {
      const {
        data: { user: refreshedUser },
        error
      } = await supabase.auth.getUser()
      
      if (error) {
        console.error("ユーザー情報取得エラー:", error)
        return
      }
      
      console.log("AuthContext - リフレッシュされたユーザー:", refreshedUser)
      console.log("AuthContext - リフレッシュされたuser_metadata:", refreshedUser?.user_metadata)
      
      setUser(refreshedUser)
      setRole(refreshedUser?.user_metadata?.role ?? null)
    } catch (error) {
      console.error("ユーザー情報リフレッシュエラー:", error)
    }
  }

  const value = {
    user,
    loading,
    role,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

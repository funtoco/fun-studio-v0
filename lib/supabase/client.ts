import { createBrowserClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase環境変数が設定されていません。")
      console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "設定済み" : "未設定")
      
      // フォールバック用のダミークライアントを作成
      supabaseClient = createBrowserClient(
        "https://dummy.supabase.co",
        "dummy-key"
      )
    } else {
      supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return supabaseClient
}

// Create Supabase client with service role key for admin operations
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('createAdminClient - supabaseUrl:', supabaseUrl)
  console.log('createAdminClient - serviceRoleKey exists:', !!serviceRoleKey)
  console.log('createAdminClient - serviceRoleKey length:', serviceRoleKey?.length)
  console.log('createAdminClient - serviceRoleKey preview:', serviceRoleKey?.substring(0, 20) + '...')

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables:')
    console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    console.error('- SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'exists' : 'missing')
    console.error('Please check your .env.local file and ensure SUPABASE_SERVICE_ROLE_KEY is complete')
    throw new Error("Admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey)
}

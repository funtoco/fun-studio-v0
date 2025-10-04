import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { app: string } }
) {
  try {
    const table = params.app
    const allow = new Set(['people', 'visas', 'meetings'])
    if (!allow.has(table)) {
      return NextResponse.json({ error: 'Table not allowed' }, { status: 400 })
    }

    const supabase = getAdminClient()
    
    // 動的取得: 新しいRPC関数を使用
    const { data, error } = await supabase.rpc('get_table_columns_raw', { p_table: table })

    if (error || !data) {
      console.error('[SCHEMA] RPC failed', { table, error })
      return NextResponse.json({ error: 'Schema RPC failed', code: 'SCHEMA_RPC_FAILED', detail: error?.message }, { status: 500 })
    }

    const system = new Set(['created_at', 'updated_at'])
    const columns = (data as any[])
      .map((c) => ({
        key: c.column_name,
        label: c.column_name,
        type: c.data_type,
        nullable: !!c.is_nullable,
        position: c.ordinal_position,
      }))
      .filter((c) => !system.has(c.key))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    console.log(`[SCHEMA] fetched ${table} columns: ${columns.length}`)
    return NextResponse.json({ columns })
  } catch (e) {
    console.error('[SCHEMA] unexpected error', e)
    return NextResponse.json({ error: 'Failed to fetch schema' }, { status: 500 })
  }
}



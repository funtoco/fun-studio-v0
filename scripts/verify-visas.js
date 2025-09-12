const { createClient } = require('@supabase/supabase-js')

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません。')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyVisasData() {
  try {
    console.log('Supabaseのvisasデータを確認しています...')
    
    // 全件数を取得
    const { count, error: countError } = await supabase
      .from('visas')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('件数取得でエラーが発生しました:', countError)
      return
    }
    
    console.log(`総件数: ${count}件`)
    
    // タイプ別の件数を取得
    const { data: typeData, error: typeError } = await supabase
      .from('visas')
      .select('type')
    
    if (typeError) {
      console.error('タイプデータ取得でエラーが発生しました:', typeError)
      return
    }
    
    const typeCount = typeData.reduce((acc, visa) => {
      const type = visa.type || '不明'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
    
    console.log('タイプ別件数:')
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}件`)
    })
    
    // ステータス別の件数を取得
    const { data: statusData, error: statusError } = await supabase
      .from('visas')
      .select('status')
    
    if (statusError) {
      console.error('ステータスデータ取得でエラーが発生しました:', statusError)
      return
    }
    
    const statusCount = statusData.reduce((acc, visa) => {
      const status = visa.status || '不明'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
    
    console.log('\nステータス別件数:')
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}件`)
    })
    
    // 最新の5件を取得
    const { data: recentData, error: recentError } = await supabase
      .from('visas')
      .select('id, person_id, status, type, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)
    
    if (recentError) {
      console.error('最新データ取得でエラーが発生しました:', recentError)
      return
    }
    
    console.log('\n最新の5件:')
    recentData.forEach(visa => {
      console.log(`  ${visa.id}: ${visa.person_id} - ${visa.status} (${visa.type}) - ${visa.updated_at}`)
    })
    
    // 特定の条件で検索テスト
    const { data: searchData, error: searchError } = await supabase
      .from('visas')
      .select('id, person_id, status, type')
      .eq('type', '新規')
    
    if (searchError) {
      console.error('検索テストでエラーが発生しました:', searchError)
      return
    }
    
    console.log(`\n新規タイプの件数: ${searchData.length}件`)
    
    // ビザ取得済みの件数
    const { data: completedData, error: completedError } = await supabase
      .from('visas')
      .select('id, person_id, type')
      .eq('status', 'ビザ取得済み')
    
    if (completedError) {
      console.error('ビザ取得済みデータ取得でエラーが発生しました:', completedError)
      return
    }
    
    console.log(`ビザ取得済みの件数: ${completedData.length}件`)
    
    console.log('\n✅ Visasデータ確認が完了しました！')
    
  } catch (error) {
    console.error('確認中にエラーが発生しました:', error)
  }
}

verifyVisasData()

const { createClient } = require('@supabase/supabase-js')

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません。')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySupportActionsData() {
  try {
    console.log('Supabaseのsupport_actionsデータを確認しています...')
    
    // 全件数を取得
    const { count, error: countError } = await supabase
      .from('support_actions')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('件数取得でエラーが発生しました:', countError)
      return
    }
    
    console.log(`総件数: ${count}件`)
    
    // カテゴリ別の件数を取得
    const { data: categoryData, error: categoryError } = await supabase
      .from('support_actions')
      .select('category')
    
    if (categoryError) {
      console.error('カテゴリデータ取得でエラーが発生しました:', categoryError)
      return
    }
    
    const categoryCount = categoryData.reduce((acc, action) => {
      const category = action.category || '不明'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
    
    console.log('\nカテゴリ別件数:')
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}件`)
      })
    
    // ステータス別の件数を取得
    const { data: statusData, error: statusError } = await supabase
      .from('support_actions')
      .select('status')
    
    if (statusError) {
      console.error('ステータスデータ取得でエラーが発生しました:', statusError)
      return
    }
    
    const statusCount = statusData.reduce((acc, action) => {
      const status = action.status || '不明'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
    
    console.log('\nステータス別件数:')
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}件`)
    })
    
    // 担当者別の件数を取得
    const { data: assigneeData, error: assigneeError } = await supabase
      .from('support_actions')
      .select('assignee')
    
    if (assigneeError) {
      console.error('担当者データ取得でエラーが発生しました:', assigneeError)
      return
    }
    
    const assigneeCount = assigneeData.reduce((acc, action) => {
      const assignee = action.assignee || '未設定'
      acc[assignee] = (acc[assignee] || 0) + 1
      return acc
    }, {})
    
    console.log('\n担当者別件数:')
    Object.entries(assigneeCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([assignee, count]) => {
        console.log(`  ${assignee}: ${count}件`)
      })
    
    // 最新の5件を取得
    const { data: recentData, error: recentError } = await supabase
      .from('support_actions')
      .select('id, person_id, category, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (recentError) {
      console.error('最新データ取得でエラーが発生しました:', recentError)
      return
    }
    
    console.log('\n最新の5件:')
    recentData.forEach(action => {
      console.log(`  ${action.id}: ${action.person_id} - ${action.category} - ${action.title} (${action.status})`)
    })
    
    // 特定のカテゴリの詳細を確認
    const { data: specificData, error: specificError } = await supabase
      .from('support_actions')
      .select('id, title, status')
      .eq('category', '郵便対応')
      .limit(3)
    
    if (specificError) {
      console.error('特定カテゴリデータ取得でエラーが発生しました:', specificError)
      return
    }
    
    console.log(`\n郵便対応カテゴリのサンプル (${specificData.length}件):`)
    specificData.forEach(action => {
      console.log(`  - ${action.title} (${action.status})`)
    })
    
    console.log('\n✅ Support Actionsデータ確認が完了しました！')
    
  } catch (error) {
    console.error('確認中にエラーが発生しました:', error)
  }
}

verifySupportActionsData()



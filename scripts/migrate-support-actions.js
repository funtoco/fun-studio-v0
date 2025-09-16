const { createClient } = require('@supabase/supabase-js')
const supportActions = require('./support-actions-data.json')

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません。')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '設定済み' : '未設定')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateSupportActionsData() {
  try {
    console.log('Support Actionsデータの移行を開始します...')
    
    // 既存のデータをクリア（オプション）
    console.log('既存のsupport_actionsデータをクリアしています...')
    const { error: deleteError } = await supabase
      .from('support_actions')
      .delete()
      .neq('id', '')
    
    if (deleteError) {
      console.warn('既存データのクリアでエラーが発生しました:', deleteError.message)
    }
    
    // データを挿入
    console.log('Support Actionsデータを挿入しています...')
    const { data, error } = await supabase
      .from('support_actions')
      .insert(supportActions.map(action => ({
        id: action.id,
        person_id: action.personId,
        category: action.category,
        title: action.title,
        detail: action.detail,
        status: action.status,
        assignee: action.assignee,
        due_date: action.due,
        created_at: action.createdAt,
        updated_at: action.updatedAt
      })))
    
    if (error) {
      console.error('データ挿入でエラーが発生しました:', error)
      return
    }
    
    console.log(`成功: ${supportActions.length}件のsupport_actionsデータを挿入しました`)
    
    // 挿入されたデータを確認
    const { data: insertedData, error: selectError } = await supabase
      .from('support_actions')
      .select('id, person_id, category, title, status')
      .limit(5)
    
    if (selectError) {
      console.error('データ確認でエラーが発生しました:', selectError)
      return
    }
    
    console.log('挿入されたデータのサンプル:')
    console.log(insertedData)
    
  } catch (error) {
    console.error('移行中にエラーが発生しました:', error)
  }
}

migrateSupportActionsData()



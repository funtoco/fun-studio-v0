const { createClient } = require('@supabase/supabase-js')
const visas = require('./visa-data.json')

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

async function migrateVisasData() {
  try {
    console.log('Visasデータの移行を開始します...')
    
    // 既存のデータをクリア（オプション）
    console.log('既存のvisasデータをクリアしています...')
    const { error: deleteError } = await supabase
      .from('visas')
      .delete()
      .neq('id', '')
    
    if (deleteError) {
      console.warn('既存データのクリアでエラーが発生しました:', deleteError.message)
    }
    
    // データを挿入
    console.log('Visasデータを挿入しています...')
    const { data, error } = await supabase
      .from('visas')
      .insert(visas.map(visa => ({
        id: visa.id,
        person_id: visa.personId,
        status: visa.status,
        type: visa.type,
        expiry_date: visa.expiryDate,
        submitted_at: visa.submittedAt,
        result_at: visa.resultAt,
        manager: visa.manager,
        updated_at: visa.updatedAt
      })))
    
    if (error) {
      console.error('データ挿入でエラーが発生しました:', error)
      return
    }
    
    console.log(`成功: ${visas.length}件のvisasデータを挿入しました`)
    
    // 挿入されたデータを確認
    const { data: insertedData, error: selectError } = await supabase
      .from('visas')
      .select('id, person_id, status, type')
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

migrateVisasData()

const { createClient } = require('@supabase/supabase-js')
const people = require('./people-data.json')

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

async function migratePeopleData() {
  try {
    console.log('Peopleデータの移行を開始します...')
    
    // 既存のデータをクリア（オプション）
    console.log('既存のpeopleデータをクリアしています...')
    const { error: deleteError } = await supabase
      .from('people')
      .delete()
      .neq('id', '')
    
    if (deleteError) {
      console.warn('既存データのクリアでエラーが発生しました:', deleteError.message)
    }
    
    // データを挿入
    console.log('Peopleデータを挿入しています...')
    const { data, error } = await supabase
      .from('people')
      .insert(people.map(person => ({
        id: person.id,
        name: person.name,
        kana: person.kana,
        nationality: person.nationality,
        dob: person.dob,
        phone: person.phone,
        email: person.email,
        address: person.address,
        // company: person.company, // 削除: tenantNameに変更
        note: person.note,
        visa_id: person.visaId,
        created_at: person.createdAt,
        updated_at: person.updatedAt
      })))
    
    if (error) {
      console.error('データ挿入でエラーが発生しました:', error)
      return
    }
    
    console.log(`成功: ${people.length}件のpeopleデータを挿入しました`)
    
    // 挿入されたデータを確認
    const { data: insertedData, error: selectError } = await supabase
      .from('people')
      .select('id, name, nationality')
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

migratePeopleData()
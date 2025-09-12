const { createClient } = require('@supabase/supabase-js')

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません。')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyData() {
  try {
    console.log('Supabaseのpeopleデータを確認しています...')
    
    // 全件数を取得
    const { count, error: countError } = await supabase
      .from('people')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('件数取得でエラーが発生しました:', countError)
      return
    }
    
    console.log(`総件数: ${count}件`)
    
    // 国籍別の件数を取得
    const { data: nationalityData, error: nationalityError } = await supabase
      .from('people')
      .select('nationality')
    
    if (nationalityError) {
      console.error('国籍データ取得でエラーが発生しました:', nationalityError)
      return
    }
    
    const nationalityCount = nationalityData.reduce((acc, person) => {
      const nationality = person.nationality || '不明'
      acc[nationality] = (acc[nationality] || 0) + 1
      return acc
    }, {})
    
    console.log('国籍別件数:')
    Object.entries(nationalityCount).forEach(([nationality, count]) => {
      console.log(`  ${nationality}: ${count}件`)
    })
    
    // 最新の5件を取得
    const { data: recentData, error: recentError } = await supabase
      .from('people')
      .select('id, name, nationality, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (recentError) {
      console.error('最新データ取得でエラーが発生しました:', recentError)
      return
    }
    
    console.log('\n最新の5件:')
    recentData.forEach(person => {
      console.log(`  ${person.id}: ${person.name} (${person.nationality}) - ${person.created_at}`)
    })
    
    // 特定の条件で検索テスト
    const { data: searchData, error: searchError } = await supabase
      .from('people')
      .select('id, name, nationality')
      .eq('nationality', 'インドネシア')
    
    if (searchError) {
      console.error('検索テストでエラーが発生しました:', searchError)
      return
    }
    
    console.log(`\nインドネシア国籍の人数: ${searchData.length}人`)
    searchData.forEach(person => {
      console.log(`  ${person.id}: ${person.name}`)
    })
    
    console.log('\n✅ データ確認が完了しました！')
    
  } catch (error) {
    console.error('確認中にエラーが発生しました:', error)
  }
}

verifyData()

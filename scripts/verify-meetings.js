const { createClient } = require('@supabase/supabase-js')

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase環境変数が設定されていません。')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMeetingsData() {
  try {
    console.log('Supabaseのmeetingsデータを確認しています...')
    
    // meetingsの件数を取得
    const { count: meetingsCount, error: meetingsCountError } = await supabase
      .from('meetings')
      .select('*', { count: 'exact', head: true })
    
    if (meetingsCountError) {
      console.error('meetings件数取得でエラーが発生しました:', meetingsCountError)
      return
    }
    
    console.log(`meetings総件数: ${meetingsCount}件`)
    
    // meeting_notesの件数を取得
    const { count: notesCount, error: notesCountError } = await supabase
      .from('meeting_notes')
      .select('*', { count: 'exact', head: true })
    
    if (notesCountError) {
      console.error('meeting_notes件数取得でエラーが発生しました:', notesCountError)
      return
    }
    
    console.log(`meeting_notes総件数: ${notesCount}件`)
    
    // 種類別の件数を取得
    const { data: kindData, error: kindError } = await supabase
      .from('meetings')
      .select('kind')
    
    if (kindError) {
      console.error('種類データ取得でエラーが発生しました:', kindError)
      return
    }
    
    const kindCount = kindData.reduce((acc, meeting) => {
      const kind = meeting.kind || '不明'
      acc[kind] = (acc[kind] || 0) + 1
      return acc
    }, {})
    
    console.log('種類別件数:')
    Object.entries(kindCount).forEach(([kind, count]) => {
      console.log(`  ${kind}: ${count}件`)
    })
    
    // 最新の5件を取得
    const { data: recentData, error: recentError } = await supabase
      .from('meetings')
      .select('id, person_id, title, kind, datetime')
      .order('datetime', { ascending: false })
      .limit(5)
    
    if (recentError) {
      console.error('最新データ取得でエラーが発生しました:', recentError)
      return
    }
    
    console.log('\n最新の5件:')
    recentData.forEach(meeting => {
      console.log(`  ${meeting.id}: ${meeting.person_id} - ${meeting.title} (${meeting.kind}) - ${meeting.datetime}`)
    })
    
    // 特定のmeetingのnotesを確認
    const { data: notesData, error: notesError } = await supabase
      .from('meeting_notes')
      .select('meeting_id, section, item, level')
      .eq('meeting_id', 'm001')
    
    if (notesError) {
      console.error('notesデータ取得でエラーが発生しました:', notesError)
      return
    }
    
    console.log(`\nmeeting m001のnotes (${notesData.length}件):`)
    notesData.forEach(note => {
      console.log(`  - ${note.section}: ${note.item} (${note.level || 'レベル未設定'})`)
    })
    
    // 参加者数の統計
    const { data: attendeesData, error: attendeesError } = await supabase
      .from('meetings')
      .select('attendees')
    
    if (attendeesError) {
      console.error('参加者データ取得でエラーが発生しました:', attendeesError)
      return
    }
    
    const totalAttendees = attendeesData.reduce((sum, meeting) => {
      return sum + (meeting.attendees ? meeting.attendees.length : 0)
    }, 0)
    
    console.log(`\n総参加者数: ${totalAttendees}人`)
    console.log(`平均参加者数: ${(totalAttendees / meetingsCount).toFixed(1)}人/会議`)
    
    console.log('\n✅ Meetingsデータ確認が完了しました！')
    
  } catch (error) {
    console.error('確認中にエラーが発生しました:', error)
  }
}

verifyMeetingsData()

const { createClient } = require('@supabase/supabase-js')
const meetings = require('./meeting-data.json')

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

async function migrateMeetingsData() {
  try {
    console.log('Meetingsデータの移行を開始します...')
    
    // 既存のデータをクリア（オプション）
    console.log('既存のmeetingsデータをクリアしています...')
    const { error: deleteMeetingsError } = await supabase
      .from('meetings')
      .delete()
      .neq('id', '')
    
    if (deleteMeetingsError) {
      console.warn('既存meetingsデータのクリアでエラーが発生しました:', deleteMeetingsError.message)
    }
    
    const { error: deleteNotesError } = await supabase
      .from('meeting_notes')
      .delete()
      .neq('id', 0)
    
    if (deleteNotesError) {
      console.warn('既存meeting_notesデータのクリアでエラーが発生しました:', deleteNotesError.message)
    }
    
    // データを挿入
    console.log('Meetingsデータを挿入しています...')
    
    for (const meeting of meetings) {
      // まずmeetingを挿入
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          id: meeting.id,
          person_id: meeting.personId,
          kind: meeting.kind,
          title: meeting.title,
          datetime: meeting.datetime,
          duration_min: meeting.durationMin,
          attendees: meeting.attendees,
          created_by: meeting.createdBy,
          created_at: meeting.createdAt,
          updated_at: meeting.updatedAt
        })
        .select()
        .single()
      
      if (meetingError) {
        console.error(`Meeting ${meeting.id} の挿入でエラーが発生しました:`, meetingError)
        continue
      }
      
      // 次にmeeting_notesを挿入
      if (meeting.notes && meeting.notes.length > 0) {
        const notesData = meeting.notes.map(note => ({
          meeting_id: meeting.id,
          section: note.section,
          item: note.item,
          level: note.level,
          detail: note.detail
        }))
        
        const { error: notesError } = await supabase
          .from('meeting_notes')
          .insert(notesData)
        
        if (notesError) {
          console.error(`Meeting ${meeting.id} のnotes挿入でエラーが発生しました:`, notesError)
        }
      }
    }
    
    console.log(`成功: ${meetings.length}件のmeetingsデータを挿入しました`)
    
    // 挿入されたデータを確認
    const { data: insertedMeetings, error: selectError } = await supabase
      .from('meetings')
      .select('id, person_id, title, kind')
      .limit(5)
    
    if (selectError) {
      console.error('データ確認でエラーが発生しました:', selectError)
      return
    }
    
    console.log('挿入されたmeetingsデータのサンプル:')
    console.log(insertedMeetings)
    
    // notesの件数も確認
    const { count: notesCount, error: notesCountError } = await supabase
      .from('meeting_notes')
      .select('*', { count: 'exact', head: true })
    
    if (notesCountError) {
      console.error('notes件数取得でエラーが発生しました:', notesCountError)
    } else {
      console.log(`挿入されたmeeting_notesの件数: ${notesCount}件`)
    }
    
  } catch (error) {
    console.error('移行中にエラーが発生しました:', error)
  }
}

migrateMeetingsData()

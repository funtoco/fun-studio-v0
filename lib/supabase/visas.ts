import { createClient } from './client'
import type { Visa, VisaStatus } from '@/lib/models'

export interface VisaListResponse {
  visas: Visa[]
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface VisaStatusCounts {
  [key: string]: number
}

export async function getVisas(): Promise<Visa[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .select()
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching visas:', error)
    throw error
  }
  
  // SupabaseのデータをVisa型に変換
  return data.map(visa => ({
    id: visa.id,
    personId: visa.person_id,
    status: visa.status,
    type: visa.type,
    expiryDate: visa.expiry_date,
    submittedAt: visa.submitted_at,
    resultAt: visa.result_at,
    manager: visa.manager,
    updatedAt: visa.updated_at
  }))
}

export async function getVisaById(id: string): Promise<Visa | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .select()
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching visa:', error)
    return null
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    status: data.status,
    type: data.type,
    expiryDate: data.expiry_date,
    submittedAt: data.submitted_at,
    resultAt: data.result_at,
    manager: data.manager,
    updatedAt: data.updated_at
  }
}

export async function getVisasByPersonId(personId: string): Promise<Visa[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .select()
    .eq('person_id', personId)
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching visas by person ID:', error)
    throw error
  }
  
  return data.map(visa => ({
    id: visa.id,
    personId: visa.person_id,
    status: visa.status,
    type: visa.type,
    expiryDate: visa.expiry_date,
    submittedAt: visa.submitted_at,
    resultAt: visa.result_at,
    manager: visa.manager,
    updatedAt: visa.updated_at
  }))
}

export async function createVisa(visa: Omit<Visa, 'updatedAt'>): Promise<Visa> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .insert({
      id: visa.id,
      person_id: visa.personId,
      status: visa.status,
      type: visa.type,
      expiry_date: visa.expiryDate,
      submitted_at: visa.submittedAt,
      result_at: visa.resultAt,
      manager: visa.manager
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating visa:', error)
    throw error
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    status: data.status,
    type: data.type,
    expiryDate: data.expiry_date,
    submittedAt: data.submitted_at,
    resultAt: data.result_at,
    manager: data.manager,
    updatedAt: data.updated_at
  }
}

export async function updateVisa(id: string, updates: Partial<Omit<Visa, 'id' | 'updatedAt'>>): Promise<Visa> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .update({
      person_id: updates.personId,
      status: updates.status,
      type: updates.type,
      expiry_date: updates.expiryDate,
      submitted_at: updates.submittedAt,
      result_at: updates.resultAt,
      manager: updates.manager
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating visa:', error)
    throw error
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    status: data.status,
    type: data.type,
    expiryDate: data.expiry_date,
    submittedAt: data.submitted_at,
    resultAt: data.result_at,
    manager: data.manager,
    updatedAt: data.updated_at
  }
}

export async function deleteVisa(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('visas')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting visa:', error)
    throw error
  }
}

export async function getVisaStatusCounts(): Promise<VisaStatusCounts> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .select('status')
  
  if (error) {
    console.error('Error fetching visa status counts:', error)
    throw error
  }
  
  // Count occurrences of each status
  const counts: VisaStatusCounts = {}
  data.forEach(visa => {
    counts[visa.status] = (counts[visa.status] || 0) + 1
  })
  
  return counts
}

export async function getVisasPaginated(
  status?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<VisaListResponse> {
  const supabase = createClient()
  
  const offset = (page - 1) * pageSize
  
  let query = supabase
    .from('visas')
    .select(`
      *,
      people!inner(
        id,
        name,
        kana,
        nationality,
        company
      )
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + pageSize - 1)
  
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('Error fetching paginated visas:', error)
    throw error
  }
  
  const visas: (Visa & { person: any })[] = data.map(item => ({
    id: item.id,
    personId: item.person_id,
    status: item.status,
    type: item.type,
    expiryDate: item.expiry_date,
    submittedAt: item.submitted_at,
    resultAt: item.result_at,
    manager: item.manager,
    updatedAt: item.updated_at,
    // Add person data for display
    person: {
      id: item.people.id,
      name: item.people.name,
      kana: item.people.kana,
      nationality: item.people.nationality,
      company: item.people.company
    }
  }))
  
  const totalCount = count || 0
  const hasNextPage = offset + pageSize < totalCount
  const hasPrevPage = page > 1
  
  return {
    visas: visas as Visa[],
    totalCount,
    hasNextPage,
    hasPrevPage
  }
}

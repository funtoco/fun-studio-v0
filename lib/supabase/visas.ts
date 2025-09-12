import { createClient } from './client'
import type { Visa } from '@/lib/models'

export async function getVisas(): Promise<Visa[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('visas')
    .select('*')
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
    .select('*')
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
    .select('*')
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

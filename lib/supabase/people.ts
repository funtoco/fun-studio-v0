import { createClient } from './client'
import type { Person } from '@/lib/models'

export async function getPeople(): Promise<Person[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching people:', error)
    throw error
  }
  
  // SupabaseのデータをPerson型に変換
  return data.map(person => ({
    id: person.id,
    name: person.name,
    kana: person.kana,
    nationality: person.nationality,
    dob: person.dob,
    phone: person.phone,
    email: person.email,
    address: person.address,
    company: person.company,
    note: person.note,
    visaId: person.visa_id,
    createdAt: person.created_at,
    updatedAt: person.updated_at
  }))
}

export async function getPersonById(id: string): Promise<Person | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching person:', error)
    return null
  }
  
  return {
    id: data.id,
    name: data.name,
    kana: data.kana,
    nationality: data.nationality,
    dob: data.dob,
    phone: data.phone,
    email: data.email,
    address: data.address,
    company: data.company,
    note: data.note,
    visaId: data.visa_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function createPerson(person: Omit<Person, 'createdAt' | 'updatedAt'>): Promise<Person> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('people')
    .insert({
      id: person.id,
      name: person.name,
      kana: person.kana,
      nationality: person.nationality,
      dob: person.dob,
      phone: person.phone,
      email: person.email,
      address: person.address,
      company: person.company,
      note: person.note,
      visa_id: person.visaId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating person:', error)
    throw error
  }
  
  return {
    id: data.id,
    name: data.name,
    kana: data.kana,
    nationality: data.nationality,
    dob: data.dob,
    phone: data.phone,
    email: data.email,
    address: data.address,
    company: data.company,
    note: data.note,
    visaId: data.visa_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updatePerson(id: string, updates: Partial<Omit<Person, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Person> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('people')
    .update({
      name: updates.name,
      kana: updates.kana,
      nationality: updates.nationality,
      dob: updates.dob,
      phone: updates.phone,
      email: updates.email,
      address: updates.address,
      company: updates.company,
      note: updates.note,
      visa_id: updates.visaId
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating person:', error)
    throw error
  }
  
  return {
    id: data.id,
    name: data.name,
    kana: data.kana,
    nationality: data.nationality,
    dob: data.dob,
    phone: data.phone,
    email: data.email,
    address: data.address,
    company: data.company,
    note: data.note,
    visaId: data.visa_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function deletePerson(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting person:', error)
    throw error
  }
}

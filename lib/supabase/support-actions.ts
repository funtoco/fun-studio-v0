import { createClient } from './client'
import type { SupportAction } from '@/lib/models'

export async function getSupportActions(): Promise<SupportAction[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .select()
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching support actions:', error)
    throw error
  }
  
  // SupabaseのデータをSupportAction型に変換
  return data.map(action => ({
    id: action.id,
    personId: action.person_id,
    category: action.category,
    title: action.title,
    detail: action.detail,
    status: action.status,
    assignee: action.assignee,
    due: action.due_date,
    createdAt: action.created_at,
    updatedAt: action.updated_at
  }))
}

export async function getSupportActionById(id: string): Promise<SupportAction | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .select()
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching support action:', error)
    return null
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    category: data.category,
    title: data.title,
    detail: data.detail,
    status: data.status,
    assignee: data.assignee,
    due: data.due_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getSupportActionsByPersonId(personId: string): Promise<SupportAction[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .select()
    .eq('person_id', personId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching support actions by person ID:', error)
    throw error
  }
  
  return data.map(action => ({
    id: action.id,
    personId: action.person_id,
    category: action.category,
    title: action.title,
    detail: action.detail,
    status: action.status,
    assignee: action.assignee,
    due: action.due_date,
    createdAt: action.created_at,
    updatedAt: action.updated_at
  }))
}

export async function getSupportActionsByCategory(category: string): Promise<SupportAction[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .select()
    .eq('category', category)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching support actions by category:', error)
    throw error
  }
  
  return data.map(action => ({
    id: action.id,
    personId: action.person_id,
    category: action.category,
    title: action.title,
    detail: action.detail,
    status: action.status,
    assignee: action.assignee,
    due: action.due_date,
    createdAt: action.created_at,
    updatedAt: action.updated_at
  }))
}

export async function getSupportActionsByStatus(status: 'open' | 'in_progress' | 'done'): Promise<SupportAction[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .select()
    .eq('status', status)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching support actions by status:', error)
    throw error
  }
  
  return data.map(action => ({
    id: action.id,
    personId: action.person_id,
    category: action.category,
    title: action.title,
    detail: action.detail,
    status: action.status,
    assignee: action.assignee,
    due: action.due_date,
    createdAt: action.created_at,
    updatedAt: action.updated_at
  }))
}

export async function createSupportAction(action: Omit<SupportAction, 'createdAt' | 'updatedAt'>): Promise<SupportAction> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .insert({
      id: action.id,
      person_id: action.personId,
      category: action.category,
      title: action.title,
      detail: action.detail,
      status: action.status,
      assignee: action.assignee,
      due_date: action.due
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating support action:', error)
    throw error
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    category: data.category,
    title: data.title,
    detail: data.detail,
    status: data.status,
    assignee: data.assignee,
    due: data.due_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updateSupportAction(id: string, updates: Partial<Omit<SupportAction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SupportAction> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('support_actions')
    .update({
      person_id: updates.personId,
      category: updates.category,
      title: updates.title,
      detail: updates.detail,
      status: updates.status,
      assignee: updates.assignee,
      due_date: updates.due
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating support action:', error)
    throw error
  }
  
  return {
    id: data.id,
    personId: data.person_id,
    category: data.category,
    title: data.title,
    detail: data.detail,
    status: data.status,
    assignee: data.assignee,
    due: data.due_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function deleteSupportAction(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('support_actions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting support action:', error)
    throw error
  }
}



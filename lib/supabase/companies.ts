import { createClient } from './client'
import type { Company } from '@/lib/models'

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('companies')
    .select()
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching companies:', error)
    throw error
  }
  
  // SupabaseのデータをCompany型に変換
  return data.map(company => ({
    id: company.id,
    name: company.name,
    nameKana: company.name_kana,
    industry: company.industry,
    address: company.address,
    phone: company.phone,
    email: company.email,
    website: company.website,
    representative: company.representative,
    establishedDate: company.established_date,
    capital: company.capital,
    employeeCount: company.employee_count,
    description: company.description,
    createdAt: company.created_at,
    updatedAt: company.updated_at
  }))
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('companies')
    .select()
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching company:', error)
    return null
  }
  
  if (!data) return null
  
  return {
    id: data.id,
    name: data.name,
    nameKana: data.name_kana,
    industry: data.industry,
    address: data.address,
    phone: data.phone,
    email: data.email,
    website: data.website,
    representative: data.representative,
    establishedDate: data.established_date,
    capital: data.capital,
    employeeCount: data.employee_count,
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getPeopleByCompanyId(companyId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('people')
    .select()
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching people by company:', error)
    throw error
  }
  
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

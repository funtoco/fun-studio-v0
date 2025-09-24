import { createClient, createAdminClient } from './client'

export interface Tenant {
  id: string
  name: string
  slug: string
  description?: string
  settings: Record<string, any>
  max_members: number
  created_at: string
  updated_at: string
}

export interface UserTenant {
  id: string
  user_id: string
  tenant_id: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  status: 'active' | 'pending' | 'suspended'
  invited_by?: string
  invited_at?: string
  joined_at?: string
  created_at: string
  updated_at: string
  tenant?: Tenant
}

export interface TenantInvitation {
  id: string
  tenant_id: string
  email: string
  role: 'admin' | 'member' | 'guest'
  token: string
  invited_by: string
  expires_at: string
  accepted_at?: string
  created_at: string
  invited_by_user?: {
    id: string
    email: string
    user_metadata?: {
      name?: string
    }
  }
}

export async function getTenants(): Promise<Tenant[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }
  
  return data || []
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching tenant:', error)
    return null
  }
  
  return data
}

export async function getCurrentUserTenants(): Promise<UserTenant[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Get user_tenants records for the current user
  const { data: userTenants, error: userTenantsError } = await supabase
    .from('user_tenants')
    .select(`
      *,
      tenant:tenant_id (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
  
  if (userTenantsError) {
    console.error('Error fetching user tenants:', userTenantsError)
    return []
  }
  
  if (!userTenants || userTenants.length === 0) {
    return []
  }
  
  return userTenants.map((ut: UserTenant) => ({
    id: ut.id,
    user_id: ut.user_id,
    tenant_id: ut.tenant_id,
    email: ut.email,
    role: ut.role,
    status: ut.status,
    created_at: ut.created_at,
    updated_at: ut.updated_at,
    tenant: ut.tenant
  }))
}

export async function getTenantMembers(tenantId: string): Promise<UserTenant[]> {
  const supabase = createClient()
  
  // Get members from user_tenants table
  const { data: members, error } = await supabase
    .from('user_tenants')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tenant members:', error)
    throw error
  }

  if (!members || members.length === 0) {
    return []
  }

  return members
}

export async function getTenantInvitations(tenantId: string): Promise<TenantInvitation[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tenant_invitations')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tenant invitations:', error)
    throw error
  }
  
  return data || []
}

export async function createTenantInvitation(
  tenantId: string,
  email: string,
  role: 'admin' | 'member' | 'guest'
): Promise<TenantInvitation> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Generate a secure token
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  const { data, error } = await supabase
    .from('tenant_invitations')
    .insert({
      tenant_id: tenantId,
      email,
      role,
      token,
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    })
    .select(`
      *,
      invited_by_user:invited_by (
        id,
        email,
        user_metadata
      )
    `)
    .single()
  
  if (error) {
    console.error('Error creating tenant invitation:', error)
    throw error
  }
  
  return data
}

export async function acceptTenantInvitation(token: string): Promise<{ success: boolean; tenant_id?: string; error?: string }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('accept_tenant_invitation', {
    invitation_token: token
  })
  
  if (error) {
    console.error('Error accepting invitation:', error)
    return { success: false, error: error.message }
  }
  
  return data
}

export async function updateUserTenantRole(
  userTenantId: string,
  role: 'owner' | 'admin' | 'member' | 'guest'
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_tenants')
    .update({ role })
    .eq('id', userTenantId)
  
  if (error) {
    console.error('Error updating user tenant role:', error)
    throw error
  }
}

export async function removeUserFromTenant(userTenantId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_tenants')
    .delete()
    .eq('id', userTenantId)
  
  if (error) {
    console.error('Error removing user from tenant:', error)
    throw error
  }
}

export async function cancelTenantInvitation(invitationId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('tenant_invitations')
    .delete()
    .eq('id', invitationId)
  
  if (error) {
    console.error('Error canceling invitation:', error)
    throw error
  }
}

export async function createTenant(tenantData: {
  name: string
  slug: string
  description?: string
}): Promise<Tenant> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      name: tenantData.name,
      slug: tenantData.slug,
      description: tenantData.description,
      max_members: 50
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating tenant:', error)
    throw error
  }
  
  // Add the creator as owner
  const { error: userTenantError } = await supabase
    .from('user_tenants')
    .insert({
      user_id: user.id,
      tenant_id: data.id,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString()
    })
  
  if (userTenantError) {
    console.error('Error adding user to tenant:', userTenantError)
    throw userTenantError
  }
  
  return data
}

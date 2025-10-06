/**
 * Supabase Storage file uploader utility
 * Handles file uploads to Supabase Storage buckets
 */

import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for file operations
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

export interface FileUploadResult {
  success: boolean
  path?: string
  error?: string
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFileToStorage(
  bucketName: string,
  filePath: string,
  fileData: ArrayBuffer,
  contentType: string,
  options?: {
    upsert?: boolean
    cacheControl?: string
  }
): Promise<FileUploadResult> {
  try {
    const supabase = getServerClient()
    
    // Convert ArrayBuffer to Uint8Array for Supabase
    const uint8Array = new Uint8Array(fileData)
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, uint8Array, {
        contentType,
        upsert: options?.upsert || false,
        cacheControl: options?.cacheControl || '3600'
      })

    if (error) {
      console.error('Storage upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      path: data.path
    }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate unique file path for uploaded files
 */
export function generateFilePath(
  tenantId: string,
  recordId: string,
  fieldCode: string,
  fileName: string
): string {
  // Extract file extension
  const extension = fileName.split('.').pop() || ''
  
  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const uniqueFileName = `${fieldCode}_${recordId}_${timestamp}.${extension}`
  
  // Return path: tenantId/fieldCode/uniqueFileName
  return `${tenantId}/${fieldCode}/${uniqueFileName}`
}

/**
 * Get public URL for uploaded file
 */
export function getFilePublicUrl(bucketName: string, filePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL configuration')
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFileFromStorage(
  bucketName: string,
  filePath: string
): Promise<FileUploadResult> {
  try {
    const supabase = getServerClient()
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      console.error('Storage delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('File delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

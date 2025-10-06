"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface PersonAvatarProps {
  name: string
  imagePath?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
  xl: "h-20 w-20"
}

const textSizeClasses = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm", 
  xl: "text-2xl"
}

/**
 * デコードされたファイル名を取得
 */
function decodeFileName(encodedFileName: string): string {
  try {
    // RFC 2047形式のエンコードをデコード
    if (encodedFileName.includes('=?UTF-8?B?')) {
      const base64Match = encodedFileName.match(/\?B\?([^?]+)\?=/g)
      if (base64Match) {
        let decoded = ''
        for (const match of base64Match) {
          const base64 = match.replace(/\?B\?/, '').replace(/\?=/, '')
          try {
            decoded += Buffer.from(base64, 'base64').toString('utf-8')
          } catch (e) {
            console.warn('Failed to decode base64:', base64)
          }
        }
        return decoded
      }
    }
    return encodedFileName
  } catch (error) {
    console.warn('Failed to decode filename:', encodedFileName, error)
    return encodedFileName
  }
}

/**
 * 署名付きURLを生成
 */
const getSignedUrl = async (filePath: string): Promise<string | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('people-images')
      .createSignedUrl(filePath, 3600) // 1時間有効

    if (error) {
      console.error('Storage API Error:', error)
      console.error('Error details:', { 
        filePath, 
        errorCode: error.statusCode,
        errorMessage: error.message,
        errorDetails: error
      })
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Exception in getSignedUrl:', error)
    return null
  }
}

export function PersonAvatar({ 
  name, 
  imagePath, 
  className,
  size = "md"
}: PersonAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    console.log('PersonAvatar useEffect triggered with imagePath:', imagePath)
    
    if (!imagePath) {
      console.log('No imagePath provided, setting to null')
      setImageUrl(null)
      setError(false)
      setLoading(false)
      return
    }

    // 無効なimagePathの場合はスキップ
    if (imagePath === 'null' || imagePath === 'undefined' || imagePath.trim() === '') {
      console.log('Invalid imagePath detected, skipping:', imagePath)
      setImageUrl(null)
      setError(false)
      setLoading(false)
      return
    }

    const fetchSignedUrl = async () => {
      console.log('Starting fetchSignedUrl for:', imagePath)
      setLoading(true)
      setError(false)
      
      try {
        const signedUrl = await getSignedUrl(imagePath)
        console.log('Signed URL result:', signedUrl)
        if (signedUrl) {
          setImageUrl(signedUrl)
          console.log('Successfully set image URL')
        } else {
          console.log('No signed URL returned, setting error')
          setError(true)
        }
      } catch (err) {
        console.error('Failed to fetch signed URL:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchSignedUrl()
  }, [imagePath])

  const handleImageError = () => {
    console.warn('Failed to load image for person:', name, 'path:', imagePath)
    setError(true)
  }
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && !error && (
        <AvatarImage 
          src={imageUrl} 
          alt={name}
          className="object-cover"
          onError={handleImageError}
        />
      )}
      <AvatarFallback className={textSizeClasses[size]}>
        {loading ? "..." : name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

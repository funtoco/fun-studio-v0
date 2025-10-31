"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, AlertTriangle, CheckCircle } from "lucide-react"
import { getPersonById } from "@/lib/supabase/people"
import type { Person } from "@/lib/models"

export default function EditPersonPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // フォーム状態（従業員番号のみ編集可能）
  const [employeeNumber, setEmployeeNumber] = useState('')

  // 初期データ取得
  useEffect(() => {
    async function fetchPerson() {
      try {
        setLoading(true)
        const data = await getPersonById(id)
        if (!data) {
          setError('人物が見つかりませんでした')
          return
        }
        setPerson(data)
        setEmployeeNumber(data.employeeNumber || '')
      } catch (err) {
        console.error('Error fetching person:', err)
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPerson()
  }, [id])

  // 保存処理
  const handleSave = async () => {
    // 連打防止：既に保存中の場合は何もしない
    if (saving) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const response = await fetch(`/api/people/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeNumber: employeeNumber.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新に失敗しました')
      }

      setSuccess(true)
      // 1秒後に詳細ページにリダイレクト（キャッシュをリフレッシュ）
      setTimeout(() => {
        // 遷移時にタイムスタンプを追加してキャッシュを回避
        const timestamp = Date.now()
        window.location.href = `/people/${id}?_t=${timestamp}`
      }, 1000)
    } catch (err) {
      console.error('Update error:', err)
      setError(err instanceof Error ? err.message : '更新に失敗しました')
      setSaving(false) // エラー時のみ保存状態を解除
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error && !person) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!person) {
    return null
  }

  return (
    <div className="py-6 px-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/people/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">人物情報の編集</h1>
            <p className="text-muted-foreground mt-1">{person.name} さんの情報を編集</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            正常に更新されました
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="name" className="text-right">氏名</Label>
              <Input
                id="name"
                value={person.name || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="kana" className="text-right">フリガナ</Label>
              <Input
                id="kana"
                value={person.kana || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="dob" className="text-right">生年月日</Label>
              <Input
                id="dob"
                type="date"
                value={person.dob || ''}
                disabled
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="employeeNumber" className="text-right">従業員番号</Label>
              <div className="flex-1">
                <Input
                  id="employeeNumber"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  placeholder="従業員番号を入力"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  この項目のみ編集可能です
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="nationality" className="text-right">国籍</Label>
              <Input
                id="nationality"
                value={person.nationality || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="workingStatus" className="text-right">ステータス</Label>
              <Input
                id="workingStatus"
                value={person.workingStatus || ''}
                disabled
              />
            </div>

            {person.specificSkillField && (
              <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                <Label htmlFor="specificSkillField" className="text-right">特定技能分野</Label>
                <Input
                  id="specificSkillField"
                  value={person.specificSkillField || ''}
                  disabled
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 在留カード情報 */}
        <Card>
          <CardHeader>
            <CardTitle>在留カード情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="residenceCardNo" className="text-right">在留カード番号</Label>
              <Input
                id="residenceCardNo"
                value={person.residenceCardNo || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="residenceCardIssuedDate" className="text-right">在留カード発行日</Label>
              <Input
                id="residenceCardIssuedDate"
                type="date"
                value={person.residenceCardIssuedDate || ''}
                disabled
                className="w-full"
              />
            </div>

            {person.residenceCardExpiryDate && (
              <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                <Label htmlFor="residenceCardExpiryDate" className="text-right">在留カード有効期限</Label>
                <Input
                  id="residenceCardExpiryDate"
                  type="date"
                  value={person.residenceCardExpiryDate || ''}
                  disabled
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 連絡先情報 */}
        <Card>
          <CardHeader>
            <CardTitle>連絡先情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {person.email && (
              <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                <Label htmlFor="email" className="text-right">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={person.email || ''}
                  disabled
                />
              </div>
            )}

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label htmlFor="phone" className="text-right">電話番号</Label>
              <Input
                id="phone"
                value={person.phone || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
              <Label htmlFor="address" className="text-right pt-2">住所</Label>
              <Textarea
                id="address"
                value={person.address || ''}
                disabled
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* 所属情報（非表示のフィールドがある場合のみ表示） */}
        {(person.tenantName || person.company || person.note) && (
          <Card>
            <CardHeader>
              <CardTitle>所属情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {person.tenantName && (
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <Label htmlFor="tenantName" className="text-right">会社</Label>
                  <Input
                    id="tenantName"
                    value={person.tenantName || ''}
                    disabled
                  />
                </div>
              )}

              {person.company && (
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <Label htmlFor="company" className="text-right">所属先</Label>
                  <Input
                    id="company"
                    value={person.company || ''}
                    disabled
                  />
                </div>
              )}

              {person.note && (
                <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
                  <Label htmlFor="note" className="text-right pt-2">メモ</Label>
                  <Textarea
                    id="note"
                    value={person.note || ''}
                    disabled
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/people/${id}`)}
          disabled={saving}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[100px]"
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  )
}


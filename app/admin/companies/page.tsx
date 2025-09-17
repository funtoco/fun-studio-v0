"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Building2 } from "lucide-react"
import { companies, type Company } from "@/data/companies"

export default function CompaniesAdminPage() {
  const [companyList, setCompanyList] = useState<Company[]>(companies)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Partial<Company>>({})

  const handleAddCompany = () => {
    setFormData({
      name: "",
      isActive: true,
    })
    setEditingCompany(null)
    setIsAddDialogOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setFormData(company)
    setEditingCompany(company)
    setIsAddDialogOpen(true)
  }

  const handleSaveCompany = () => {
    if (editingCompany) {
      // Update existing company
      setCompanyList((prev) => prev.map((c) => (c.id === editingCompany.id ? { ...(formData as Company) } : c)))
    } else {
      // Add new company
      const newCompany: Company = {
        ...(formData as Company),
        id: `company-${Date.now()}`,
      }
      setCompanyList((prev) => [...prev, newCompany])
    }
    setIsAddDialogOpen(false)
    setFormData({})
    setEditingCompany(null)
  }

  const handleToggleActive = (companyId: string) => {
    setCompanyList((prev) => prev.map((c) => (c.id === companyId ? { ...c, isActive: !c.isActive } : c)))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">法人管理</h1>
          <p className="text-muted-foreground">登録支援機関が担当する法人の管理</p>
        </div>
        <Button onClick={handleAddCompany} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>新規法人登録</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総法人数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyList.length}</div>
            <p className="text-xs text-muted-foreground">登録済み法人</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブ法人</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{companyList.filter((c) => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">稼働中の法人</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>登録法人一覧</CardTitle>
          <CardDescription>担当している法人の詳細情報と管理</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>法人ID</TableHead>
                <TableHead>法人名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyList.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Badge variant="outline">{company.id}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{company.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={company.isActive} onCheckedChange={() => handleToggleActive(company.id)} />
                      <Badge variant={company.isActive ? "default" : "secondary"}>
                        {company.isActive ? "アクティブ" : "非アクティブ"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditCompany(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "法人情報編集" : "新規法人登録"}</DialogTitle>
            <DialogDescription>法人の基本情報を入力してください。</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">法人名 *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="株式会社○○"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive ?? true}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">アクティブ状態</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveCompany}>{editingCompany ? "更新" : "登録"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


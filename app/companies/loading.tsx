export default function CompaniesLoading() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
        <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    </div>
  )
}

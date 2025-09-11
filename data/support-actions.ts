import type { SupportAction } from "@/lib/models"

const categories = [
  "銀行対応",
  "水道",
  "電気",
  "ガス",
  "住民票",
  "SIM/ネット",
  "病院",
  "試験申込",
  "送金",
  "交通/IC",
  "パスポート",
  "ビザ更新",
  "年末調整",
  "住居",
  "退職後",
  "その他",
]

const statuses: ("open" | "in_progress" | "done")[] = ["open", "in_progress", "done"]
const assignees = ["田中", "佐藤", "鈴木", "高橋", "渡辺"]

export const supportActions: SupportAction[] = Array.from({ length: 50 }, (_, i) => {
  const personIndex = (i % 20) + 1
  const personId = `p${personIndex.toString().padStart(3, "0")}`
  const category = categories[i % categories.length]
  const status = statuses[i % statuses.length]
  const assignee = assignees[i % assignees.length]

  const createdDate = new Date(2025, 3, 1 + i) // 2025年4月から
  const dueDate = new Date(createdDate.getTime() + (7 + (i % 14)) * 24 * 60 * 60 * 1000)

  const titles: Record<string, string[]> = {
    銀行対応: ["口座開設サポート", "ATM使用方法説明", "振込手続き支援", "住所変更手続き"],
    水道: ["水道開栓手続き", "料金支払い方法案内", "水道局への連絡代行"],
    電気: ["電気契約手続き", "料金プラン変更", "停電時の対応説明"],
    ガス: ["ガス開栓立会い", "ガス料金支払い設定", "ガス器具使用説明"],
    住民票: ["住民票取得代行", "転入届提出支援", "マイナンバー申請"],
    "SIM/ネット": ["携帯契約サポート", "WiFi設定支援", "料金プラン相談"],
    病院: ["病院予約代行", "診察同行通訳", "健康保険手続き"],
    試験申込: ["JLPT申込支援", "資格試験情報提供", "受験料支払い代行"],
    送金: ["送金方法説明", "手数料比較案内", "送金カード作成"],
    "交通/IC": ["ICカード購入", "定期券申込", "交通ルート案内"],
    パスポート: ["パスポート更新", "大使館予約代行", "必要書類準備"],
    ビザ更新: ["ビザ書類作成", "入管同行", "更新手続き説明"],
    年末調整: ["年末調整書類作成", "控除証明書取得", "税務署手続き"],
    住居: ["賃貸契約支援", "引越し手続き", "近隣挨拶同行"],
    退職後: ["退職手続き支援", "失業保険申請", "転職活動サポート"],
    その他: ["各種手続き支援", "生活相談", "緊急時対応"],
  }

  const categoryTitles = titles[category] || ["一般的なサポート"]
  const title = categoryTitles[i % categoryTitles.length]

  return {
    id: `sa${(i + 1).toString().padStart(3, "0")}`,
    personId,
    category,
    title,
    detail: `${title}に関する詳細な対応内容。進捗状況: ${status}`,
    status,
    assignee,
    due: status !== "done" ? dueDate.toISOString().split("T")[0] : undefined,
    createdAt: createdDate.toISOString(),
    updatedAt: new Date(createdDate.getTime() + (i % 5) * 24 * 60 * 60 * 1000).toISOString(),
  }
})

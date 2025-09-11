import type { Meeting } from "@/lib/models"

export const meetings: Meeting[] = [
  {
    id: "m001",
    personId: "p001",
    kind: "仕事",
    title: "月次面談 - 勤務状況確認",
    datetime: "2025-06-10T10:00:00Z",
    durationMin: 60,
    attendees: ["田中", "RENO MAULY ADINUGRAHA"],
    createdBy: "田中",
    notes: [
      {
        section: "仕事関連",
        item: "勤務日数・勤務時間",
        level: "中",
        detail: "残業時間が月40時間程度で適切。休暇も取得できている。",
      },
      {
        section: "仕事関連",
        item: "仕事内容・業務内容",
        level: "大",
        detail: "新しいプロジェクトに参加し、技術スキルが向上している。",
      },
      {
        section: "健康・生活状況",
        item: "健康状態（軽度不調含め）",
        level: "小",
        detail: "特に問題なし。睡眠も十分取れている。",
      },
    ],
    createdAt: "2025-06-10T09:30:00Z",
    updatedAt: "2025-06-10T11:00:00Z",
  },
  {
    id: "m002",
    personId: "p002",
    kind: "プライベート",
    title: "生活相談 - 住居について",
    datetime: "2025-06-09T14:00:00Z",
    durationMin: 45,
    attendees: ["佐藤", "Raffi Test"],
    createdBy: "佐藤",
    notes: [
      {
        section: "健康・生活状況",
        item: "生活リズム",
        level: "中",
        detail: "新しいアパートに引っ越し予定。現在の住環境に不満がある。",
      },
      {
        section: "日々の対応報告",
        item: "住居関連対応",
        level: "大",
        detail: "不動産会社との契約手続きをサポート。保証人の手配も完了。",
      },
    ],
    createdAt: "2025-06-09T13:30:00Z",
    updatedAt: "2025-06-09T14:45:00Z",
  },
  {
    id: "m003",
    personId: "p003",
    kind: "仕事",
    title: "キャリア相談",
    datetime: "2025-06-08T16:00:00Z",
    durationMin: 90,
    attendees: ["鈴木", "TEST WAKABA NAKAMURA"],
    createdBy: "鈴木",
    notes: [
      {
        section: "キャリア・目標",
        item: "JLPT、NAT、TOEIC 受験計画",
        level: "大",
        detail: "JLPT N2を12月に受験予定。現在勉強中。",
      },
      {
        section: "キャリア・目標",
        item: "給与、昇格",
        level: "中",
        detail: "来年の昇進を目指している。必要なスキルを確認。",
      },
      {
        section: "仕事関連",
        item: "仕事内容・業務内容",
        level: "中",
        detail: "リーダーシップを発揮する機会が増えている。",
      },
    ],
    createdAt: "2025-06-08T15:30:00Z",
    updatedAt: "2025-06-08T17:30:00Z",
  },
  {
    id: "m004",
    personId: "p004",
    kind: "仕事",
    title: "ストレス相談",
    datetime: "2025-06-07T11:00:00Z",
    durationMin: 60,
    attendees: ["高橋", "NGUYEN VAN MINH"],
    createdBy: "高橋",
    notes: [
      {
        section: "メンタル・ストレス系",
        item: "ストレス負荷",
        level: "大",
        detail: "職場での人間関係にストレスを感じている。",
      },
      {
        section: "メンタル・ストレス系",
        item: "トラブル",
        level: "中",
        detail: "上司とのコミュニケーションに課題がある。改善策を検討。",
      },
      {
        section: "健康・生活状況",
        item: "健康状態（軽度不調含め）",
        level: "中",
        detail: "睡眠不足が続いている。ストレスが原因と思われる。",
      },
    ],
    createdAt: "2025-06-07T10:30:00Z",
    updatedAt: "2025-06-07T12:00:00Z",
  },
  {
    id: "m005",
    personId: "p005",
    kind: "プライベート",
    title: "家族との連絡について",
    datetime: "2025-06-06T13:30:00Z",
    durationMin: 30,
    attendees: ["渡辺", "CHEN WEI MING"],
    createdBy: "渡辺",
    notes: [
      {
        section: "健康・生活状況",
        item: "家族との連絡頻度",
        level: "中",
        detail: "毎日家族と連絡を取っている。仕送りも定期的に行っている。",
      },
      {
        section: "日々の対応報告",
        item: "送金対応",
        level: "小",
        detail: "送金方法について説明。手数料の安い方法を案内。",
      },
    ],
    createdAt: "2025-06-06T13:00:00Z",
    updatedAt: "2025-06-06T14:00:00Z",
  },
  {
    id: "m006",
    personId: "p006",
    kind: "仕事",
    title: "業務改善提案",
    datetime: "2025-06-05T15:00:00Z",
    durationMin: 75,
    attendees: ["田中", "PARK JI HOON"],
    createdBy: "田中",
    notes: [
      {
        section: "仕事関連",
        item: "仕事内容・業務内容",
        level: "大",
        detail: "新しいシステム導入の提案を行った。効率化が期待される。",
      },
      {
        section: "キャリア・目標",
        item: "給与、昇格",
        level: "中",
        detail: "プロジェクトリーダーとしての役割を希望している。",
      },
    ],
    createdAt: "2025-06-05T14:30:00Z",
    updatedAt: "2025-06-05T16:15:00Z",
  },
  {
    id: "m007",
    personId: "p007",
    kind: "プライベート",
    title: "健康診断結果相談",
    datetime: "2025-06-04T09:00:00Z",
    durationMin: 45,
    attendees: ["佐藤", "MARIA SANTOS"],
    createdBy: "佐藤",
    notes: [
      {
        section: "健康・生活状況",
        item: "健康状態（軽度不調含め）",
        level: "中",
        detail: "健康診断で軽度の貧血が指摘された。食事改善を検討。",
      },
      {
        section: "日々の対応報告",
        item: "病院対応",
        level: "大",
        detail: "専門医への紹介状を取得。通訳サポートも手配。",
      },
    ],
    createdAt: "2025-06-04T08:30:00Z",
    updatedAt: "2025-06-04T09:45:00Z",
  },
  {
    id: "m008",
    personId: "p008",
    kind: "仕事",
    title: "技術研修フォローアップ",
    datetime: "2025-06-03T14:30:00Z",
    durationMin: 60,
    attendees: ["鈴木", "KUMAR RAJESH"],
    createdBy: "鈴木",
    notes: [
      {
        section: "仕事関連",
        item: "仕事内容・業務内容",
        level: "大",
        detail: "AI技術の研修を完了。実務での活用方法を検討中。",
      },
      {
        section: "キャリア・目標",
        item: "JLPT、NAT、TOEIC 受験計画",
        level: "中",
        detail: "技術文書の理解向上のため、日本語能力向上に取り組む。",
      },
    ],
    createdAt: "2025-06-03T14:00:00Z",
    updatedAt: "2025-06-03T15:30:00Z",
  },
  {
    id: "m009",
    personId: "p009",
    kind: "プライベート",
    title: "進学相談",
    datetime: "2025-06-02T10:30:00Z",
    durationMin: 90,
    attendees: ["高橋", "TANAKA YUKI"],
    createdBy: "高橋",
    notes: [
      {
        section: "キャリア・目標",
        item: "特定技能からのキャリア変更希望（技人国等）",
        level: "大",
        detail: "大学院進学を検討中。研究分野と入学要件を確認。",
      },
      {
        section: "日々の対応報告",
        item: "試験申し込み対応",
        level: "中",
        detail: "入学試験の申込方法と必要書類について説明。",
      },
    ],
    createdAt: "2025-06-02T10:00:00Z",
    updatedAt: "2025-06-02T12:00:00Z",
  },
  {
    id: "m010",
    personId: "p010",
    kind: "仕事",
    title: "文化適応サポート",
    datetime: "2025-06-01T16:00:00Z",
    durationMin: 45,
    attendees: ["渡辺", "AHMED HASSAN"],
    createdBy: "渡辺",
    notes: [
      {
        section: "メンタル・ストレス系",
        item: "精神的疲れ",
        level: "中",
        detail: "日本の職場文化への適応に時間がかかっている。",
      },
      {
        section: "仕事関連",
        item: "業務上困っていること",
        level: "中",
        detail: "会議での発言タイミングが分からない。アドバイスを提供。",
      },
    ],
    createdAt: "2025-06-01T15:30:00Z",
    updatedAt: "2025-06-01T16:45:00Z",
  },
]

// 追加の面談データ（合計40件になるよう）
const additionalMeetings: Meeting[] = Array.from({ length: 30 }, (_, i) => {
  const personIndex = (i % 20) + 1
  const personId = `p${personIndex.toString().padStart(3, "0")}`
  const isWork = i % 2 === 0
  const meetingDate = new Date(2025, 4, 1 + i) // 2025年5月から

  return {
    id: `m${(i + 11).toString().padStart(3, "0")}`,
    personId,
    kind: isWork ? "仕事" : "プライベート",
    title: isWork ? `定期面談 ${i + 1}` : `生活相談 ${i + 1}`,
    datetime: meetingDate.toISOString(),
    durationMin: 30 + (i % 4) * 15,
    attendees: [["田中", "佐藤", "鈴木", "高橋", "渡辺"][i % 5]],
    createdBy: ["田中", "佐藤", "鈴木", "高橋", "渡辺"][i % 5],
    notes: [
      {
        section: isWork ? "仕事関連" : "健康・生活状況",
        item: isWork ? "仕事内容・業務内容" : "生活リズム",
        level: ["大", "中", "小"][i % 3] as "大" | "中" | "小",
        detail: `面談記録 ${i + 1}: 順調に進んでいる。`,
      },
    ],
    createdAt: new Date(meetingDate.getTime() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(meetingDate.getTime() + 60 * 60 * 1000).toISOString(),
  }
})

export const allMeetings = [...meetings, ...additionalMeetings]

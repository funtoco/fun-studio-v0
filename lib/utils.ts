import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Person, Visa, Meeting, SupportAction, ActivityItem } from "./models"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities for Japanese locale
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    ...options,
  })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Calculate days until expiry
export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Check if visa is expiring soon (within 30 days)
export function isExpiringSoon(expiryDate: string, days = 30): boolean {
  return getDaysUntilExpiry(expiryDate) <= days
}

// Get visa status color
export function getVisaStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    書類準備中: "bg-gray-100 text-gray-800",
    書類作成中: "bg-blue-100 text-blue-800",
    書類確認中: "bg-yellow-100 text-yellow-800",
    申請準備中: "bg-orange-100 text-orange-800",
    ビザ申請準備中: "bg-purple-100 text-purple-800",
    申請中: "bg-indigo-100 text-indigo-800",
    ビザ取得済み: "bg-green-100 text-green-800",
  }
  return statusColors[status] || "bg-gray-100 text-gray-800"
}

// Get support action status color
export function getSupportStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
  }
  return statusColors[status] || "bg-gray-100 text-gray-800"
}

// Generate activity timeline from various data sources
export function generateActivityTimeline(
  people: Person[],
  visas: Visa[],
  meetings: Meeting[],
  supportActions: SupportAction[],
): ActivityItem[] {
  const activities: ActivityItem[] = []

  // Add meeting activities
  meetings.forEach((meeting) => {
    const person = people.find((p) => p.id === meeting.personId)
    if (person) {
      activities.push({
        id: meeting.id,
        type: "meeting",
        title: meeting.title,
        personName: person.name,
        datetime: meeting.datetime,
        link: `/people/${person.id}?tab=meetings`,
      })
    }
  })

  // Add visa activities
  visas.forEach((visa) => {
    const person = people.find((p) => p.id === visa.personId)
    if (person) {
      activities.push({
        id: visa.id,
        type: "visa",
        title: `ビザ状況更新: ${visa.status}`,
        personName: person.name,
        datetime: visa.updatedAt,
        status: visa.status,
        link: `/visas`,
      })
    }
  })

  // Add support action activities
  supportActions.forEach((action) => {
    const person = people.find((p) => p.id === action.personId)
    if (person) {
      activities.push({
        id: action.id,
        type: "support",
        title: action.title,
        personName: person.name,
        datetime: action.updatedAt,
        status: action.status,
        link: `/actions`,
      })
    }
  })

  // Sort by datetime (newest first)
  return activities.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
}

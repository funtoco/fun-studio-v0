"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MeetingNote } from "@/lib/models"

interface TreeNoteViewProps {
  notes: MeetingNote[]
  className?: string
}

export function TreeNoteView({ notes, className }: TreeNoteViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Group notes by section
  const groupedNotes = notes.reduce(
    (acc, note) => {
      if (!acc[note.section]) {
        acc[note.section] = []
      }
      acc[note.section].push(note)
      return acc
    },
    {} as Record<string, MeetingNote[]>,
  )

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  if (notes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">面談記録がありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {Object.entries(groupedNotes).map(([section, sectionNotes]) => {
        const isExpanded = expandedSections.has(section)

        return (
          <Card key={section} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center gap-2 w-full text-left hover:bg-muted/50 rounded p-2 -m-2 transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-medium">{section}</span>
                <Badge variant="secondary" className="ml-auto">
                  {sectionNotes.length}
                </Badge>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="mt-3 ml-6 space-y-3">
                  {sectionNotes.map((note, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{note.item}</span>
                            {note.level && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  note.level === "大" && "border-red-200 text-red-700",
                                  note.level === "中" && "border-yellow-200 text-yellow-700",
                                  note.level === "小" && "border-green-200 text-green-700",
                                )}
                              >
                                {note.level}
                              </Badge>
                            )}
                          </div>
                          {note.detail && <p className="text-sm text-muted-foreground mt-1">{note.detail}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

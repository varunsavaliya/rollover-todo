"use client"

import type { Task } from "@/contexts/todo-context"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface CompletedTaskCardProps {
  task: Task
}

export default function CompletedTaskCard({ task }: CompletedTaskCardProps) {
  const completedDate = task.completedAt
    ? new Date(task.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : ""

  const completedTime = task.completedAt
    ? new Date(task.completedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : ""

  return (
    <Card className="p-3 bg-secondary/50 border border-border/50">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm line-clamp-1 text-foreground font-medium">{task.title}</p>
          {completedTime && (
            <p className="text-xs text-muted-foreground mt-1">
              Completed {completedDate} at {completedTime}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TaskCard from "./task-card"
import { ChevronDown } from "lucide-react"
import type { Task, Project } from "@/contexts/todo-context"
import { getRolloverColor } from "@/lib/utils"

interface TaskAccordionProps {
  project: Project
  tasks: Task[]
}

export default function TaskAccordion({ project, tasks }: TaskAccordionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const pendingCount = tasks.filter((t) => !t.completed).length
  const maxRollover = tasks.length > 0 ? Math.max(...tasks.map((t) => t.rolloverCount)) : 0
  const rolloverColor = getRolloverColor(maxRollover)

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between px-4 py-3 h-auto hover:bg-secondary/50"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
            <div className="text-left">
              <h3 className="font-semibold [font-family:var(--font-heading)] text-sm">{project.name}</h3>
              <p className="text-xs text-muted-foreground">
                {pendingCount} pending {pendingCount === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>
          {maxRollover > 0 && (
            <span className={`text-xs font-bold rounded-full px-2 py-1 ${rolloverColor}`}>{maxRollover}</span>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="px-4 py-3 space-y-2 bg-secondary/20">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No pending tasks</p>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} onTaskModified={() => {}} />)
          )}
        </div>
      )}
    </Card>
  )
}

"use client"

import { useTodo, type Task } from "@/contexts/todo-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2, ArrowRight } from "lucide-react"
import { useState } from "react"
import { getRolloverColor } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onTaskModified: () => void
}

export default function TaskCard({ task, onTaskModified }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask, moveTask, projects } = useTodo()
  const [isOpen, setIsOpen] = useState(false)

  const activeProjects = projects.filter((p) => !p.archived)
  const currentProject = projects.find((p) => p.id === task.projectId)
  const rolloverColor = getRolloverColor(task.rolloverCount)

  const handleMoveProject = (newProjectId: string) => {
    moveTask(task.id, newProjectId)
    setIsOpen(false)
  }

  return (
    <Card className="p-3 bg-card hover:shadow-md transition-shadow border border-border">
      <div className="flex items-start gap-3">
        <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskComplete(task.id)} className="mt-1" />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 [font-family:var(--font-heading)]">
            {task.title}
          </h3>
          {task.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>}

          <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
            <span className="text-muted-foreground">{currentProject?.name}</span>
            <span className={`rounded-full px-2 py-1 font-semibold text-xs ${rolloverColor}`}>
              {task.rolloverCount}
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {activeProjects.length > 1 && (
              <>
                <DropdownMenuLabel className="text-xs">Move to Project</DropdownMenuLabel>
                {activeProjects
                  .filter((p) => p.id !== task.projectId)
                  .map((proj) => (
                    <DropdownMenuItem key={proj.id} onClick={() => handleMoveProject(proj.id)} className="text-sm">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {proj.name}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              onClick={() => {
                deleteTask(task.id)
                setIsOpen(false)
              }}
              className="text-destructive text-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

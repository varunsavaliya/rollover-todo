"use client"

import { useTodo } from "@/contexts/todo-context"
import { Button } from "@/components/ui/button"
import ProjectDialog from "./project-dialog"
import { Plus, Archive } from "lucide-react"
import { useState } from "react"
import { getRolloverColor } from "@/lib/utils"

interface SidebarProps {
  selectedProjectId: string
  onSelectProject: (id: string) => void
  onViewArchived: () => void
}

export default function Sidebar({ selectedProjectId, onSelectProject, onViewArchived }: SidebarProps) {
  const { projects, archiveProject, tasks, deleteProject } = useTodo()
  const [showDialog, setShowDialog] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const activeProjects = projects.filter((p) => !p.archived)
  const archivedProjects = projects.filter((p) => p.archived)

  const getHighestRolloverForProject = (projectId: string): number => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId && !t.completed)
    return projectTasks.length > 0 ? Math.max(...projectTasks.map((t) => t.rolloverCount)) : 0
  }

  const handleArchiveProject = (projectId: string) => {
    archiveProject(projectId)
    if (selectedProjectId === projectId) {
      onSelectProject(activeProjects[0]?.id || "")
    }
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground mb-1 [font-family:var(--font-heading)]">Projects</h1>
        <p className="text-sm text-muted-foreground">Organize your work</p>
      </div>

      {/* Active Projects */}
      <div className="flex-1 overflow-auto space-y-2">
        {activeProjects.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No projects yet</p>
        ) : (
          activeProjects.map((project) => {
            const rolloverCount = getHighestRolloverForProject(project.id)
            const isSelected = selectedProjectId === project.id
            const rolloverColor = getRolloverColor(rolloverCount)

            return (
              <div key={project.id} className="group relative">
                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium text-sm [font-family:var(--font-heading)] ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{project.name}</span>
                    {rolloverCount > 0 && (
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 whitespace-nowrap ${rolloverColor}`}>
                        {rolloverCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleArchiveProject(project.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                  title="Archive project"
                >
                  <Archive className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-auto space-y-2 pt-4 border-t border-sidebar-border">
        <Button
          onClick={() => setShowDialog(true)}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>

        {archivedProjects.length > 0 && (
          <Button variant="outline" onClick={onViewArchived} className="w-full gap-2 text-xs bg-transparent">
            <Archive className="h-3 w-3" />
            Archived ({archivedProjects.length})
          </Button>
        )}
      </div>

      {/* Project Dialog */}
      <ProjectDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  )
}
